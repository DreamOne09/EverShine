# EverShine 交接 Mega Prompt（2026-10-02）

把下面「給下一任 Agent」整段貼給新對話即可接續。本檔也存在 Git：`docs/HANDOFF_MEGA_PROMPT_20261002.md`。

---

## 給下一任 Agent（可整段複製）

你是長輝（BNI EverShine）的資深結對工程師。使用繁體中文回覆。Repo 只有一個：`https://github.com/DreamOne09/EverShine`（Vite 7 + React 19 SPA，**不是 Next.js**）。正式站 `https://evershine.tw`，資料在 Supabase `https://bapwzqmlvwwmnucjimsn.supabase.co`，全面部署在 **Cloudflare Pages + Pages Functions**（已停用並移除舊的 Zeabur 容器設定）。

### 硬性約束（未獲長輝本人明確要求，不要做）

- 不要開始做 EverShine OS／admin.evershine.tw／會後會產品。先前只討論架構，沒有開工授權。
- 一個登入、一個產品；不要另開一套會員帳號。
- 會員主檔永遠是 **同一個 Supabase**；不要把 `public/data/members.json` 整份匯回去覆蓋線上。
- EverShine AI（GCP 專案 `hermes-agents-tw` / `590887602220`）與 **CC16 AI 必須分開**。
- 不要 commit secrets、不要在回覆裡貼 service_role / GitHub token。`SETUP_ENV_NOW.md` 曾誤放金鑰，不要再擴散。
- 不要關閉 PR #10、#11，除非長輝明確說關。
- 不要自行 merge PR #12，除非長輝明確說合併／上線。
- 離會只凍結、不刪；歷史引薦永遠留著。
- 週三例會本身不做紀錄（那是會後會的未來範圍）。

### 三套系統（目前只動第一套）

1. **evershine.tw 公開官網**（本 repo）— 進行中。
2. **EverShine AI** — GCP VM，資料庫另在 Zeabur；先不要整合，除非長輝要。
3. **EverShine OS 後台** — 尚未開工。Wiki：`https://github.com/tripletech-ai/BNI-Evershine-wiki`。

### Git／PR 現況

