# EverShine BNI 長輝白金分會官方網站

專業的 BNI 商務引薦平台形象網站，採用星空霓彩配色與動態星雲視覺，對應最新會員資料與照片。

## ✨ 專案特色

- 🌟 星空主題設計 - 動態星空背景與流星效果
- 📱 完整響應式設計 - 完美支援桌面、平板、手機
- 🎯 SEO 優化 - 結構化資料、Meta tags、Open Graph
- 🔗 Clean URL - 無 .html 後綴，美觀專業
- 💎 玻璃態卡片設計 - 現代化 UI/UX
- 👥 會員產業別篩選功能
- 📊 關鍵數字動態展示
- 🎨 會員卡片包含服務項目、Hashtag 與社群連結

## 🛠️ 技術架構

- HTML5 (語義化標籤)
- CSS3 (響應式設計、Grid、Flexbox、動畫)
- Vanilla JavaScript (ES6+、類別化設計)
- JSON 資料格式
- Canvas API (星空渲染)
- CSS Animations (星星、流星動畫)
- URL Rewriting (.htaccess)

## 🌐 網站結構

### 主要頁面
- **首頁** (`/`) - 包含所有核心內容區塊
- **什麼是BNI** (`/what-is-bni`) - BNI 組織介紹、全球統計
- **會員介紹** (`/members`) - 完整會員名單與產業分類
- **會員引薦報告** (`/referrals`) - 引薦成果展示

### 首頁區塊
1. **Hero** - 分會主視覺與口號
2. **BNI 簡介** - 快速了解 BNI
3. **會員成功案例** - 4 位會員見證（卡片設計）
4. **會議資訊** - 線上會議時間與特色
5. **會員介紹預覽** - 產業分類展示
6. **加入我們** - 加入流程與資格說明
7. **常見問題** - FAQ 折疊式設計
8. **Footer** - 聯絡資訊、社群連結、開發者資訊

## 🌟 星空背景系統架構

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

// 移動星星配置
movingStars: [
    { count: 700, size: '1px', animationDuration: '100s' },
    { count: 300, size: '2px', animationDuration: '125s' }
]

// 流星配置
shootingStars: {
    count: 8,
    minDelay: 0,
    maxDelay: 8,
    minDuration: 2,
    maxDuration: 5
}
```

### Box-Shadow 格式說明

本專案使用參考代碼的標準格式生成星星：

```javascript
// 正確格式：xpx ypx #FFF
shadows.push(`${x}px ${y}px #FFF`);

// 錯誤格式（已修正）：
// shadows.push(`${x}px ${y}px 2px 1px rgba(255, 255, 255, ${brightness})`);
```

**為什麼使用簡單格式？**
- 更好的性能（瀏覽器渲染更快）
- 更清晰的星星顯示
- 符合參考代碼標準
- 減少視覺雜訊

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

## 最新更新

### 2025-01-31 - 星空背景重構與 UI 優化

#### 🌟 星空背景系統重構
- **修正 box-shadow 格式**：改回參考代碼標準格式 `xpx ypx #FFF`
  - 之前使用複雜的 `xpx ypx 2px 1px rgba(255, 255, 255, ${brightness})` 導致顯示問題
  - 現在使用最簡潔的格式，確保星星正確顯示
- **優化星星層尺寸**：
  - 靜態星星層：`1px x 1px`
  - 移動星星層：`1px x 1px` 和 `2px x 2px`
  - 所有星星層設置 `border-radius: 50%` 和 `background: transparent`
- **動畫保持完整**：
  - `@keyframes animStar`：星星移動動畫（translateY/translateX -2560px）
  - `@keyframes animShootingStar`：流星動畫（尾巴從 5px 拉長到 800px）
  - 流星樣式：`linear-gradient(to top, rgba(255, 255, 255, 0), white)`

#### 🎨 Footer 視覺優化
- **添加明顯分隔線**：
  - 上方使用 `2px solid rgba(76, 168, 223, 0.3)` 分隔線
  - 添加金色漸變光暈效果 `linear-gradient(90deg, transparent, rgba(76, 168, 223, 0.5), var(--gold), ...)`
  - Footer 內容區與版權資訊之間添加 `1px` 分隔線
