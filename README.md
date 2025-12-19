# 🌟 EverShine BNI 長輝白金分會 官方網站

這是一個為 **BNI 長輝白金分會 (EverShine Chapter)** 打造的現代化、全端雲端官方網站。本專案旨在展示分會成員的專業形象、簡化會員資料管理流程、並透過數據化呈現分會的優越績效。

---

## 🎨 視覺設計系統 (Design System)

本專案採用 **深藍金 (Deep Blue & Gold)** 高級商務配色方案：

*   **深藍色 (Deep Blue)**：象徵專業、穩重與商業洞察力。
*   **黃金配色 (Gold Accent)**：象徵卓越、品質與白金分會的尊貴地位。
*   **動態星空**：象徵商務機會如繁星般無限擴展。

---

## 🗺️ 網頁架構組織圖 (Site Architecture)

### 1. 首頁 (Home Page) - 資訊總覽
*   **[Hero] 頂級導航**：強大的視覺衝擊與「加入我們」黃金按鈕。
*   **[About] 關於長輝**：分會的核心價值與願景介紹。
*   **[MemberWall] 會員牆**：動態跑馬燈展示分會成員的專業縮影。
*   **[Results] 數據成就**：視覺化展示引薦金額與商務成果。
*   **[BNI Intro] 認識 BNI**：介紹全球最大商務機構的運作邏輯。
*   **[FAQ] 常見問題**：解答訪客對於分會運作的疑問。
*   **[Contact] 領導團隊**：動態連結最新任主席、副主席、秘財之聯繫方式。

### 2. 成員名錄 (Members Page) - 專業媒合
*   **[Filter] 行業篩選**：透過標籤快速找尋特定產業的專業人士。
*   **[Grid] 會員列表**：以簡約大氣的卡片形式展示所有成員。
*   **[Profile] 會員詳頁**：深入了解成員的服務內容、經歷與聯繫方式。

### 3. 引薦報告 (Referrals Page) - 成果展示
*   **[Referral Stats] 統計數據**：展示分會內部的互助成果。
*   **[Showcase] 引薦案例**：分享成功的商務對接故事。

### 4. 會員中心 (Member Edit) - 自主管理
*   **[Auth] 會員登入**：支援 Email 與 Google 快速登入。
*   **[Editor] 資料編輯**：固定式儲存標頭，支援即時預覽與圖片壓縮。
*   **[Self-Management] 內容掌控**：成員可隨時更新自己的產業定位與服務項目。

---

## � 核心技術 (Tech Stack)

| 類別 | 技術 | 說明 |
| :--- | :--- | :--- |
| **前端** | React 18 / Vite | 極速開發與部署 |
| **樣式** | Tailwind 4 | 現代化、可擴展的 CSS 框架 |
| **資料庫** | Supabase DB | PostgreSQL 強大驅動 |
| **驗證** | Supabase Auth | 提供多方登入與安全 Session |
| **存儲** | Supabase Storage | 存儲高品質會員照片 |
| **部署** | Zeabur | 自動化容器部署與管理 |

---

## 📂 專案結構建議 (Project Roadmap)

未來本專案將持續維護此 `README.md` 作為唯一開發指南。若需擴充功能（如引薦系統 2.0、分會活動日曆），請同步更新此處的架構圖。

---

## 🔧 開發環境變數 (.env)
```bash
VITE_SUPABASE_URL=你的_URL
VITE_SUPABASE_ANON_KEY=你的_KEY
VITE_TURNSTILE_SITE_KEY=機器人防護_KEY
```

---

## 📮 聯絡我們
如果有任何功能建議或錯誤回報，請聯繫長輝分會行政團隊。

Built with ❤️ by **DeepMind EverShine Team**.