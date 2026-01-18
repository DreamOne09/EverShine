-- ============================================================
-- 修復 homepage_stats 表的 RLS 政策
-- 問題：啟用了 RLS 但沒有建立任何政策
-- ============================================================

-- ⚠️ 重要：此腳本不會影響現有資料，只會建立 RLS 政策

-- ============================================================
-- 步驟 1：建立 SELECT 政策（允許公開讀取）
-- ============================================================
-- 首頁需要顯示統計數據，所以應該允許公開讀取

DROP POLICY IF EXISTS "Allow public read access" ON homepage_stats;

CREATE POLICY "Allow public read access" 
ON homepage_stats FOR SELECT 
USING (true);

-- ============================================================
-- 步驟 2：建立 INSERT 政策（只允許管理員）
-- ============================================================
-- 首頁統計數據應該只由管理員更新

DROP POLICY IF EXISTS "Only admins can insert homepage stats" ON homepage_stats;

CREATE POLICY "Only admins can insert homepage stats" 
ON homepage_stats FOR INSERT 
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM members 
        WHERE user_id = auth.uid() 
        AND is_admin = true
    )
);

-- ============================================================
-- 步驟 3：建立 UPDATE 政策（只允許管理員）
-- ============================================================
-- 首頁統計數據應該只由管理員更新

DROP POLICY IF EXISTS "Only admins can update homepage stats" ON homepage_stats;

CREATE POLICY "Only admins can update homepage stats" 
ON homepage_stats FOR UPDATE 
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
-- 驗證結果
-- ============================================================

-- 查看建立的政策
SELECT 
    tablename,
    policyname,
    cmd as "operation",
    permissive,
    qual as "using_expression",
    with_check as "with_check_expression"
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'homepage_stats'
ORDER BY cmd, policyname;

-- ============================================================
-- ✅ 完成！
-- ============================================================
-- 
-- 修復後的權限：
-- 
-- homepage_stats 表：
--   ✅ SELECT: 公開讀取（首頁需要顯示統計）
--   ✅ INSERT: 只允許管理員
--   ✅ UPDATE: 只允許管理員
--   ✅ DELETE: 預設拒絕（如需允許，可另外建立政策）
-- 
-- 📌 重要提醒：
--   1. 此修改不會刪除或修改任何現有資料
--   2. 所有資料仍然存在於資料庫中
--   3. 只是改變了「誰可以讀取/插入/更新資料」的規則
--
