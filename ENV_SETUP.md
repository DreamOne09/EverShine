# 🔐 環境變數設定指南

## 建立 .env 檔案

請在專案根目錄建立 `.env` 檔案（此檔案已被 `.gitignore` 忽略，不會提交到 Git）。

## 必要環境變數

```bash
# Supabase 設定（必填）
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# GitHub Token（後端腳本使用）
GITHUB_TOKEN=your_github_personal_access_token
```

## 選填環境變數

```bash
# Service Role Key（僅用於後端腳本，不要在前端使用！）
# 取得方式：Supabase Dashboard → Settings → API → service_role key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Supabase Project ID（可選，用於自動建構 URL）
# SUPABASE_PROJECT_ID=bapwzqmlvwwmnucjimsn

# GitHub Repository 資訊（可選，預設使用）
GITHUB_OWNER=DreamOne09
GITHUB_REPO=EverShine
GITHUB_BRANCH=main

# Cloudflare Turnstile（機器人防護，可選）
VITE_TURNSTILE_SITE_KEY=your_turnstile_site_key

# Server Port（預設 8080）
PORT=8080

# Node Environment
NODE_ENV=production
```

## 取得環境變數值

### Supabase 設定
1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇您的專案
3. 前往 **Settings** → **API**
4. 複製 **Project URL** → `VITE_SUPABASE_URL`
5. 複製 **anon public** key → `VITE_SUPABASE_ANON_KEY`
6. （選填）複製 **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`（僅用於後端腳本）

### GitHub Token
1. 前往 [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. 點擊 **Generate new token** → **Generate new token (classic)**
3. 設定：
   - **Note**: `EverShine`
   - **Expiration**: 選擇適當期限
   - **Select scopes**: 勾選 `repo`
4. 複製 Token → `GITHUB_TOKEN`

## 安全注意事項

- ⚠️ **絕對不要**將 `.env` 檔案提交到 Git
- ⚠️ **絕對不要**在前端程式碼中使用 Service Role Key
- ✅ `.env` 已在 `.gitignore` 中（已確認）
- ✅ 只在前端使用 `VITE_*` 前綴的環境變數
