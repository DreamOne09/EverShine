-- ============================================================
-- Supabase 資安警告修復腳本
-- 執行前請先備份資料庫！
-- ============================================================

-- ⚠️ 警告：此腳本會修改 RLS 政策
-- 請在 Supabase Dashboard > SQL Editor 中執行
-- 建議：先執行單個政策修改，測試後再執行全部

-- ============================================================
-- 問題 1: analytics_events 表 - 允許公開插入
-- ============================================================
-- 評估：這是預期行為（前端需要記錄分析事件）
-- 但建議加入一些基本限制（例如限制插入頻率或 IP）

-- 選項 A：保持現狀（如果這是預期行為）
-- 不做任何更改

-- 選項 B：改為僅允許已認證使用者（如果需要）
-- DROP POLICY "Allow public insert events" ON analytics_events;
-- CREATE POLICY "Allow authenticated insert events" 
-- ON analytics_events FOR INSERT 
-- TO authenticated
-- WITH CHECK (true);

-- 選項 C：加入基本驗證（例如檢查必要欄位）
-- 保持現狀，但在應用層面驗證資料完整性

-- ============================================================
-- 問題 2: members 表 - 允許公開插入（高風險！）
-- ============================================================
-- ⚠️ 這是一個高風險問題！不應該允許任何人插入會員資料

-- 修復：只允許已認證的管理員插入
DROP POLICY IF EXISTS "Enable insert access for all users" ON members;

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

-- 如果需要允許公開註冊（但不建議用於 members 表），
-- 建議改用 auth.users 表，然後再建立對應的 member 記錄

-- ============================================================
-- 問題 3: members 表 - 允許公開更新（高風險！）
-- ============================================================
-- ⚠️ 這是一個高風險問題！不應該允許任何人更新會員資料

-- 修復：只允許本人或管理員更新
DROP POLICY IF EXISTS "Enable update access for all users" ON members;

-- 政策 1：會員可以更新自己的資料
CREATE POLICY "Users can update own profile" 
ON members FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 政策 2：管理員可以更新任何會員的資料
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
-- 問題 4: page_views 表 - 允許公開插入
-- ============================================================
-- 評估：這是預期行為（前端需要記錄頁面瀏覽）

-- 保持現狀（這是預期行為）
-- 如果擔心濫用，可以考慮：
-- 1. 在應用層面加入 rate limiting
-- 2. 加入基本驗證（例如檢查必要欄位）

-- 可選：改為僅允許已認證使用者（如果需要）
-- DROP POLICY "Allow public insert" ON page_views;
-- CREATE POLICY "Allow authenticated insert page views" 
-- ON page_views FOR INSERT 
-- TO authenticated
-- WITH CHECK (true);

-- ============================================================
-- 問題 5: referrals 表 - 允許公開插入
-- ============================================================
-- ⚠️ 需要評估：是否應該允許公開插入引薦資料？

-- 選項 A：只允許已認證的管理員插入（推薦）
DROP POLICY IF EXISTS "Enable insert access for all users" ON referrals;

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

-- 選項 B：如果前端需要插入（不推薦），至少加入基本驗證
-- 保持現狀，但在應用層面嚴格驗證資料

-- ============================================================
-- 問題 6: referrals 表 - 允許公開更新
-- ============================================================
-- ⚠️ 需要修復：不應該允許公開更新

-- 修復：只允許管理員更新
DROP POLICY IF EXISTS "Enable update access for all users" ON referrals;

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
-- 問題 7: 洩漏密碼保護未啟用（非 SQL 問題）
-- ============================================================
-- 這需要在 Supabase Dashboard 中啟用
-- 路徑：Settings → Authentication → Password
-- 啟用 "Check for leaked passwords"

-- 此功能會檢查使用者密碼是否在 HaveIBeenPwned.org 的洩漏資料庫中

-- ============================================================
-- 驗證修改後的 RLS 政策
-- ============================================================

-- 查詢所有 RLS 政策
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    permissive,
    roles,
    qual as "using_expression",
    with_check as "with_check_expression"
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd, policyname;

-- ============================================================
-- 測試建議
-- ============================================================
-- 
-- 1. 測試管理員功能：
--    - 確認管理員可以插入/更新 members
--    - 確認管理員可以插入/更新 referrals
--
-- 2. 測試一般使用者：
--    - 確認一般使用者可以更新自己的 profile
--    - 確認一般使用者無法插入/更新其他會員
--
-- 3. 測試匿名使用者：
--    - 確認匿名使用者可以插入 analytics_events（如果保持公開）
--    - 確認匿名使用者可以插入 page_views（如果保持公開）
--    - 確認匿名使用者無法插入/更新 members 或 referrals
--
