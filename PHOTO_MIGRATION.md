# 會員照片遷移到 Supabase 指南

## 前置準備

### 1. 取得 Supabase Service Role Key

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇您的專案 `bapwzqmlvwwmnucjimsn`
3. 前往 **Settings** → **API**
4. 複製 **`service_role`** key（⚠️ 注意：這是機密金鑰，不要公開）

### 2. 設定環境變數

在專案根目錄建立 `.env.local` 檔案（如果還沒有）：

```bash
SUPABASE_SERVICE_KEY=你的_service_role_key
```

## 執行遷移

### 情境一：照片已在 Supabase，只需更新資料庫路徑（推薦）

如果照片已經上傳到 Supabase Storage（例如：`member-1.jpg`, `member-2.jpg`...），只需要更新資料庫中的 URL：

```bash
# 設定環境變數（建立 .env.local）
echo "SUPABASE_SERVICE_KEY=你的service_role_key" > .env.local

# 執行更新腳本
node scripts/update-photo-urls.mjs
```

這個腳本會：
- ✅ 檢查每個會員的照片是否存在於 Supabase Storage
- ✅ 自動更新資料庫中的 `photo` 欄位為完整的 Supabase URL
- ✅ 跳過已經是正確 URL 的會員
- ✅ 顯示詳細的執行報告

### 情境二：從本地上傳照片到 Supabase

如果照片還在本地 `public/images/members/`：

```bash
# 執行遷移腳本
node scripts/migrate-photos.mjs
```

腳本會自動：
- ✅ 讀取 `public/images/members/` 中的所有照片
- ✅ 上傳到 Supabase Storage 的 `member-photos/members/` bucket
- ✅ 更新資料庫中的 `photo` 欄位為 Supabase URL
- ✅ 跳過已經使用 Supabase URL 的會員

### 情境三：手動上傳（適合少量圖片）

1. 前往 Supabase Dashboard → **Storage** → `member-photos`
2. 建立 `members` 資料夾（如果還沒有）
3. 手動上傳圖片
4. 複製圖片的 Public URL
5. 在 Supabase Dashboard → **Table Editor** → `members` 表中更新對應會員的 `photo` 欄位

## 驗證

遷移完成後，在瀏覽器開啟網站：

1. 前往會員頁面
2. 按 F12 開啟開發者工具
3. 檢查 Console 是否還有 404 錯誤
4. 確認所有會員照片都能正常顯示

## 清理（選擇性）

遷移成功後，可以刪除本地的 `public/images/members/` 資料夾以節省空間：

```bash
# ⚠️ 確認遷移成功後再執行
rm -rf public/images/members
```

## 注意事項

- ⚠️ **Service Role Key** 擁有完整權限，請勿提交到 Git
- ✅ `.env.local` 已在 `.gitignore` 中，不會被提交
- 📸 圖片會以 `member-{id}.jpg` 格式命名，方便管理
- 🔄 使用 `upsert: true`，重複執行腳本會覆蓋舊檔案

## 疑難排解

### 錯誤：`SUPABASE_SERVICE_KEY is not defined`
→ 請確認 `.env.local` 檔案存在且包含正確的 Service Role Key

### 錯誤：`File not found`
→ 確認 `public/images/members/` 資料夾中有對應的圖片檔案

### 錯誤：`Upload failed: Bucket not found`
→ 前往 Supabase Dashboard → Storage，建立名為 `member-photos` 的 bucket

### 圖片上傳成功但網站仍顯示 404
→ 檢查 Supabase Storage 的 bucket 是否設為 **Public**
→ 前往 Storage → member-photos → Settings → Make bucket public
