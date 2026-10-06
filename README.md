# 🌟 EverShine BNI 長輝白金分會 官方網站

這是一個為 **BNI 長輝白金分會 (EverShine Chapter)** 打造的現代化、全端雲端官方網站。本專案旨在展示分會成員的專業形象、簡化會員資料管理流程、並透過數據化呈現分會的優越績效。

---

## 🎨 視覺設計系統 (Design System) - 長輝藍

本專案採用 **EverShine Blue (長輝藍)** 作為核心品牌識別，展現分會的專業與凝聚力：

*   **天際藍 (Sky Blue)**：作為主色調，象徵廣闊的商業藍海與無限的合作可能。
*   **深邃黑 (Deep Black)**：底層配色營造科技感與穩重感，讓內容更顯專業。
*   **動態星空**：象徵商務引薦如繁星般閃耀，串聯起每一位會員的商機。
*   **白金金**：作為層次點綴（徽章、篩選選中、來訪 CTA），不取代長輝藍。
*   **Hero 底圖**：首頁維持地球圖 `public/images/assets/background.png`。會員／認識 BNI／引薦／登入改為真實會員組成的線上例會 Gallery（`meeting-hero.jpg`、`meeting-hero-speaker.jpg`、`meeting-hero-pair.jpg`）。重新產出請執行 `python3 scripts/generate-meeting-hero.py`。若有週三 Zoom Gallery 或主講截圖，可直接替換這三個檔案。

社群分享（LINE / Facebook / 訊息預覽）使用 `public/images/assets/og-evershine-1200.png`（1200×630）。重新產出請執行 `python3 scripts/generate-og-image.py`。

---

## 🗺️ 網頁架構組織圖 (Site Architecture)

### 1. 首頁 (Home Page) - 資訊總覽
*   **[Hero] 頂級導航**：主標「連結能創造價值的人」，三個 CTA（瀏覽會員／了解例會／我要來訪）。
*   **[Visit] 來訪三步驟**：聯繫三長 → 週三 06:20 上線 → 06:30 早鳥／07:00 例會。
*   **[About] 關於長輝**：分會的核心價值與願景介紹。
*   **[MemberWall] 會員牆**：動態跑馬燈展示分會成員的專業縮影。
*   **[Results] 數據成就**：視覺化展示引薦金額與商務成果。
*   **[BNI Intro] 認識 BNI**：介紹全球最大商務機構的運作邏輯。
*   **[FAQ] 常見問題**：解答訪客對於分會運作的疑問。
*   **[Contact] 領導團隊**：動態連結最新任主席、副主席、秘財之聯繫方式。

### 2. 成員名錄 (Members Page) - 專業媒合
*   **[Filter] 行業篩選**：八大產業標籤（見 `site.config.industries`）。
*   **[Grid] 會員列表**：現役約 59 位；離會會員凍結後不出現在名錄，歷史引薦仍保留。
*   **[Profile] 會員詳頁**：以穩定會員 **id** 為主鍵。機電設計顯示為楊明翰M，產物保險為楊明翰。舊姓名網址只在唯一匹配時才解析。

### 3. 引薦報告 (Referrals Page) - 成果展示
*   **[Referral Stats] 統計數據**：展示分會內部的互助成果。
*   **[Showcase] 引薦案例**：分享成功的商務對接故事。列表為手機單欄、平板兩欄、桌面三欄。前台以 Supabase `referrals` 為主，並合併 `src/data/referral-cases-extra.json`（同一 `id` 以資料庫為準）。引薦人／被引薦人用 `referrer_id`／`referee_id` 對應會員，不再用姓名當唯一鍵。新增案例後請執行 `python3 scripts/build_referrals_extra_sql.py`，再到 Supabase SQL Editor 執行產生的 SQL，讓後台列表同步。客戶品牌請走 `src/data/referral-brand-replacements.json` 去識別化（夥伴自己的公司名可保留）。

### 4. 會員中心 (Member Edit) - 自主管理
*   **[Auth] 會員登入**：支援 Email 與 Google 快速登入。
*   **[Editor] 資料編輯**：固定式儲存標頭，支援即時預覽與圖片壓縮。
*   **[Self-Management] 內容掌控**：成員可隨時更新自己的產業定位與服務項目。

### 5. 管理後台 (Admin) - EverShine OS
*   **[入口]** `/login` 登入已綁定、且 `members.is_admin = true` 的帳號，導覽列出現「管理後台」，或直接開 `/admin`。
*   **[選單]** 左側功能選單：委員會紀錄（預設）、會員管理、引薦管理；來賓跟進為規劃中。目前位置寫在網址 `?m=<模組>&v=<分頁>`，可直接分享。
*   **[委員會紀錄]** 每場會議有日期、紀錄者、請假者，議程分 1. 會員追蹤、2. 對例會建議、3. 特別討論事項、4. 其他事項。每一項可加會後行動（負責人、期限）。沒結案的行動會自動出現在之後每一場會議的「上次追蹤事項」，直到在會中按完成或取消；「行動追蹤」分頁列出全部行動。可定稿鎖定、複製文字版貼 LINE。
*   **[資料表]** 第一次使用前要在 Supabase SQL Editor 執行 `scripts/migration_committee_meetings_20261006.sql`。只有在籍且 `is_admin` 的會員能讀寫；之後要開放給委員會成員，改 `can_access_committee()`。

