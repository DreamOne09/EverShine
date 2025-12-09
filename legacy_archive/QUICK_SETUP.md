# 🚀 快速設定指南

## 立即完成設定（3 個步驟）

### 步驟 1: 建立 GitHub Token

1. 前往：https://github.com/settings/tokens/new
2. 填寫資訊：
   - **Note**: `EverShine Member Edit`
   - **Expiration**: `No expiration` 或 `90 days`
   - **Select scopes**: 勾選 ✅ `repo`
3. 點擊 **Generate token**
4. **立即複製** Token（只會顯示一次！）

### 步驟 2: 設定 Token

1. 複製 `js/github-config.example.js` 為 `js/github-config.js`：
   ```bash
   copy js\github-config.example.js js\github-config.js
   ```

2. 編輯 `js/github-config.js`，將 Token 貼上：
   ```javascript
   token: 'ghp_你的Token在這裡',
   ```

### 步驟 3: 測試功能

1. 訪問：https://evershine.tw/edit.html
2. 輸入：
   - **姓名**: 您的姓名（例如：李孟亦）
   - **PIN 碼**: `追求夢想得第一`
3. 測試編輯並儲存

## ✅ 完成！

會員現在可以自行編輯資料了！

## 📌 重要提醒

- ⚠️ **不要** commit `js/github-config.js`（已加入 .gitignore）
- 🔐 Token 請妥善保管
- 📝 詳細說明請參考 `MEMBER_EDIT_SETUP.md`

## 🔄 修改個別會員的 PIN 碼

如果需要為特定會員設定不同的 PIN 碼：

```bash
# 編輯腳本
notepad scripts\generate-pin-hashes.js

# 執行腳本
node scripts\generate-pin-hashes.js

# 提交更新
git add data/members.json
git commit -m "Update member PIN codes"
git push
```
