"""
照片優化腳本：將會員照片壓縮到網頁適用的尺寸
目標：單檔 < 500 KB，解析度適合網頁顯示（最大寬度 800px）
"""
import json
from pathlib import Path
from PIL import Image
import os

# 設定
PHOTO_ROOT = Path("會員照片/正式會員-20251105T073702Z-1-001/正式會員")
OUTPUT_ROOT = Path("images/members")
MAX_WIDTH = 800
MAX_SIZE_KB = 500
QUALITY = 85  # JPEG 品質（85 是很好的平衡點）

def optimize_image(input_path: Path, output_path: Path):
    """優化單張照片"""
    try:
        img = Image.open(input_path)
        
        # 轉換 RGBA 為 RGB（如果是 PNG）
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # 調整尺寸
        if img.width > MAX_WIDTH:
            ratio = MAX_WIDTH / img.width
            new_height = int(img.height * ratio)
            img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)
        
        # 確保輸出目錄存在
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # 儲存優化後的照片
        output_path_str = str(output_path)
        if output_path.suffix.lower() in ['.png', '.webp']:
            # PNG/WebP 轉為 JPEG 以減少檔案大小
            output_path = output_path.with_suffix('.jpg')
            output_path_str = str(output_path)
        
        # 嘗試不同品質直到檔案大小符合要求
        quality = QUALITY
        for attempt in range(5):
            img.save(output_path_str, 'JPEG', quality=quality, optimize=True)
            size_kb = output_path.stat().st_size / 1024
            
            if size_kb <= MAX_SIZE_KB:
                break
            
            # 如果檔案還是太大，降低品質
            quality -= 10
            if quality < 50:
                # 如果品質太低，進一步縮小尺寸
                new_width = int(img.width * 0.9)
                new_height = int(img.height * 0.9)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                quality = 75
        
        return output_path, size_kb
    except Exception as e:
        print(f"錯誤：無法處理 {input_path}: {e}")
        return None, 0

def main():
    # 讀取 members.json
    members_json = Path("data/members.json")
    if not members_json.exists():
        print("錯誤：找不到 data/members.json")
        return
    
    data = json.loads(members_json.read_text(encoding='utf-8'))
    members = data.get('members', [])
    
    # 統計資訊
    optimized_count = 0
    skipped_count = 0
    total_original_size = 0
    total_optimized_size = 0
    updated_paths = []
    
    print("開始優化照片...")
    print(f"找到 {len(members)} 位會員\n")
    
    for member in members:
        name = member.get('name')
        original_path = Path(member.get('photo', ''))
        
        if not original_path or not original_path.exists():
            print(f"⚠️  跳過 {name}：找不到照片 {original_path}")
            skipped_count += 1
            continue
        
        # 計算原始檔案大小
        original_size_kb = original_path.stat().st_size / 1024
        total_original_size += original_size_kb
        
        # 建立輸出路徑：images/members/會員名稱.jpg
        safe_name = name.replace(' ', '_').replace('/', '_')
        output_path = OUTPUT_ROOT / f"{safe_name}.jpg"
        
        # 如果已經優化過且檔案存在，跳過
        if output_path.exists():
            optimized_size_kb = output_path.stat().st_size / 1024
            total_optimized_size += optimized_size_kb
            print(f"✓ {name}: 已存在優化版本 ({optimized_size_kb:.1f} KB)")
            member['photo'] = str(output_path).replace('\\', '/')
            updated_paths.append({'name': name, 'original': str(original_path), 'optimized': str(output_path)})
            optimized_count += 1
            continue
        
        # 優化照片
        result_path, optimized_size_kb = optimize_image(original_path, output_path)
        
        if result_path:
            total_optimized_size += optimized_size_kb
            reduction = ((original_size_kb - optimized_size_kb) / original_size_kb) * 100
            print(f"✓ {name}: {original_size_kb:.1f} KB → {optimized_size_kb:.1f} KB (減少 {reduction:.1f}%)")
            
            # 更新 JSON 中的路徑
            member['photo'] = str(result_path).replace('\\', '/')
            updated_paths.append({
                'name': name,
                'original': str(original_path),
                'optimized': str(result_path),
                'original_size_kb': round(original_size_kb, 2),
                'optimized_size_kb': round(optimized_size_kb, 2)
            })
            optimized_count += 1
        else:
            skipped_count += 1
    
    # 儲存更新後的 members.json
    members_json.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    
    # 儲存優化報告
    report = {
        'summary': {
            'total_members': len(members),
            'optimized': optimized_count,
            'skipped': skipped_count,
            'total_original_size_mb': round(total_original_size / 1024, 2),
            'total_optimized_size_mb': round(total_optimized_size / 1024, 2),
            'reduction_percentage': round(((total_original_size - total_optimized_size) / total_original_size) * 100, 2) if total_original_size > 0 else 0
        },
        'details': updated_paths
    }
    
    report_path = Path('data/photo-optimization-report.json')
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    
    print(f"\n{'='*60}")
    print("優化完成！")
    print(f"{'='*60}")
    print(f"總會員數：{len(members)}")
    print(f"成功優化：{optimized_count}")
    print(f"跳過：{skipped_count}")
    print(f"原始總大小：{total_original_size/1024:.2f} MB")
    print(f"優化後總大小：{total_optimized_size/1024:.2f} MB")
    print(f"減少：{((total_original_size - total_optimized_size) / total_original_size) * 100:.1f}%")
    print(f"\n優化報告已儲存至：{report_path}")
    print(f"優化後照片位於：{OUTPUT_ROOT}")

if __name__ == '__main__':
    try:
        main()
    except ImportError:
        print("錯誤：需要安裝 Pillow 套件")
        print("請執行：pip install Pillow")
    except Exception as e:
        print(f"發生錯誤：{e}")
        import traceback
        traceback.print_exc()

