-- ============================================================
-- Supabase 資安警告修復腳本（安全版本）
-- ⚠️ 重要：此腳本只修改 RLS 政策，不會影響現有資料！
-- ============================================================

-- 📋 說明：
-- 1. 此腳本只會修改「權限政策」，不會刪除或修改任何資料
-- 2. 修改後，資料仍然存在，只是存取權限改變
-- 3. 建議先執行單個表的修改，測試後再執行其他

-- ============================================================
-- 步驟 1：修復 members 表（高優先級）
-- ============================================================

-- 1.1 刪除舊的過於寬鬆的 INSERT 政策
DROP POLICY IF EXISTS "Enable insert access for all users" ON members;

-- 1.2 建立新的安全的 INSERT 政策（只允許管理員）
-- 如果政策已存在，先刪除再建立
DROP POLICY IF EXISTS "Only admins can insert members" ON members;

CREATE POLICY "Only admins can insert members" 
ON members FOR INSERT 
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM members 
        WHERE user_id = auth.uid() 
        AND is_admin = true
    )
);

-- 1.3 刪除舊的過於寬鬆的 UPDATE 政策
DROP POLICY IF EXISTS "Enable update access for all users" ON members;

-- 1.4 建立新的安全的 UPDATE 政策（允許本人或管理員）
-- 政策 1：會員可以更新自己的資料
DROP POLICY IF EXISTS "Users can update own profile" ON members;

CREATE POLICY "Users can update own profile" 
ON members FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 政策 2：管理員可以更新任何會員的資料
DROP POLICY IF EXISTS "Admins can update any member" ON members;

CREATE POLICY "Admins can update any member" 
ON members FOR UPDATE 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM members 
        WHERE user_id = auth.uid() 
        AND is_admin = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM members 
        WHERE user_id = auth.uid() 
        AND is_admin = true
    )
);

-- ============================================================
-- 步驟 2：修復 referrals 表（中優先級，可選）
-- ============================================================

-- 2.1 刪除舊的過於寬鬆的 INSERT 政策
DROP POLICY IF EXISTS "Enable insert access for all users" ON referrals;

-- 2.2 建立新的安全的 INSERT 政策（只允許管理員）
DROP POLICY IF EXISTS "Only admins can insert referrals" ON referrals;

CREATE POLICY "Only admins can insert referrals" 
ON referrals FOR INSERT 
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM members 
        WHERE user_id = auth.uid() 
        AND is_admin = true
    )
);

-- 2.3 刪除舊的過於寬鬆的 UPDATE 政策
DROP POLICY IF EXISTS "Enable update access for all users" ON referrals;

-- 2.4 建立新的安全的 UPDATE 政策（只允許管理員）
DROP POLICY IF EXISTS "Only admins can update referrals" ON referrals;

CREATE POLICY "Only admins can update referrals" 
ON referrals FOR UPDATE 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM members 
        WHERE user_id = auth.uid() 
        AND is_admin = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM members 
        WHERE user_id = auth.uid() 
        AND is_admin = true
    )
);

-- ============================================================
-- 驗證修改結果（可選執行）
-- ============================================================

-- 查詢 members 表的所有 RLS 政策
SELECT 
    tablename,
    policyname,
    cmd as "operation",
    permissive,
    CASE 
        WHEN qual IS NULL THEN '無限制' 
        ELSE qual 
    END as "using_expression",
    CASE 
        WHEN with_check IS NULL THEN '無限制' 
        ELSE with_check 
    END as "with_check_expression"
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('members', 'referrals')
ORDER BY tablename, cmd, policyname;

-- ============================================================
-- ✅ 完成！
-- ============================================================
-- 
-- 修改後的權限：
-- 
-- members 表：
--   ✅ SELECT: 公開讀取（保持不變）
--   ✅ INSERT: 只允許管理員
--   ✅ UPDATE: 只允許本人或管理員
--   ✅ DELETE: 保持原有政策（如果有）
-- 
-- referrals 表：
--   ✅ SELECT: 公開讀取（保持不變）
--   ✅ INSERT: 只允許管理員
--   ✅ UPDATE: 只允許管理員
--   ✅ DELETE: 保持原有政策（如果有）
-- 
-- 📌 重要提醒：
--   1. 此修改不會刪除或修改任何現有資料
--   2. 所有資料仍然存在於資料庫中
--   3. 只是改變了「誰可以插入/更新資料」的規則
--   4. 如果功能有問題，可以隨時恢復舊的政策（檢查 git 歷史或 Supabase 備份）
--
