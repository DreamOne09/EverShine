# ⚠️ Supabase Warning 處理指南

## 常見 Supabase Warning 及其處理方式

### 1. 「Table has no RLS enabled」🔴 高優先級

**說明**：資料表未啟用 Row Level Security（RLS）

**處理方式**：
```sql
-- 檢查哪些表沒有啟用 RLS
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename NOT IN (
    SELECT tablename 
    FROM pg_tables t
    JOIN pg_policies p ON p.tablename = t.tablename
  );

-- 為缺少 RLS 的表啟用
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

**檢查清單**：
- [ ] `members` 表已啟用 RLS
- [ ] `referrals` 表已啟用 RLS
- [ ] `referral_cases` 表已啟用 RLS
- [ ] `homepage_stats` 表已啟用 RLS
- [ ] `page_views` 表已啟用 RLS
- [ ] `analytics_events` 表已啟用 RLS

---

### 2. 「RLS policy allows public access」🟡 中優先級

**說明**：RLS 政策允許公開存取（可能是預期行為）

**評估**：
- ✅ **如果是公開資料**（例如會員牆）：這是預期的
- ❌ **如果是敏感資料**：需要限制存取

**處理方式**（如果需要限制）：
```sql
-- 刪除過於寬鬆的政策
DROP POLICY "Allow public read" ON table_name;

-- 建立更嚴格的政策（例如：只有會員本人可讀）
CREATE POLICY "Users can read own data" 
ON table_name FOR SELECT 
USING (user_id = auth.uid());
```

**EverShine 專案中的評估**：
- `members` 表：✅ **應該允許公開讀取**（會員牆是公開的）
- `referrals` 表：✅ **應該允許公開讀取**（引薦案例是公開的）
- `analytics_events`、`page_views`：⚠️ **需要檢查**（是否應該公開）

---

### 3. 「Service role key exposed」🔴 高優先級

**說明**：Service Role Key 可能暴露在前端程式碼中

**檢查方式**：
1. 在 Supabase Dashboard → Settings → API 確認 Service Role Key
2. 搜尋程式碼中是否有該 Key：
   ```bash
   # 在專案中搜尋（不要執行，因為會暴露）
   grep -r "service_role" --include="*.ts" --include="*.tsx" --include="*.js"
   ```

**處理方式**：
- ✅ **正確**：只在後端腳本中使用 Service Role Key
- ❌ **錯誤**：在前端（React/Vite）中使用 Service Role Key
- ✅ **正確**：前端只使用 Anon Key（`VITE_SUPABASE_ANON_KEY`）

---

### 4. 「Missing email confirmation」🟡 中優先級

**說明**：未啟用 Email 驗證

**處理方式**：
1. Supabase Dashboard → Authentication → Email Auth
2. 啟用 "Confirm email" 選項
3. 設定 Email Template（可選）

**建議**：
- ✅ **啟用**：提高安全性，防止冒用 Email 註冊
- ⚠️ **注意**：啟用後，新使用者需要驗證 Email 才能登入

---

### 5. 「Weak password policy」🟡 中優先級

**說明**：密碼強度要求太低

**處理方式**：
1. Supabase Dashboard → Authentication → Password
2. 設定最小長度（建議：12+）
3. 啟用密碼複雜度要求（可選）

**建議設定**：
- 最小長度：12 字元
- 要求大寫字母
- 要求數字
- 要求特殊字元（可選，但可能降低使用者體驗）

---

### 6. 「Storage bucket is public」🟡 中優先級

**說明**：Storage bucket 設為公開

**評估**：
- ✅ **如果是公開資源**（例如會員照片）：這是預期的
- ❌ **如果是私人資源**：需要改為 private

**EverShine 專案中的評估**：
- `member-photos` bucket：✅ **應該公開**（會員照片需要公開顯示）
- 其他 bucket：⚠️ **需要檢查**

**檢查方式**：
```sql
-- 在 Supabase Dashboard → Storage 檢查每個 bucket 的設定
-- 或使用 Supabase CLI
supabase storage list
```

---

### 7. 「No rate limiting configured」🟢 低優先級

**說明**：未設定 API 速率限制

**處理方式**：
1. Supabase Dashboard → Settings → API
2. 設定 Rate Limiting（建議：1000 requests/hour 或更高）
3. 考慮針對特定端點設定更嚴格的限制

**建議設定**：
- 匿名使用者：1000 requests/hour
- 已認證使用者：5000 requests/hour

---

## 🔍 如何檢查當前的 Warning

### 方法 1：Supabase Dashboard

1. 前往 Supabase Dashboard
2. 選擇您的專案
3. 查看 **Security** 或 **Database** 區塊的警告訊息

### 方法 2：SQL 查詢

```sql
-- 檢查所有表的 RLS 狀態
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 檢查所有 RLS 政策
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 方法 3：使用 Supabase CLI

```bash
supabase status
supabase db diff
```

---

## 📋 建議處理順序

1. **立即處理**（今天）：
   - [ ] 確認所有表都啟用 RLS
   - [ ] 檢查 Service Role Key 是否暴露

2. **短期處理**（本週）：
   - [ ] 評估 RLS 政策是否適當
   - [ ] 啟用 Email 驗證
   - [ ] 強化密碼政策

3. **中期處理**（本月）：
   - [ ] 設定 Storage bucket 權限
   - [ ] 設定 Rate Limiting

---

## 🛠️ 執行修復腳本

如果您想要快速修復常見問題，可以執行以下腳本：

```sql
-- 1. 確保所有表都啟用 RLS
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', r.tablename);
    END LOOP;
END $$;

-- 2. 檢查結果
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

**⚠️ 注意**：執行前請備份資料庫！

---

**最後更新**：2025-01-11