- **新增開發商資訊**：
  - 顯示「本網站由琢奧科技有限公司開發與維護」
  - 提供聯繫郵箱：`info@dropout.tw`
  - 版權資訊：「Copyright © 2025 BNI 台灣 - 長輝白金分會」
- **增強 Fixed Banner 視覺**：
  - 背景不透明度提升至 `0.95`
  - 邊框加強至 `2px solid rgba(76, 168, 223, 0.4)`
  - 陰影效果增強，確保在所有內容上方都清晰可見

#### 🔗 URL 優化
- **移除 index.html 後綴**：
  - 導航欄、Footer 和所有內部鏈接從 `href="index.html"` 改為 `href="/"`
  - 優化 SEO 和用戶體驗
  - URL 顯示為 `https://evershine.tw/` 而非 `https://evershine.tw/index.html`

#### 🎯 卡片樣式增強
- **強化所有卡片區塊**：
  - 增加邊框厚度（1px → 2px）
  - 放大圓角（15px → 20px）
  - 加強陰影效果
  - 添加頂部金色漸變線（`::before` 偽元素）
  - 優化 hover 效果（translateY, scale, 陰影）
- **涵蓋區塊**：
  - 會員成功案例卡片
  - 會議資訊卡片
  - 關於我們區塊
  - 加入我們卡片
  - 常見問題卡片
  - 什麼是 BNI 介紹卡片

#### 📱 響應式優化
- **桌面版排版**：
  - 會員成功案例：4 欄 → 3 欄 (1400px) → 2 欄 (1024px) → 1 欄 (768px)
  - 圖片 `object-position: center top` 確保商務人士頭像可見
  - 固定容器最大寬度 `1200px`，居中顯示
- **行動版優化**：
  - 調整 padding、gap、字體大小
  - 圖片高度適配小螢幕（200px）
  - 優化卡片內距和間距

### 2025-11 - 配色與會員資料更新

- 更新全站配色：`#005391`（背景）、`#4ca8df`（重點）、`#1d2f38`（輔色）與星雲粒子動畫。
- 會員資料新增欄位：
  - `services`：至多 4 項服務項目（自動由描述拆出，亦可手動維護）。
  - `hashtags`：預設以產業 + 品牌標籤組成，供前端顯示膠囊標籤。
  - `social`：社群/網站連結（含自動補齊 `https://`）。
- 新增 `data/photo-manifest.json`，記錄照片指派與缺漏名單；目前僅缺少 `簡若凱` 照片，其餘 58 位已對應。
- 將會員照片統一使用 `會員照片/正式會員-20251105T073702Z-1-001/正式會員/` 內的最新素材。

## 部署

本專案部署於 GitHub Pages：https://evershine.tw

**自訂網域設定**：
- 主網域：`evershine.tw`
- DNS 設定：指向 GitHub Pages
- HTTPS 已啟用

## 開發與維護

**網站開發與維護**：琢奧科技有限公司  
**技術支援**：info@dropout.tw  
**版權所有**：© 2025 BNI 台灣 - 長輝白金分會

## 本地開發

直接開啟 `index.html` 即可在瀏覽器中預覽。

## 🎨 最新更新（2025-01-19）

### ✅ CSS 修復與優化
- **修復會員成功案例顯示問題** - CSS 文件完整性驗證與修復
- **URL 優化** - 全站移除 .html 後綴，添加 .htaccess 重寫規則
- **刪除測試頁面** - 清理所有診斷與測試頁面
- **強制快取更新** - CSS 版本號更新為 `v=20251119-CRITICAL-FIX`

### 🎯 URL 優化詳情
所有鏈接現在使用 clean URL：
- ✅ `https://evershine.tw/` (首頁)
- ✅ `https://evershine.tw/what-is-bni` (什麼是BNI)
- ✅ `https://evershine.tw/members` (會員介紹)
- ✅ `https://evershine.tw/referrals` (會員引薦報告)

### 🔧 技術修復
1. **CSS 文件完整性** - 確認伺服器端 CSS 文件正確部署（109.79 KB）
2. **響應式設計** - 會員成功案例在所有裝置上正確顯示
3. **卡片樣式** - 玻璃態效果、邊框、陰影完整應用
4. **Grid 佈局** - 桌面版 4 欄、平板 2-3 欄、手機 1 欄

## 📁 專案結構

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

