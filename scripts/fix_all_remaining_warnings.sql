-- ============================================================
-- 修復所有剩餘的 Supabase 資安警告
-- 執行順序建議：先執行 homepage_stats，測試後再處理其他
-- ============================================================

-- ⚠️ 重要：此腳本不會影響現有資料，只會建立/修改 RLS 政策

-- ============================================================
-- 1. 修復 homepage_stats 表（中優先級 - 建議立即處理）
-- ============================================================
-- 問題：RLS 已啟用但沒有政策
-- 影響：首頁統計無法讀取，管理員無法更新

-- 1.1 建立 SELECT 政策（公開讀取）
DROP POLICY IF EXISTS "Allow public read access" ON homepage_stats;
CREATE POLICY "Allow public read access" 
ON homepage_stats FOR SELECT 
USING (true);

-- 1.2 建立 INSERT 政策（只允許管理員）
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

-- 1.3 建立 UPDATE 政策（只允許管理員）
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
-- 2. 修復 referrals 表（可選 - 根據業務需求）
-- ============================================================
-- 如果您決定要修復 referrals 表，取消以下註解

-- 2.1 刪除舊的過於寬鬆的政策
-- DROP POLICY IF EXISTS "Enable insert access for all users" ON referrals;
-- DROP POLICY IF EXISTS "Enable update access for all users" ON referrals;

-- 2.2 建立新的安全政策
-- DROP POLICY IF EXISTS "Only admins can insert referrals" ON referrals;
-- CREATE POLICY "Only admins can insert referrals" 
-- ON referrals FOR INSERT 
-- TO authenticated
-- WITH CHECK (
--     EXISTS (
--         SELECT 1 FROM members 
--         WHERE user_id = auth.uid() 
--         AND is_admin = true
--     )
-- );

-- DROP POLICY IF EXISTS "Only admins can update referrals" ON referrals;
-- CREATE POLICY "Only admins can update referrals" 
-- ON referrals FOR UPDATE 
-- TO authenticated
-- USING (
--     EXISTS (
--         SELECT 1 FROM members 
--         WHERE user_id = auth.uid() 
--         AND is_admin = true
--     )
-- )
-- WITH CHECK (
--     EXISTS (
--         SELECT 1 FROM members 
--         WHERE user_id = auth.uid() 
--         AND is_admin = true
--     )
-- );

-- ============================================================
-- 3. analytics_events 和 page_views（保持現狀 - 預期行為）
-- ============================================================
-- 這兩個表的公開 INSERT 是預期行為（前端需要記錄）
-- 不需要修改 SQL，但建議在應用層面加入 rate limiting

-- ============================================================
-- 驗證結果
-- ============================================================

-- 查看所有表的 RLS 政策狀態
SELECT 
    tablename,
    COUNT(*) as policy_count,
    STRING_AGG(DISTINCT cmd::text, ', ') as operations
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('members', 'referrals', 'homepage_stats', 'analytics_events', 'page_views')
GROUP BY tablename
ORDER BY tablename;

-- 詳細查看各表的政策
SELECT 
    tablename,
    policyname,
    cmd as "operation",
    permissive,
    CASE 
        WHEN qual IS NULL THEN '無限制' 
        ELSE LEFT(qual, 50) 
    END as "using_expression"
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('members', 'referrals', 'homepage_stats', 'analytics_events', 'page_views')
ORDER BY tablename, cmd, policyname;

-- ============================================================
-- ✅ 完成！
-- ============================================================
-- 
-- 修復後的狀態：
-- 
-- members 表：
--   ✅ SELECT: 公開讀取
--   ✅ INSERT: 只允許管理員
--   ✅ UPDATE: 只允許本人或管理員
-- 
-- homepage_stats 表：
--   ✅ SELECT: 公開讀取
--   ✅ INSERT: 只允許管理員
--   ✅ UPDATE: 只允許管理員
-- 
-- referrals 表（如果修復）：
--   ✅ SELECT: 公開讀取（保持）
--   ✅ INSERT: 只允許管理員
--   ✅ UPDATE: 只允許管理員
-- 
-- analytics_events / page_views（保持現狀）：
--   ✅ INSERT: 公開插入（預期行為）
-- 
