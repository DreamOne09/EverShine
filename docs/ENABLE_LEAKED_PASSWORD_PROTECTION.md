# 🔐 啟用 Supabase 洩漏密碼保護

## 📍 設定位置

根據 Supabase Dashboard 的最新介面，洩漏密碼保護設定在：

### 方法 1：透過 Policies 頁面（推薦）

1. 前往 Supabase Dashboard
2. 左側選單：**Authentication** → **Policies**
3. 找到 **Password** 相關設定
4. 啟用 **"Check for leaked passwords"** 或 **"Leaked Password Protection"**

### 方法 2：透過 API Settings

1. 前往 Supabase Dashboard
2. 左側選單：**Settings** → **API**
3. 查看是否有 **Authentication** 相關設定
4. 或者前往 **Settings** → **Authentication**

### 方法 3：直接在 Policies 中

根據您的介面截圖，左側選單有 **"Policies"** 選項：

1. 左側選單：**Authentication** → **Configuration** → **Policies**
2. 或者直接點擊 **"Policies"**
3. 尋找 **Password** 相關的 Policy 設定
4. 啟用 **"Leaked Password Protection"**

---

## 🔍 如果找不到設定

如果上述位置都找不到，可以：

### 使用 Supabase CLI

```bash
supabase auth settings update --enable-leaked-password-check
```

### 或透過 SQL（如果支援）

```sql
-- 檢查當前設定
SELECT * FROM auth.config;

-- 注意：此設定通常需要在 Dashboard 中啟用
```

---

## 💡 替代方案：在應用層面驗證

如果 Supabase Dashboard 沒有此選項，可以在註冊/登入時使用外部 API 檢查：

```typescript
// 使用 HaveIBeenPwned API 檢查密碼
async function checkPasswordLeaked(password: string) {
  const hash = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(password));
  const hashHex = Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
  
  const prefix = hashHex.slice(0, 5);
  const suffix = hashHex.slice(5);
  
  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const text = await response.text();
  
  return text.includes(suffix);
}
```

但這需要在前端或後端實作，不如直接在 Supabase 啟用來得簡單。

---

## 📞 如果還是找不到

請查看：
1. Supabase Dashboard 的 **Help** 或 **Documentation** 連結
2. 直接搜尋 Dashboard 右上角的搜尋欄：「leaked password」或「password protection」
3. 檢查 Supabase 版本是否有此功能（較新版本才有）

---

**最後更新**：2025-01-11