- 預設分支 `main`。正式站跟 `main` + 線上 Supabase。
- 工作分支：`cursor/evershine-ui-upgrade-be92`
- 開著的 PR：[#12](https://github.com/DreamOne09/EverShine/pull/12)「升級 evershine.tw 前台 UI／UX、meta 與 LINE 分享圖」（請先看最新 PR 說明）。
- `main` 上有 `afe2bd7`（區塊鏈人才改歸「數位科技與應用」、分類名從「數位科技與智能應用」簡化）。此分支已 merge 進 PR #12。
- 其他仍 OPEN、不要亂動：PR #10 三欄引薦（內容多半已在 `main`）、PR #11 引薦口語文案（**不在 main**）。

### 已經在正式站生效（走 Supabase，不必等 PR #12）

前台列表讀 `members`（`status` 為 `active` 或 null）。照片欄位是 Storage 公開 URL：`member-photos/members/member-{id}.jpg`。Git `public/images/members/` 只是備份。

**會籍／身分**

- 現役約 59 人。湯益承 id=62、吳儀沂 id=1010 已 `frozen`／離會，名錄不顯示。
- 吳貞妮 id=41 industry=文創商業設計。
- **楊明翰M** id=**61**（欣楠科技、機電設計、居住空間與工程），名錄緊接 **劉弼凱 id=60** 之後。木字邊「楊」，不是「陽」。照片仍可能是舊檔名 `member-48.jpg`（id 從 48 改 61，檔名沒改）。
- **楊明翰** id=**1020**（泰安產物保險、產物保險規劃、金融財富與資產）。歷史引薦 `referee_name=楊明翰` 對應這位保險，不是機電。
- 個人頁 slug 用穩定 **id**（`src/lib/memberSlug.ts`）。同名不再當唯一鍵。

**已換頭像（Storage + `members.photo`）**

| 人 | id |
| --- | --- |
| 張瀞文 | 1016 |
| 林育聖 | 1008 |
| 楊明翰 | 1020 |
| 黃緹涓 | 1014 |
| 王慕煾 | 1012 |
| 呂學承 | 63 |
| 廖乙宸 | 1009 |
| 宋岳霖 | 1015 |

**`homepage_stats`（首頁引薦成果圖表，公開讀最近 12 個月）**

| month | 引薦單 | 金額 | 來賓 |
| --- | ---: | ---: | ---: |
| 2026-05 | 412 | 4,779,489 | 16 |
| 2026-06 | 389 | 15,511,211 | 8 |
| 2026-07 | 524 | 17,204,244 | 13 |
| 2026-08 | 405 | 12,203,395 | 14 |

SQL：`scripts/migration_homepage_stats_2026_05_08.sql`。更早的 2025-05～2026-04 已在庫裡。首頁「資料更新」會顯示最新月（2026/08）。創會以來總張數／總金額在 `src/components/home/Results.tsx` 仍是寫死的 `ALL_TIME_*`，這次沒改。

**八大產業標籤（`site.config.industries`）**

居住空間與工程、品牌整合與行銷、健康照護與身心、金融財富與資產、**數位科技與應用**、學習成長與探索、生活服務與消費、企業經營與法稅。

`Members.tsx` 的 `CATEGORY_MAPPING` 把舊分類名對到這八個。線上很多 `members.category` **仍是舊字**（健康美麗、工程裝修等），完整八分類 SQL `scripts/migration_industries_identity_20260921.sql` **沒有整包成功跑完**（2026-09-22 查過：active 分類很散）。不要以為跑過程式碼就等於 DB 已重分類。王慕煾曾手動改到數位類。

### 在 PR #12、合併／Zeabur 部署前不會上正式站的程式

- LINE／FB 分享圖 `public/images/assets/og-evershine-1200.png`（1200×630）與全站 meta。
- 首頁主標「連結能創造價值的人」、三 CTA、來訪三步驟、compact Hero。
- 玻璃高光、琺瑯按鈕、細紙紋。
- 首頁 Hero 仍用地球 `background.png`；會員／認識 BNI／引薦／登入改真實會員例會 Gallery（`meeting-hero*.jpg`）。重產：`python3 scripts/generate-meeting-hero.py`。排除插畫頭像 `劉祐沁.jpg`。**週三 Zoom 真實截圖長輝還沒給**，現在是人像拼圖。
- 分會認領密碼程式預設改為 **`evershine`**（`site.config.claimPassword` / `.env.example`）。**線上仍是舊的 `evershine2026`**，直到這次前端部署；若 Zeabur 有設 `VITE_CLAIM_PASSWORD` 也要改成 `evershine` 再重建。
- README／架構文件補齊 9/21 之後的前台說明。

驗證過（視覺那輪）：Playwright smoke 6 項；桌面／手機 Hero。之後的照片／統計是直接寫 DB，沒再跑完整 E2E。

### 尚未完成／已知債

1. **PR #12 未合併** → 視覺、LINE 圖、認領密碼 `evershine` 未上線。
2. **八大產業 DB 未整包遷移**；前台靠 mapping。若要分類人數與文件一致，需小心地對 id 跑 SQL，不要盲目重跑舊腳本（裡面還有已過時的 id=48 楊明翰假設）。
3. **`referrals.referrer_id` / `referee_id`**：2026-09-22 用 anon 讀正式表時，列還是姓名欄、沒有這兩個 id 欄。`main` 的程式已經改走 id。合併後若 DB 還沒加欄，後台選人／同名對應可能仍依賴姓名。需要時再執行身分遷移，且不可讓它把楊明翰M／楊明翰弄亂。
4. **楊明翰（保險）** 已有新頭像；楊明翰M 沿用原機電照片。
5. **沒有週三 Zoom Gallery 靜態圖**；有圖再替換三張 meeting-hero jpg。
6. EverShine OS／會後會／委員會權限／工具櫃 — 只討論過，沒做。會期 10/1 上任、4–9 與 10–3。例會不紀錄。
7. PR #11 口語文案未進 main。
8. ESLint warning 未清。首頁總引薦／總金額仍硬編碼。
9. 多數會員 `category` 未改成八字新名。

### 重要檔案

- 架構：`docs/ARCHITECTURE.md`
- 會籍：`docs/member-update-20260921.md`
- 八產業：`docs/industry-members-20260921.md`
- 照片／楊明翰M：`docs/member-update-20260922.md`
- 統計 SQL：`scripts/migration_homepage_stats_2026_05_08.sql`
- 楊明翰M SQL：`scripts/migration_yang_minghan_m_20260922.sql`、`scripts/migration_fix_yang_character_20260923.sql`、`scripts/migration_yang_minghan_m_order_20260923.sql`
- 前台會員：`src/api/members.ts`、`src/pages/Members.tsx`、`src/lib/memberSlug.ts`
- 認領密碼：`src/pages/Login.tsx` 對 `siteConfig.claimPassword`

### 建議下一手（等長輝點頭）

A. 合併 PR #12 並部署 Zeabur；確認 `VITE_CLAIM_PASSWORD=evershine`。  
B. 有 Zoom 例會圖就換 Hero。  
C. 清點 `members.category` 是否要一次改成八字（先備份、對人數）。  
D. 確認正式 `referrals` 有沒有 id 欄，沒有再補，不要搞錯兩位明翰。  
E. 仍不要開 OS，除非長輝說「開工」。

工作方式：KISS、先問再動核心商業邏輯、回覆繁中、寫完更新 README。長輝是 BNI 長輝白金分會窗口。
