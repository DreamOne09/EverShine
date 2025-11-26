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

### 2025-11-24 - 電子書Lead Magnet系統

#### 📚 新增免費電子書下載功能
- **電子書內容**（5頁PDF）：
  - 標題：《如何運用引薦讓事業成長10倍》
  - 從中小企業主角度撰寫，清楚解釋什麼是引薦
  - 包含BNI經典成功故事：
    - Lou的百萬美元招牌引薦（15年持續合作）
    - 網頁設計師Mike從$77K到$208K的成長
    - 印刷廠老闆的轉變故事
  - Dr. Ivan Misner的引薦行銷智慧與真實引言
  - 實戰策略：24-7-30系統、Givers Gain®哲學、影響力圈建立
  - 長輝白金分會會員真實案例（200-300%成長）

- **下載頁面**（`ebook-download.html`）：
  - 玻璃態設計，與網站風格一致
  - 星空背景效果
  - Lead capture表單（姓名、Email、產業）
  - PDF自動發送到用戶信箱（需後端整合）
  - 成功案例展示（4位會員成長數據）

- **首頁CTA整合**：
  - 新增電子書下載區塊（位於"什麼是BNI"之後）
  - 列出5大亮點吸引下載
  - 一致的玻璃態卡片設計
  - 響應式佈局

#### 🎯 Lead Generation策略
- **目標**：將網站訪客轉換為潛在會員
- **流程**：
  1. 訪客在首頁看到電子書CTA
  2. 點擊進入下載頁面
  3. 填寫基本資料（姓名、Email、產業）
  4. PDF自動發送到信箱
  5. 24小時內聯繫邀請參加免費例會

#### 📁 新增文件
- `downloads/referral-growth-ebook.html` - 電子書內容（可列印/線上閱讀）
- `ebook-download.html` - 下載頁面（含lead capture表單）
- `EBOOK-INTEGRATION.md` - 整合指南（HTML + CSS代碼）

### 2025-11-22 - 全面優化：背景渲染、星空品質與內容整合

#### 🌟 背景渲染修復
- **修復非首頁白色背景問題**：
  - 為 `members.html`, `referrals.html`, `what-is-bni.html` 添加缺失的 `.global-background` 和 `#starrySkyCanvas` 元素
  - 所有頁面現在都有完整的星空背景

#### ✨ 星空品質提升
- **靜態星星優化**：
  - `spread radius` 從 `1px` 提升至 `1.5px`
  - 透明度調整為 `rgba(255, 255, 255, 0.95)`
  - 星星更清晰、更明亮
- **移動星星優化**：
  - `spread radius` 從 `2px` 提升至 `2.5px`
  - 同樣使用 `rgba(255, 255, 255, 0.95)` 提升清晰度
- **移除流星效果**：
  - 停用未正常運作的流星動畫
  - 保留背景星星的移動效果

#### 📐 首頁區塊重新排序
- **優化用戶理解流程**：
  1. **什麼是BNI** - 新增連結卡片，引導用戶了解BNI平台
  2. **關於我們** - 長輝白金分會的使命、願景、核心價值
  3. **成果會說話** - 整合數據與成效展示
  4. 其他區塊...

#### 🎯 成果區塊整合
- **合併兩個區塊**：
  - 將 `#meeting-info` 和 `#results` 整合為單一 `#results-unified` 區塊
  - 更簡潔有力的呈現方式
- **新增內容**：
  - 3個數據卡片（引薦單數、金額、產業連結）
  - 3個系統化流程項目（結構化交流、協同引薦、擴展網絡）
  - 4個會員優勢項目
- **視覺優化**：
  - 玻璃態卡片設計
  - 響應式網格佈局（桌面3欄、平板2欄、手機1欄）
  - Hover動畫效果

#### 🎨 新增CSS樣式
- **什麼是BNI連結區塊**：
  - `.what-is-bni-link-section`, `.bni-link-card`
  - 玻璃態卡片，帶有hover效果
- **成果會說話整合區塊**：
  - `.results-unified-section`, `.results-unified-card`
  - `.data-card-unified`, `.process-grid`, `.results-unified-benefits`
  - 完整響應式設計
- **總計新增**: 270+ 行CSS代碼

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

## 👥 會員資料系統（2025-01-26 新增）

### 系統概述

本網站採用 JSON 驅動的會員資料系統，支援動態載入和會員自助編輯功能。

### 資料來源

- **照片資料夾**: `images/members/`
- **會員識別**: 照片檔名（去除 `.jpg`）= 會員姓名
- **總計**: 54 位會員

### 資料結構

會員資料儲存於 `data/members-data.json`，每位會員包含以下欄位：

