# EverShine BNI 商會形象網站

專業的 BNI 商務引薦平台形象網站，採用星空霓彩配色與動態星雲視覺，對應最新會員資料與照片。

## 專案特色

- 單頁式響應式設計
- 星空霓彩主題、動態星雲背景
- 會員產業別篩選功能
- 關鍵數字動態展示
- 會員卡片包含服務項目、Hashtag 與社群連結

## 技術架構

- HTML5
- CSS3 (響應式設計)
- Vanilla JavaScript (類別化設計)
- JSON 資料格式
- Canvas API (星空渲染)
- CSS Animations (星星動畫)

## 星空背景系統架構

### 設計原則

本專案遵循 **DRY (Don't Repeat Yourself)** 和 **KISS (Keep It Simple, Stupid)** 原則：

- **DRY**: 所有配置集中管理在 `StarrySkyConfig` 類別中，避免重複代碼
- **KISS**: 簡單清晰的實現，易於理解和維護

### 系統架構

星空背景系統分為兩個部分：

#### 1. Canvas 星空（Hero Section）

- **位置**: Hero 區塊背景
- **技術**: HTML5 Canvas API
- **功能**:
  - 繪製帶光暈效果的星星（約1500顆）
  - 星雲飄移動畫（8個星雲）
  - 星星閃爍動畫
- **檔案**: `js/starry-background-unified.js` → `StarrySkyManager.initCanvasSky()`

#### 2. CSS 星空（其他 Sections）

- **位置**: Hero 以外的所有區塊背景
- **技術**: CSS `box-shadow` + CSS Animations
- **組成**:
  - **靜態星星層**（4層，共9000顆）：
    - 使用 `box-shadow` 生成大量星星點
    - 每層有不同的閃爍動畫速度
    - 帶有光暈效果（雙層 `box-shadow`）
  - **移動星星層**（2層，共1000顆）：
    - 緩慢移動的星星
    - 從右下到左上的移動動畫
  - **流星**（5-10顆，隨機）：
    - 360度隨機方向
    - 符合物理定律的拖曳尾巴
    - 尾巴長度與速度成正比
    - 亮度隨距離指數衰減
- **檔案**: `js/starry-background-unified.js` → `StarrySkyManager.initCSSSky()`

### 配置說明

所有配置都在 `StarrySkyConfig` 類別中：

```javascript
// 靜態星星配置
staticStars: [
    { count: 3000, size: '1px', twinkleSpeed: '3s' },
    { count: 2500, size: '1px', twinkleSpeed: '4s' },
    { count: 2000, size: '1px', twinkleSpeed: '5s' },
    { count: 1500, size: '1px', twinkleSpeed: '6s' }
]

// 流星配置
shootingStars: {
    minCount: 5,
    maxCount: 10,
    minSpeed: 3,  // 秒
    maxSpeed: 12, // 秒
    minTailLength: 80,  // px
    maxTailLength: 150, // px
    glowIntensity: 0.9,
    tailFadeSteps: 20
}
```

### 診斷與除錯

如果星星不顯示，請檢查：

1. **瀏覽器控制台**: 查看是否有錯誤訊息
2. **元素檢查**: 確認 `.starry-background-container` 是否存在
3. **CSS 層級**: 確認 `z-index` 設定正確（背景：-1，內容：1+）
4. **背景顏色**: 確認 `body` 背景為黑色 `#000`
5. **初始化時機**: 確認在 DOM 載入完成後初始化

### 性能優化

- 使用 `box-shadow` 而非大量 DOM 元素（CSS 星空）
- 使用 `requestAnimationFrame` 進行 Canvas 動畫
- 視窗大小變化時才重新生成星星
- 流星使用 CSS 動畫而非 JavaScript 動畫

## 最新更新（2025-11）

- 更新全站配色：`#005391`（背景）、`#4ca8df`（重點）、`#1d2f38`（輔色）與星雲粒子動畫。
- 會員資料新增欄位：
  - `services`：至多 4 項服務項目（自動由描述拆出，亦可手動維護）。
  - `hashtags`：預設以產業 + 品牌標籤組成，供前端顯示膠囊標籤。
  - `social`：社群/網站連結（含自動補齊 `https://`）。
- 新增 `data/photo-manifest.json`，記錄照片指派與缺漏名單；目前僅缺少 `簡若凱` 照片，其餘 58 位已對應。
- 將會員照片統一使用 `會員照片/正式會員-20251105T073702Z-1-001/正式會員/` 內的最新素材。

## 部署

本專案部署於 GitHub Pages：https://dreamone09.github.io/EverShine/

## 本地開發

直接開啟 `index.html` 即可在瀏覽器中預覽。

## 專案結構

```
EverShine/
├── index.html          # 主要單頁網站
├── css/
│   └── style.css       # 主樣式檔
├── js/
│   └── main.js         # 互動功能
├── data/
│   ├── members.json    # 會員資料（含 services/hashtags/social）
│   └── photo-manifest.json # 自動產生的照片對應清單
├── scripts/
│   └── update_members.py # 會員資料同步腳本
└── images/
    ├── members/        # 會員照片
    └── assets/         # 其他資源
└── 會員照片/           # 最新會員照片來源（以子資料夾分類）

## 資料維護流程

1. 將最新會員照片放入 `會員照片/正式會員-20251105T073702Z-1-001/正式會員/`。
2. 執行 `py scripts/update_members.py`（Windows）或 `python3 scripts/update_members.py`（macOS/Linux）：
   - 自動更新 `data/members.json` 照片路徑。
   - 從描述拆解服務項目並更新 Hashtag。
   - 產製 `data/photo-manifest.json` 供稽核。
3. 若有缺漏照片，於 `photo-manifest.json` 的 `skipped` 名單補齊後再執行一次腳本。

> 提醒：目前資料集中已移除「簡若凱」一筆無照片紀錄，若後續取得照片，可於 `data/members.json` 手動補回並重新執行腳本。
```

