#!/usr/bin/env python3
"""
圖片優化腳本
1. 轉換PNG為WebP格式
2. 壓縮圖片
3. 創建響應式圖片
"""

import os
from PIL import Image
import subprocess

def optimize_image(input_path, output_path, quality=80):
    """優化單張圖片"""
    try:
        img = Image.open(input_path)
        
        # 轉換為WebP
        webp_path = output_path.replace('.png', '.webp').replace('.jpg', '.webp')
        img.save(webp_path, 'WEBP', quality=quality, method=6)
        
        original_size = os.path.getsize(input_path)
        webp_size = os.path.getsize(webp_path)
        savings = ((original_size - webp_size) / original_size) * 100
        
        print(f"✅ {os.path.basename(input_path)}")
        print(f"   原始: {original_size/1024:.1f}KB → WebP: {webp_size/1024:.1f}KB")
        print(f"   節省: {savings:.1f}%\n")
        
        return webp_path
    except Exception as e:
        print(f"❌ 錯誤: {input_path} - {e}")
        return None

def create_responsive_sizes(image_path, sizes=[320, 640, 1024, 1920]):
    """創建響應式圖片尺寸"""
    img = Image.open(image_path)
    base_name = os.path.splitext(image_path)[0]
    
    for size in sizes:
        if img.width > size:
            ratio = size / img.width
            new_height = int(img.height * ratio)
            resized = img.resize((size, new_height), Image.Resampling.LANCZOS)
            
            output_path = f"{base_name}-{size}w.webp"
            resized.save(output_path, 'WEBP', quality=85, method=6)
            print(f"   📐 創建 {size}w 版本")

# 主要圖片優化
images_to_optimize = [
    ('images/assets/background.png', 'images/assets/background.webp'),
    ('images/assets/logo/透明底白字長條logo.png', 'images/assets/logo/透明底白字長條logo.webp'),
    ('images/assets/logo/白色正方形logo.png', 'images/assets/logo/白色正方形logo.webp'),
]

print("========================================")
print("開始優化圖片...")
print("========================================\n")

for input_path, output_path in images_to_optimize:
    full_input = os.path.join('c:/Users/User/vibe coding/EverShine', input_path)
    full_output = os.path.join('c:/Users/User/vibe coding/EverShine', output_path)
    
    if os.path.exists(full_input):
        result = optimize_image(full_input, full_output, quality=85)
        
        # 為background創建響應式版本
        if 'background' in input_path and result:
            print("   創建響應式版本...")
            create_responsive_sizes(result)

print("========================================")
print("圖片優化完成！")
print("========================================")
