# 🌟 EverShine BNI 長輝白金分會 官方網站

這是一個為 **BNI 長輝白金分會 (EverShine Chapter)** 打造的現代化、全端雲端官方網站。本專案旨在展示分會成員的專業形象、簡化會員資料管理流程、並透過數據化呈現分會的優越績效。

---

## 🚀 核心功能 (Key Features)

### 1. 💎 高端商業視覺設計
*   **深藍金主題**：採用現代深色模式 (Deep Blue) 與黃金配色 (Gold Accent)，營造高端商務質感。
*   **流體動畫**：使用 `Framer Motion` 實作精緻的滾動偵測與介面過渡動畫。
*   **響應式佈局**：支援手機、平板、電腦全平台，並針對 **iOS Safari** 的動態標題列進行了高度優化 (`dvh` 佈局)。

### 2. 🔐 完整會員系統 (Supabase Auth)
*   **多元登入**：支援 Email/密碼登入，並整合 **Google 一鍵登入 (OAuth)**。
*   **檔案認領機制**：允許舊有會員透過 Email 驗證領取其在系統中已存在的專業檔案。
*   **安全防護**：整合 **Cloudflare Turnstile** 機器人防護，並具備密碼強度檢查與確認功能。

### 3. 📝 會員檔案管理 (Self-Editing)
*   **即時編輯**：會員可自行上傳頭像、修改職稱、公司、產業類別及自我介紹。
*   **智慧圖片處理**：前端自動偵測大容量圖片並進行 **Client-side 壓縮**，確保不佔用伺服器頻寬。
*   **導航儲存機制**：優化後的頂端固定式 (Sticky Header) 儲存按鈕，具備未儲存更改提醒與智能狀態切換。

### 4. � 數據與引薦報告
*   **引薦報表**：動態展示分會成員間的引薦成功案例。
*   **即時績效指標**：動態顯示引薦總金額、成交案例等關鍵統計數據。

### 5. 🏠 動態領導團隊
*   **自動連動**：首頁「聯繫我們」區塊會自動抓取資料庫中最新任期的主席、副主席、秘財成員資料，無需手動修改程式碼。

### 6. 📱 社交 APP 優化 (In-App Browser Fixes)
*   **自動跳轉**：針對 LINE、Facebook、Instagram 等 App 內建瀏覽器常導致 Google 登入失效的問題，加入自動偵測並引導使用者開啟外部瀏覽器。

---

## 🛠️ 技術棧 (Tech Stack)

| 類別 | 技術 |
| :--- | :--- |
| **前端框架** | React 18, Vite, TypeScript |
| **樣式處理** | Tailwind CSS v4 |
| **動效庫** | Framer Motion |
| **後端服務** | Supabase (Auth, PostgreSQL, Storage, Functions) |
| **雲端部署** | Zeabur (Dockerized environment) |
| **安全性** | Cloudflare Turnstile, RLS (Row Level Security) |

---

## ⚙️ 開發與配置 (Configuration)

### 1. 本地環境變數 (.env)
在專案根目錄建立 `.env` 並填入以下資訊：
```env
VITE_SUPABASE_URL=你的_Supabase_URL
VITE_SUPABASE_ANON_KEY=你的_Supabase_公鑰
VITE_TURNSTILE_SITE_KEY=你的_Turnstile_Site_Key
```

### 2. 資料庫結構 (Database Schema)
本專案依賴以下 Supabase 資料表：

```sql
-- 會員基本資料表
CREATE TABLE public.members (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT,
    company TEXT,
    position TEXT,
    photo TEXT,
    email TEXT,
    phone TEXT,
    category TEXT, -- 存儲為 '產業A,產業B'
    short_intro TEXT,
    full_intro TEXT,
    services JSONB,
    hashtags JSONB,
    links JSONB, -- 存儲社交連結物件
    is_admin BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 首頁統計數據表
CREATE TABLE public.homepage_stats (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE,
    value NUMERIC,
    label TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. RLS 安全方針示例
```sql
-- 允許所有人讀取會員資料
CREATE POLICY "Public read access" ON public.members FOR SELECT USING (true);

-- 僅允許會員修改自己的資料
CREATE POLICY "Users can update personal profile" ON public.members
FOR UPDATE USING (auth.uid() = user_id);
```

---

## 📂 專案架構 (Project Structure)

```text
EverShine/
├── src/
│   ├── components/      # 重複使用元件
│   │   ├── home/        # 首頁專用區塊 (Contact, Hero, Wall...)
│   │   ├── layout/      # 佈局元件 (Navbar, BottomNav, Footer)
│   │   └── common/      # 通用元件 (SEO, StatsCard, Loading)
│   ├── contexts/        # Auth 及全域狀態管理
│   ├── hooks/           # 資料抓取與業務邏輯 (useMembers, useStats)
│   ├── lib/             # 第三方套件初始化 (Supabase)
│   ├── pages/           # 主要頁面 (Home, Members, Referrals, MemberEdit)
│   └── types/           # TypeScript 介面定義
├── patches/             # 重大問題修正紀錄
├── public/              # 靜態資源檔案
└── scripts/             # 資料遷移與維護腳本
```

---

## 🚀 部署方式 (Deployment)

1.  **Zeabur 部署**：
    *   串接 GitHub 儲存庫。
    *   Zeabur 會自動偵測 `Dockerfile` 進行構建。
    *   在 Zeabur 控制面板設定相關環境變數。
2.  **安全設定**：
    *   確保在 Supabase Dashboard 開啟 **Confirm Email** 以提升安全性。
    *   配置 **SMTP (推薦使用 Resend)** 以確保驗證信件發送成功。

---

## 📮 維護與聯繫

本專案由長輝分會授權開發。若有任何問題或建議，請透過分會官方窗口聯繫。

Built with ❤️ by **DeepMind EverShine Team**.