```json
{
  "id": "member-1",
  "name": "何昇軒",
  "photo": "images/members/何昇軒.jpg",
  "industry": "律師",
  "category": "企業顧問",
  "company": "何昇有限公司",
  "position": "董事長",
  "title": "何昇有限公司 董事長",
  "shortIntro": "專業的律師服務，致力於為客戶創造價值",
  "fullIntro": "我是何昇軒，擁有多年的律師產業經驗...",
  "links": [
    {
      "type": "website",
      "url": "https://example.com",
      "icon": "globe"
    }
  ],
  "services": ["律師諮詢", "專業顧問服務"],
  "hashtags": ["#律師", "#何昇軒", "#BNI長輝白金分會"],
  "createdAt": "2025-01-26T00:00:00Z",
  "updatedAt": "2025-01-26T00:00:00Z"
}
```

### 產業分類

會員自動分類至以下8個產業類別（使用 `category-mapping.js`）：

- **企業顧問** (13位): 律師、會計師、專利商標、AI商務顧問等
- **企業行銷** (9位): 禮贈品、SEO、自媒體、創意策劃等
- **資訊系統** (4位): 網站開發、資訊弱電系統整合等
- **工程裝修** (9位): 空調、水電、泥作、商空設計等
- **健康美麗** (11位): 保險、營養保健、健身教練等
- **休閒教育** (3位): 魔術方塊教學、升學輔導等
- **投資理財** (2位): 黃金買賣、AI程式交易
- **美食餐飲** (3位): 餐飲、茶葉、烘焙等

### 會員編輯介面 (`/edit`)

#### 功能特色

1. **身份驗證**: 輸入姓名即可載入個人資料
2. **照片編輯**:
   - 支援 JPG/PNG 上傳
   - Cropper.js 裁切工具（1:1 正方形）
   - 自動壓縮至 200KB
3. **資料編輯**:
   - 公司名稱（50字內）
   - 職稱（30字內）
   - 簡短介紹（30字）
   - 完整介紹（300-500字）
   - 兩個公司連結（支援官網、Facebook、Instagram、LinkedIn、LINE、YouTube）
4. **資料儲存**: 純前端方案，生成 JSON 檔案供下載

#### 使用流程

1. 會員訪問 `https://evershine.tw/edit`
2. 輸入姓名載入現有資料
3. 編輯照片、公司資訊、介紹、連結
4. 預覽並儲存，下載 JSON 檔案
5. 將 JSON 檔案傳送給管理員更新

#### 管理員更新流程

1. 收到會員的 JSON 檔案
2. 驗證資料格式和內容
3. 更新 `data/members-data.json` 對應會員資料
4. 如有新照片，更新 `images/members/` 資料夾
5. 提交並推送到 GitHub

### 會員資料生成

使用 `scripts/generate-members.js` 自動生成初始會員資料：

```bash
node scripts/generate-members.js
```

**功能**:
- 掃描 `images/members/` 資料夾
- 為每位會員生成初始資料
- 自動分類產業別
- 生成臨時公司名稱和職稱（供會員後續修改）

### 會員資料整合

會員頁面使用 `js/members-loader.js` 動態載入資料：

```javascript
// 自動從 data/members-data.json 讀取
// 動態生成會員卡片
// 支援產業分類篩選
```

### 系統重構指南

如需從零重建會員系統：

1. **準備會員照片**:
   - 將所有會員照片放入 `images/members/`
   - 檔名格式：`姓名.jpg`（例如：`何昇軒.jpg`）

2. **生成初始資料**:
   ```bash
   node scripts/generate-members.js
   ```

3. **驗證資料**:
   - 檢查 `data/members-data.json`
   - 確認所有會員都有對應資料
   - 驗證產業分類正確性

4. **部署編輯介面**:
   - 確保 `edit.html` 可訪問
   - 測試照片上傳和裁切功能
   - 驗證資料儲存功能

5. **通知會員**:
   - 提供編輯介面連結
   - 說明使用流程
   - 收集更新的資料

### 技術依賴

- **Cropper.js** (v1.6.1): 照片裁切
- **browser-image-compression** (v2.0.2): 照片壓縮
- **Fetch API**: 載入 JSON 資料
- **LocalStorage**: 暫存編輯中的資料（可選）

### 維護注意事項

1. **照片規格**:
   - 建議尺寸：800x800px
   - 格式：JPG 或 PNG
   - 大小：壓縮後 < 200KB

2. **資料驗證**:
   - 簡短介紹：30字內
   - 完整介紹：300-500字
   - 連結：必須是有效的 URL

3. **版本控制**:
   - 所有資料更新都應提交到 Git
   - 使用有意義的 commit message
   - 保留資料更新歷史

4. **備份**:
   - 定期備份 `data/members-data.json`
   - 保留會員照片原始檔案
   - 記錄重要的資料變更

### 未來擴展

- [ ] 後端 API 整合（自動儲存）
- [ ] 會員登入系統（OAuth）
- [ ] 即時預覽功能
- [ ] 批次匯入/匯出工具
- [ ] 資料版本控制系統
```


