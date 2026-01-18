# 🔐 如何在 Supabase Dashboard 啟用洩漏密碼保護

## 📍 詳細步驟指引

根據您的 Dashboard 介面，請按照以下步驟：

### 步驟 1：進入 Authentication 設定

1. 在 Supabase Dashboard 中，點擊左側選單的 **"Authentication"**
2. 您應該會看到左側有：
   - **MANAGE**: Users, OAuth Apps
   - **NOTIFICATIONS**: Email
   - **CONFIGURATION**: 各種設定選項

### 步驟 2：尋找 Password 設定

洩漏密碼保護可能位於以下其中一個位置：

#### 選項 A：在 Policies 中

1. 左側選單：**CONFIGURATION** → **Policies**
2. 或者直接點擊左側選單的 **"Policies"**
3. 尋找與 **Password** 相關的設定
4. 尋找 **"Leaked Password Protection"** 或 **"Check for leaked passwords"**
5. 啟用該選項

#### 選項 B：在 Sign In / Providers 中

1. 左側選單：**CONFIGURATION** → **Sign In / Providers**
2. 找到 **Email** 或 **Password** 相關設定
3. 展開設定，尋找 **"Password Security"** 或類似選項
4. 啟用 **"Leaked Password Protection"**

#### 選項 C：在 Attack Protection 中

1. 左側選單：**CONFIGURATION** → **Attack Protection**
2. 尋找與密碼相關的保護選項
3. 啟用 **"Leaked Password Protection"**

### 步驟 3：使用搜尋功能

如果找不到，可以使用 Dashboard 的搜尋功能：

1. 點擊 Dashboard 右上角的 **搜尋圖示**（放大鏡）
2. 搜尋關鍵字：
   - `leaked password`
   - `password protection`
   - `pwned password`
   - `HaveIBeenPwned`

### 步驟 4：檢查文件連結

在 Dashboard 的警告訊息中，通常會有文件連結：

1. 點擊警告訊息中的 **remediation** 連結：
   ```
   https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
   ```
2. 查看官方文件說明的位置

---

## 🔍 如果還是找不到

### 檢查 Supabase 版本

此功能可能在較新的 Supabase 版本中才有。如果您的 Dashboard 沒有此選項，可能是：

1. **版本較舊**：需要升級 Supabase 專案
2. **功能尚未啟用**：可能需要聯絡 Supabase 支援啟用
3. **位置不同**：介面可能已更新，功能在不同位置

### 替代方案

如果 Dashboard 沒有此選項，可以：

1. **在應用層面驗證**（參考 `ENABLE_LEAKED_PASSWORD_PROTECTION.md`）
2. **使用 Supabase CLI**（如果可用）：
   ```bash
   supabase auth settings update --enable-leaked-password-check
   ```
3. **聯絡 Supabase 支援**：詢問如何啟用此功能

---

## ✅ 確認已啟用

啟用後，您可以：

1. **測試註冊**：嘗試使用已知洩漏的密碼註冊
   - 應該會被拒絕
   - 例如：`password123`、`12345678` 等常見洩漏密碼

2. **檢查設定**：回到設定頁面確認選項已啟用

---

## 📞 需要幫助

如果還是找不到：

1. 截圖您的 Dashboard 介面（特別是 Authentication 區塊）
2. 檢查 Supabase 專案版本
3. 查看 Supabase 文件是否有更新說明
4. 聯絡 Supabase 支援團隊

---

**最後更新**：2025-01-11  
**參考文件**：https://supabase.com/docs/guides/auth/password-security
