# 🔒 Supabase 資安警告修復指南

## 📋 當前資安警告摘要

您的 Supabase 專案有 **7 個安全警告**，全部與 RLS（Row Level Security）政策過於寬鬆有關。

### 警告清單

1. ⚠️ `analytics_events` - 允許公開插入
2. 🔴 `members` - 允許公開插入（**高風險**）
3. 🔴 `members` - 允許公開更新（**高風險**）
4. ⚠️ `page_views` - 允許公開插入
5. ⚠️ `referrals` - 允許公開插入
6. ⚠️ `referrals` - 允許公開更新
7. 🟡 洩漏密碼保護未啟用

---

## 🔴 高風險問題（優先處理）

### 1. `members` 表允許公開插入/更新

**風險**：任何人都可以在您的資料庫中插入或更新會員資料，這是非常嚴重的安全問題！

**修復方式**：已在 `scripts/fix_supabase_security_warnings.sql` 中提供修復腳本

**修復後的權限**：
- ✅ 會員可以更新**自己的**資料
- ✅ 管理員可以插入/更新**任何**會員資料
- ❌ 匿名使用者無法插入/更新會員資料

---

## ⚠️ 中等風險問題（需要評估）

### 2. `referrals` 表允許公開插入/更新

**問題**：是否應該允許公開插入引薦資料？

**建議**：
- 如果引薦資料由管理員手動管理 → **修復**（只允許管理員）
- 如果前端需要自動記錄引薦 → **評估**（考慮加入驗證或使用 Supabase Edge Functions）

**修復腳本**：已在 `scripts/fix_supabase_security_warnings.sql` 中提供

### 3. `analytics_events` 和 `page_views` 允許公開插入

**評估**：這可能是**預期行為**（前端需要記錄分析和頁面瀏覽）

**建議**：
- ✅ **保持現狀**（如果這是預期行為）
- ⚠️ 在應用層面加入 **rate limiting** 防止濫用
- ⚠️ 驗證資料完整性（檢查必要欄位）

---

## 🟡 設定問題（非 SQL）

### 4. 洩漏密碼保護未啟用

**問題**：未檢查使用者密碼是否在洩漏資料庫中

**修復方式**（在 Supabase Dashboard）：
1. 前往 **Settings** → **Authentication** → **Password**
2. 啟用 **"Check for leaked passwords"**
3. 此功能會檢查密碼是否在 HaveIBeenPwned.org 的洩漏資料庫中

---

## 📝 修復步驟

### 步驟 1：備份資料庫（重要！）

在執行任何修改前，請先備份資料庫：
1. Supabase Dashboard → Database → Backups
2. 或執行手動備份

### 步驟 2：執行修復腳本

1. 前往 Supabase Dashboard → **SQL Editor**
2. 複製 `scripts/fix_supabase_security_warnings.sql` 的內容
3. **建議**：不要一次執行全部，先執行一個表測試
4. 執行 SQL

### 步驟 3：測試功能

修復後，請測試以下功能：

#### 測試 1：管理員功能
- [ ] 管理員可以插入新會員
- [ ] 管理員可以更新會員資料
- [ ] 管理員可以插入/更新引薦資料

#### 測試 2：一般使用者功能
- [ ] 一般使用者可以更新**自己的**會員資料
- [ ] 一般使用者**無法**更新其他會員的資料
- [ ] 一般使用者**無法**插入新會員

#### 測試 3：匿名使用者
- [ ] 匿名使用者**無法**插入/更新會員資料
- [ ] 匿名使用者**無法**插入/更新引薦資料（如果已修復）
- [ ] 匿名使用者可以插入 `analytics_events`（如果保持公開）
- [ ] 匿名使用者可以插入 `page_views`（如果保持公開）

### 步驟 4：啟用洩漏密碼保護

1. Supabase Dashboard → **Settings** → **Authentication** → **Password**
2. 啟用 **"Check for leaked passwords"**
3. 儲存設定

---

## 🎯 修復優先順序

### 立即修復（今天）

1. ✅ **`members` 表的 INSERT 政策**（高風險）
2. ✅ **`members` 表的 UPDATE 政策**（高風險）
3. ✅ **啟用洩漏密碼保護**

### 短期修復（本週）

4. ⚠️ **`referrals` 表的 INSERT/UPDATE 政策**（根據業務需求決定）

### 持續監控

5. ⚠️ **`analytics_events` 和 `page_views`**（如果是預期行為，保持現狀，但加入應用層面保護）

---

## 🔍 修復後的驗證

執行以下 SQL 查詢驗證修復結果：

```sql
-- 查詢所有 RLS 政策
SELECT 
    tablename,
    policyname,
    cmd as "operation",
    permissive,
    qual as "using_expression",
    with_check as "with_check_expression"
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('members', 'referrals', 'analytics_events', 'page_views')
ORDER BY tablename, cmd, policyname;
```

**預期結果**：
- `members` 表應該只有管理員和本人的更新政策（沒有公開插入/更新）
- `referrals` 表應該只有管理員的插入/更新政策（如果已修復）
- `analytics_events` 和 `page_views` 可能有公開插入（如果是預期行為）

---

## 💡 最佳實踐建議

### 1. 最小權限原則
- 只給予必要的最小權限
- 預設拒絕，明確允許

### 2. 分層安全
- RLS 是第一道防線（資料庫層面）
- 應用層面也要驗證和授權

### 3. 定期審查
- 定期檢查 RLS 政策
- 使用 Supabase Dashboard 的 Security 檢查

### 4. 監控異常活動
- 監控異常的大量插入/更新操作
- 設定 Supabase 的日誌和警報

---

## 📚 參考資源

- [Supabase RLS 文件](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase 安全最佳實踐](https://supabase.com/docs/guides/auth/password-security)
- [修復腳本](../scripts/fix_supabase_security_warnings.sql)

---

**最後更新**：2025-01-11
