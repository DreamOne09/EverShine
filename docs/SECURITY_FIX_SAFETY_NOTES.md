# 🔒 資安修復安全說明

## ✅ 資料安全性保證

### 此腳本不會影響現有資料

**重要**：修改 RLS（Row Level Security）政策**不會**：
- ❌ 刪除任何資料
- ❌ 修改任何資料內容
- ❌ 改變資料結構（欄位、型別等）
- ❌ 影響現有資料的讀取（SELECT 政策不變）

**只會**：
- ✅ 改變「誰可以插入資料」的規則
- ✅ 改變「誰可以更新資料」的規則
- ✅ 改變「誰可以刪除資料」的規則（如果有 DELETE 政策）

---

## 📋 修改前後對比

### members 表

#### 修改前（有安全風險）：
- ❌ **任何人**都可以插入新會員
- ❌ **任何人**都可以更新任何會員的資料

#### 修改後（安全）：
- ✅ **只有管理員**可以插入新會員
- ✅ **只有本人或管理員**可以更新會員資料
- ✅ **所有人**仍然可以讀取會員資料（保持不變）

### referrals 表

#### 修改前（有安全風險）：
- ❌ **任何人**都可以插入新引薦資料
- ❌ **任何人**都可以更新任何引薦資料

#### 修改後（安全）：
- ✅ **只有管理員**可以插入新引薦資料
- ✅ **只有管理員**可以更新引薦資料
- ✅ **所有人**仍然可以讀取引薦資料（保持不變）

---

## 🔍 驗證方式

### 1. 資料仍然存在

執行以下 SQL 驗證資料沒有被刪除：

```sql
-- 檢查會員數量
SELECT COUNT(*) as total_members FROM members;

-- 檢查引薦數量
SELECT COUNT(*) as total_referrals FROM referrals;

-- 查看部分資料
SELECT id, name, industry FROM members LIMIT 5;
```

### 2. 讀取權限仍然正常

執行以下 SQL 驗證讀取權限正常（應該可以正常查詢）：

```sql
-- 測試讀取（應該可以正常執行）
SELECT * FROM members LIMIT 1;
SELECT * FROM referrals LIMIT 1;
```

### 3. 寫入權限已受限

執行以下 SQL 驗證寫入權限已受限（非管理員應該無法插入）：

```sql
-- 嘗試插入（作為非管理員，應該會失敗）
-- 這會返回權限錯誤，證明政策已生效
INSERT INTO members (name, industry, company) 
VALUES ('測試', '測試產業', '測試公司');
```

---

## 🔄 如何還原（如果需要）

如果修改後發現問題，可以還原到原始政策：

### 還原 members 表

```sql
-- 刪除新政策
DROP POLICY IF EXISTS "Only admins can insert members" ON members;
DROP POLICY IF EXISTS "Users can update own profile" ON members;
DROP POLICY IF EXISTS "Admins can update any member" ON members;

-- 還原舊政策（如果需要）
CREATE POLICY "Enable insert access for all users" 
ON members FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update access for all users" 
ON members FOR UPDATE 
USING (true)
WITH CHECK (true);
```

**但強烈建議不要還原**，因為舊政策有嚴重安全風險！

---

## ⚠️ 可能的影響

### 1. 前端應用需要更新（如果有自動插入功能）

如果您的應用程式有自動插入 members 或 referrals 的功能：
- ✅ 需要確保使用**管理員帳號**進行操作
- ✅ 或改用 Supabase Edge Functions（需要驗證後執行）

### 2. 測試建議

修改後，請測試以下功能：

#### 管理員測試
- [ ] 管理員可以插入新會員
- [ ] 管理員可以更新任何會員的資料
- [ ] 管理員可以插入/更新引薦資料

#### 一般使用者測試
- [ ] 一般使用者可以更新**自己的**會員資料
- [ ] 一般使用者**無法**更新其他會員的資料
- [ ] 一般使用者**無法**插入新會員

#### 匿名使用者測試
- [ ] 匿名使用者**無法**插入/更新會員資料
- [ ] 匿名使用者**無法**插入/更新引薦資料
- [ ] 匿名使用者仍然可以**讀取**會員和引薦資料（如果這是預期行為）

---

## 💡 最佳實踐

1. **先備份**：雖然不會刪除資料，但建議先備份資料庫
2. **分階段執行**：先執行 members 表，測試後再執行 referrals 表
3. **測試功能**：修改後立即測試所有相關功能
4. **監控日誌**：檢查 Supabase 日誌，確認沒有大量權限錯誤

---

## 📞 如果遇到問題

如果修改後發現功能異常：

1. **檢查錯誤訊息**：Supabase Dashboard → Logs → API Logs
2. **驗證使用者權限**：確認使用者是否有 `is_admin = true`
3. **檢查政策**：執行驗證 SQL 查看當前政策
4. **暫時還原**：如果需要，可以使用還原腳本（但不建議長期使用）

---

**最後更新**：2025-01-11
