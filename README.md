# EverShine BNI Website (長輝白金分會)

Welcome to the official repository for the EverShine BNI Chapter website. This project showcases our members, success stories, and referral networks.

## 🚀 Tech Stack

This project is built with a modern, serverless-first architecture:
# BNI EverShine 長輝白金分會 Official Website

這是一個為 BNI 長輝白金分會打造的現代化官方網站，旨在展示分會成員專業形象、促進商務引薦，並提供即時的活動資訊。

![Project Banner](public/images/assets/logo/白色長方形logo.png)

## 🏗️ 系統架構 (System Architecture)

本專案經歷了從靜態頁面到全端雲端架構的演進，目前的架構如下：

*   **Frontend**: React (Vite) + TypeScript + Tailwind CSS (v4)
*   **Authentication**: **Supabase Auth** (Email/Password, Secure Session Management)
*   **Database**: **Supabase PostgreSQL** (Members, Referrals data)
*   **Storage**: **Supabase Storage** (Member photos, Assets)
*   **Hosting**: **Zeabur** (Dockerized Nginx container)
*   **CI/CD**: GitHub Actions (Link to Zeabur for auto-deployment)

```mermaid
graph TD
    User[訪客/會員] --> |HTTPS| Zeabur[Zeabur Hosting (Nginx)]
    Zeabur --> |Serve| ReactApp[React SPA]
    
    subgraph "Frontend Application"
        ReactApp --> |Routing| Router[React Router]
        ReactApp --> |State| AuthContext[Auth Context]
        AuthContext --> |Login Status| Navbar
        ReactApp --> |UI| Framer[Framer Motion Animations]
    end

    subgraph "Cloud Backend (Supabase)"
        ReactApp --> |API Calls| SupabaseJS[Supabase Client SDK]
        SupabaseJS --> |Auth| SB_Auth[Authentication]
        SupabaseJS --> |Data| SB_DB[PostgreSQL Database]
        SupabaseJS --> |Files| SB_Storage[File Storage]
    end
```

---

## 📅 版本演進紀錄 (Version History)

### v2.0 - Cloud Transformation (Current) 🚀
*   **Authentication**: 全面棄用不安全的 PIN 碼機制，導入 **Supabase Auth**。
    *   支援 Email 註冊/登入。
    *   **Claim Profile (認領檔案)** 功能：允許舊成員將現有資料綁定至新帳號。
    *   **Password Reset**: 完整的忘記密碼/重設密碼流程。
*   **Database Migration**:
    *   資料來源從本地 JSON 遷移至 Supabase PostgreSQL。
    *   `Members` 表 ID 標準化為自動遞增整數 (Integer)，提升效能與關聯便利性。
    *   `Links` 欄位標準化為 JSON Object，解決舊版 Array 格式雜亂問題。
*   **Components**: 全面重構 `MemberEdit` 頁面，支援即時圖片上傳與壓縮。

### v1.5 - Tailwind Refactoring & Modern UI
*   **Styling**: 移除所有傳統 CSS (`style.css`, `bootstrap`)，全面重構為 **Tailwind CSS v4**。
*   **Design**: 引入「深藍金」高級配色 (Deep Blue/Gold Theme)。
*   **Responsive**: 優化移動端體驗，包括全新的漢堡選單 (Hamburger Menu) 與觸控友善介面。
*   **Performance**: 圖片全面採用 Lazy Loading，提升 LCP 指標。

### v1.0 - React Migration (Legacy)
*   **Tech Switch**: 從原生 HTML/jQuery 遷移至 **React + TypeScript**。
*   **Data**: 使用本地 `json` 檔案作為資料源 (`public/data/members.json`).
*   **Auth**: 實作基礎的 PIN 碼驗證 (Legacy, insecure)，用於簡單的會員資料修改。
*   **Deploy**: 初步部署至 Zeabur。

---

## 🛠️ 開發環境設定 (Setup Guide)

### 1. 安裝依賴
```bash
npm install
```


-- Create Referrals Table
create table public.referrals (
  id text primary key,
  title text,
  description text,
  metrics jsonb,
  referrer_name text references public.members(name) on update cascade on delete set null,
  referee_name text references public.members(name) on update cascade on delete set null,
  referrer_story text,
  referrer_testimonial text,
  referee_story text,
  referee_value text,
  "createdAt" timestamptz default now()
);

-- Enable RLS (Row Level Security) - Adjust policies as needed for production
alter table public.members enable row level security;
alter table public.referrals enable row level security;

create policy "Public Access" on public.members for select using (true);
create policy "Public Access" on public.referrals for select using (true);
create policy "Allow Updates" on public.members for update using (true);
create policy "Allow Inserts" on public.referrals for insert with check (true);
```

#### Setup Storage
Create a public bucket named `member-photos` for storing profile pictures.

```sql
insert into storage.buckets (id, name, public) values ('member-photos', 'member-photos', true);
```

### 5. Running Locally

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

---

## ☁️ Deployment (Zeabur)

This project is configured to deploy easily on **Zeabur**.

1. **Connect GitHub**: Login to Zeabur and import this repository.
2. **Environment Variables**: Go to the **Variables** tab in your Zeabur service and add the same variables from your `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Deploy**: Zeabur will automatically detect the Vite project and build it.

---

## 📂 Project Structure

```
├── public/              # Static assets (legacy data, icons)
├── scripts/             # Utility scripts
│   └── migrate-to-supabase.js  # Script to migrate local JSON data to Supabase
├── src/
│   ├── components/      # Reusable React components
│   ├── hooks/           # Custom hooks (data fetching logic)
│   ├── lib/             # Library configurations (Supabase client)
│   ├── pages/           # Main application pages
│   └── types/           # TypeScript definitions
└── server.js            # (Legacy) Node.js server for generic handling
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Built with ❤️ for BNI EverShine.