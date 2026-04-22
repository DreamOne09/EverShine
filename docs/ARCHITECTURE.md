# EverShine 前端架構

## 技術棧

- **React 19** + **Vite 7** + **TypeScript**
- **React Router 7**（路由）
- **Tailwind CSS v4**（樣式）
- **Supabase JS**（Auth + Postgres + Realtime）
- **TanStack Query**（伺服器狀態快取：`members`、`referrals` 列表、後台儀表板 bundle）
- **Framer Motion**（動畫）
- **BlockNote**（CMS 富文字，lazy 載入）

## 目錄職責

| 路徑 | 說明 |
|------|------|
| `src/pages/` | 路由頁面，宜保持薄；複雜 UI 放在 `components/` |
| `src/components/layout/` | 全站外殼：Navbar、Footer、背景 |
| `src/components/common/` | SEO、PageHero、通用小件 |
| `src/components/loading/` | 統一載入／骨架／錯誤／SmartImage（全站視覺規範） |
| `src/components/admin/` | 後台分頁：`AdminOverviewTab`、`AdminMembersTab`、`AdminReferralsTab`、`AdminSettingsTab`、`MemberList` |
| `src/hooks/` | `useMembers`、`useReferrals`（底層呼叫 `src/api/` + Query） |
| `src/api/` | 純資料函式：`fetchPublicMembers`、`fetchReferralsForDisplay`、`fetchAdminDashboardBundle`、`queryKeys` |
| `src/lib/` | 無 UI：`supabase` 客戶端、`sanitize`、`cn`、analytics |
| `src/config/` | `site.config` 品牌與環境 fallback |
| `src/styles/` | 全域補充樣式（如 `blocknote-evershine.css`） |
| `scripts/` | Supabase SQL、遷移 |

## 資料來源對照（避免混淆）

| 使用者看到 | 資料表 / 來源 |
|------------|----------------|
| 首頁「引薦成果」數字 | `homepage_stats`（後台 **設定** 分頁） |
| 引薦案例列表／內容 | `referrals`（後台 **引薦** 分頁；前台 `/referrals`） |
| 會員名錄 | `members` |
| CMS 頁面 | `cms_pages`（`/admin/cms`、`/p/:slug`） |

## 載入 UX

- **LoadingScreen**：僅首次訪問／較慢載入時的全屏歡迎動畫。
- **`components/loading`**：頁內骨架、錯誤、空狀態、路由 `Suspense` 的 `RouteFallback`。
- **TanStack Query**：減少重複請求；`members` 表變更仍透過 Supabase Realtime `invalidate`。

## 測試

- **E2E**：Playwright，`e2e/smoke.spec.ts`（需先 `npm run build && npx vite preview` 或設定 `PLAYWRIGHT_BASE_URL`）。
- 指令：`npm run test:e2e`（需已安裝瀏覽器：`npx playwright install`）。

## 部署注意

- 新環境請執行 `scripts/migration_cms_pages_and_members_unbind.sql`（若尚未套用）。
- 環境變數見 `.env.example`、`ENV_SETUP.md`。