---

## 📌 近期前台更新（請勿跟「還沒上線的視覺 PR」搞混）

### 已在 `main`／正式站（2026-09-21）

這些是會員資料與分類的前台更新，細節在 `docs/member-update-20260921.md`、`docs/industry-members-20260921.md`、`docs/member-update-20260922.md`。

*   **八大產業**：居住空間與工程、品牌整合與行銷、健康照護與身心、金融財富與資產、數位科技與應用、學習成長與探索、生活服務與消費、企業經營與法稅。
*   **9 月會籍**：吳貞妮產業改為文創商業設計；湯益承、吳儀沂凍結離會，名錄不顯示、引薦故事不刪。
*   **新會員照片**：蔡宇正、江啟亮、劉宗霖、張瀞文、林育聖等已進 `public/images/members/`。
*   **兩位明翰**：機電設計改顯示為 **楊明翰M**（欣楠科技，id=61，排在劉弼凱之後）；產物保險為 **楊明翰**（泰安產險，已有頭像）。不必再用同名分流。
*   **照片**：張瀞文、林育聖、楊明翰、黃緹涓、王慕煾、呂學承、廖乙宸、宋岳霖頭像已換成提供的新照片（正式站讀 Supabase Storage，立刻生效）。
*   **引薦成果 2026-05～08**：已寫入 `homepage_stats`（5月 412張／4,779,489／16人；6月 389／15,511,211／8；7月 524／17,204,244／13；8月 405／12,203,395／14）。首頁圖表讀最近 12 個月。
*   **引薦對人**：後台選單與前台頭像改走會員 id（`referrer_id`／`referee_id`），避免同名對錯人。
*   正式名單以 **Supabase `members`** 為準，不要把 `public/data/members.json` 整份匯回去覆蓋。
*   **交接全文**：見 `docs/HANDOFF_MEGA_PROMPT_20261002.md`。

### 還在 PR [#12](https://github.com/DreamOne09/EverShine/pull/12)、尚未部署

*   LINE 1200×630 分享圖、全站 meta、首頁主標與三 CTA、來訪三步驟。
*   玻璃高光／琺瑯按鈕等質感。
*   首頁地球底圖；會員／認識 BNI／引薦／登入改為真實會員例會 Gallery。

---

## 🚀 核心技術 (Tech Stack)

| 類別 | 技術 | 說明 |
| :--- | :--- | :--- |
| **前端** | React 19 / Vite 7 | 極速開發與部署 |
| **樣式** | Tailwind 4 | 現代化、可擴展的 CSS 框架 |
| **資料庫** | Supabase DB | PostgreSQL 強大驅動 |
| **驗證** | Supabase Auth | 提供多方登入與安全 Session |
| **存儲** | Supabase Storage | 存儲高品質會員照片 |
| **部署** | Zeabur | 自動化容器部署與管理 |

---

## 📂 專案指南 (Project Roadmap)

本專案以 **KISS (Keep It Simple, Stupid)** 與 **DRY (Don't Repeat Yourself)** 為開發原則。所有的視覺元件皆與長輝品牌藍色調保持一致。

---

## 🔧 開發環境變數 (.env)
```bash
VITE_SUPABASE_URL=你的_URL
VITE_SUPABASE_ANON_KEY=你的_KEY
VITE_TURNSTILE_SITE_KEY=機器人防護_KEY
```

---

## 📚 開發文件

### 核心文件
- **[前端架構](docs/ARCHITECTURE.md)** - 技術棧、資料來源對照、載入 UX
- **[2026-09-21 會籍更新](docs/member-update-20260921.md)** - 吳貞妮產業、湯益承／吳儀沂凍結離會
- **[八大產業與會員身分](docs/industry-members-20260921.md)** - 現役 59 位、八分類、楊明翰M／楊明翰、引薦改走會員 id
- **[2026-09-22 照片與楊明翰M](docs/member-update-20260922.md)** - 張瀞文／林育聖新照片；機電改名楊明翰M
- **[2026-10-02 交接 Mega Prompt](docs/HANDOFF_MEGA_PROMPT_20261002.md)** - 已完成／未完成／約束，給下一輪對話接續
- **[Supabase 整合指南](docs/SUPABASE_INTEGRATION_GUIDE.md)** - 完整的 Supabase 互動說明，包括連接設定、資料操作、安全性設定等

### 安全性文件
- **[安全性修復指南](docs/SUPABASE_SECURITY_FIX_GUIDE.md)** - Supabase 資安警告修復步驟
- **[安全性檢查清單](SECURITY_CHECKLIST.md)** - 企業級安全性檢查項目
- **[快速安全參考](docs/QUICK_SECURITY_REFERENCE.md)** - 常見安全問題與解決方案

### 環境設定
- **[環境變數設定](ENV_SETUP.md)** - 詳細的環境變數設定說明
- **[安裝新套件指南](docs/INSTALLING_PACKAGES.md)** - 如何安裝和管理 npm 套件
- **[開發工具與擴充功能設定](docs/DEVELOPER_TOOLS_SETUP.md)** - VSCode 擴充功能與 2026 最新開發技術推薦

---

## 📮 聯絡我們
如果有任何功能建議或錯誤回報，請聯繫長輝分會行政團隊。

Built with ❤️ by **DeepMind EverShine Team**.