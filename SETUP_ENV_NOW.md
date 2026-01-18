# ⚡ 立即設定環境變數

## 🔐 請在專案根目錄建立 `.env` 檔案

將以下內容複製到 `.env` 檔案中（**請替換為實際的值**）：

```bash
# Supabase 設定（必填）
VITE_SUPABASE_URL=https://bapwzqmlvwwmnucjimsn.supabase.co
VITE_SUPABASE_ANON_KEY=您的_anon_key

# Service Role Key（僅用於後端腳本，不要在前端使用！）
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhcHd6cW1sdnd3bW51Y2ppbXNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTg5Njc3OCwiZXhwIjoyMDgxNDcyNzc4fQ.qnVAczwcjJxNvtG8gO-KyHE4MazEWkZKbC5M3BVsnOk

# GitHub Token（後端腳本使用）
GITHUB_TOKEN=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

# Supabase Project ID（可選）
SUPABASE_PROJECT_ID=bapwzqmlvwwmnucjimsn
```

## ✅ 確認事項

- [ ] `.env` 檔案已在專案根目錄建立
- [ ] 所有值都已正確填入
- [ ] `.env` 檔案**不會**被提交到 Git（已在 `.gitignore` 中）

---

**重要**：此檔案包含敏感資訊，絕對不要提交到 Git！
