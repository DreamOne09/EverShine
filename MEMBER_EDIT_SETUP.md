# 會員自助編輯功能設定指南

## 📋 功能說明

會員可以透過 `edit.html` 頁面自行編輯個人資料，包括：
- 公司名稱
- 職稱
- 自我介紹（簡短/完整）
- 公司連結（最多3個）

**無法修改的欄位：**
- 姓名
- 行業別
- 產業分類

## 🔐 安全機制

1. **PIN 碼驗證**：每位會員都有專屬的 PIN 碼（預設：追求夢想得第一）
2. **SHA-256 雜湊**：PIN 碼以雜湊值儲存，不會明文儲存
3. **GitHub API**：直接透過 GitHub API 更新資料，有完整的版本控制

## ⚙️ 設定步驟

### 1. 建立 GitHub Personal Access Token

1. 前往 GitHub Settings: https://github.com/settings/tokens
2. 點擊 "Generate new token" > "Generate new token (classic)"
3. 設定 Token：
   - **Note**: `EverShine Member Edit`
   - **Expiration**: 選擇適當的有效期限（建議 90 days 或 No expiration）
   - **Select scopes**: 勾選 `repo` (Full control of private repositories)
4. 點擊 "Generate token"
5. **重要**：複製 Token（只會顯示一次！）

### 2. 更新配置檔案

編輯 `js/github-config.js`：

```javascript
const GITHUB_CONFIG = {
    owner: 'DreamOne09',
    repo: 'EverShine',
    branch: 'main',
    filePath: 'data/members.json',
    token: 'ghp_your_actual_token_here', // 貼上您的 Token
    apiUrl: 'https://api.github.com'
};
```

### 3. 提交並部署

```bash
git add .
git commit -m "Setup member self-edit feature"
git push
```

## 🔄 修改會員 PIN 碼

如果需要為特定會員設定不同的 PIN 碼：

1. 編輯 `scripts/generate-pin-hashes.js`
2. 修改對應會員的 PIN 碼
3. 執行腳本：`node scripts/generate-pin-hashes.js`
4. 提交更新

## 📝 使用流程

1. 會員訪問 `https://evershine.tw/edit.html`
2. 輸入姓名和 PIN 碼
3. 系統驗證身份
4. 編輯個人資料
5. 點擊「儲存資料」
6. 系統自動提交到 GitHub
7. GitHub Pages 自動重新部署（約 2-5 分鐘）

## ⚠️ 安全注意事項

### Token 安全性

**重要**：GitHub Token 會暴露在前端程式碼中，因此：

1. **建議使用 Fine-grained tokens**（更安全）：
   - 前往 https://github.com/settings/tokens?type=beta
   - 只授權存取 `EverShine` 儲存庫
   - 只授權 `Contents` 的 `Read and write` 權限
   - 設定有效期限

2. **定期更換 Token**：建議每 90 天更換一次

3. **監控使用情況**：定期檢查 GitHub 的 commit 歷史

### 備用方案

如果擔心 Token 安全性，可以考慮：
- 使用 GitHub Actions + Issues 的方式
- 建立簡單的後端 API（Zeabur/Vercel）
- 使用 Google Forms + Apps Script

## 🐛 故障排除

### Token 無效
- 檢查 Token 是否正確複製
- 確認 Token 權限包含 `repo`
- 檢查 Token 是否過期

### 更新失敗
- 檢查網路連線
- 查看瀏覽器 Console 的錯誤訊息
- 確認 GitHub API 狀態：https://www.githubstatus.com/

### PIN 碼錯誤
- 確認輸入的 PIN 碼正確（預設：追求夢想得第一）
- 檢查 `members.json` 中是否有 `pinHash` 欄位

## 📞 聯絡資訊

如有問題，請聯絡網站管理員。
