# 🔐 啟用洩漏密碼保護 - 精確步驟

## 📍 您的專案資訊

- **專案 ID**: `bapwzqmlvwwmnucjimsn`
- **專案 URL**: `https://bapwzqmlvwwmnucjimsn.supabase.co`

---

## 🎯 啟用步驟（根據您的 Dashboard 介面）

根據您提供的 Dashboard 截圖，左側選單有 **CONFIGURATION** 區塊。請按照以下步驟：

### 步驟 1：進入 Authentication 設定

1. 在 Supabase Dashboard 中
2. 左側選單，點擊 **"Authentication"**

### 步驟 2：尋找 Policies 設定

根據您的介面，請嘗試以下路徑：

#### 選項 A（最可能）：
1. 左側選單：**CONFIGURATION** → **Policies**
2. 尋找 **"Password"** 或 **"Password Policies"** 相關設定
3. 尋找 **"Leaked Password Protection"** 或 **"Check for leaked passwords"**
4. 啟用該選項

#### 選項 B：
1. 左側選單：**CONFIGURATION** → **Sign In / Providers**
2. 展開 **"Email"** 或 **"Password"** 設定
3. 尋找 **"Password Security"** 或 **"Security"** 標籤
4. 尋找 **"Leaked Password Protection"**

#### 選項 C：
1. 左側選單：**CONFIGURATION** → **Attack Protection**
2. 尋找與密碼相關的保護選項

### 步驟 3：使用搜尋功能（推薦）

如果上述路徑都找不到：

1. 點擊 Dashboard **右上角的搜尋圖示**（放大鏡圖示）
2. 搜尋關鍵字：
   - `leaked password`
   - `password protection`
   - `pwned password`
   - `HaveIBeenPwned`

3. 點擊搜尋結果，應該會直接帶您到設定頁面

### 步驟 4：直接訪問（如果知道 URL）

也可以嘗試直接訪問：
```
https://supabase.com/dashboard/project/bapwzqmlvwwmnucjimsn/auth/policies
```

或

```
https://supabase.com/dashboard/project/bapwzqmlvwwmnucjimsn/auth/providers
```

---

## ⚠️ 重要說明

### 為什麼無法透過 API 啟用？

洩漏密碼保護是 Supabase 的**專案層級設定**，通常：
- ❌ 無法透過 SQL 修改
- ❌ 無法透過 Supabase JS Client API 修改
- ✅ 只能在 **Supabase Dashboard** 中啟用

這是 Supabase 的安全設計，確保這類重要設定只能由專案管理員手動確認。

---

## 💡 如果還是找不到

### 方案 1：檢查 Supabase 版本

此功能可能只在較新的 Supabase 版本中可用：
- 檢查您的 Supabase 專案版本
- 如果需要，考慮升級到最新版本

### 方案 2：聯絡 Supabase 支援

1. 前往 Supabase Dashboard → **Help** → **Support**
2. 詢問：「如何啟用 Leaked Password Protection？」
3. 提供您的專案 ID：`bapwzqmlvwwmnucjimsn`

### 方案 3：檢查文件連結

在 Dashboard 的警告訊息中，通常會有文件連結：
- 點擊警告中的 **remediation** 連結
- 查看官方文件的最新說明

---

## 🔍 驗證是否已啟用

啟用後，可以測試：

1. **嘗試註冊新帳號**：
   - 使用已知洩漏的密碼，例如：`password123`
   - 如果已啟用，應該會被拒絕
   - 會顯示類似訊息：「此密碼已在洩漏資料庫中」

2. **檢查警告**：
   - 回到 Dashboard → Security 或 Database
   - 「Leaked Password Protection Disabled」警告應該會消失

---

## 📝 備註

Service Role Key 已正確儲存在環境變數中（不在程式碼中），這是正確的做法。

**重要**：Service Role Key 不應用於啟用此功能，因為這類設定只能在 Dashboard 中修改。

---

**最後更新**：2025-01-11  
**專案 ID**: `bapwzqmlvwwmnucjimsn`
