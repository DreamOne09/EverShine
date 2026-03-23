-- ============================================================
-- BNI 分會官網 — Supabase Row Level Security (RLS) 完整策略
-- ============================================================
--
-- 使用方式：
--   1. 前往 Supabase Dashboard → SQL Editor
--   2. 貼上本檔案全部內容
--   3. 點選 "Run" 執行
--
-- 注意事項：
--   - 本 SQL 使用 DROP POLICY IF EXISTS，可安全重複執行
--   - 執行前請確保所有資料表已建立（見 CLONE_GUIDE.md 步驟 2.2）
--   - members.user_id 為 TEXT 型別，auth.uid() 為 UUID，
--     所有比較使用 auth.uid()::text 進行型別轉換
--
-- 最後更新：2026-03-23
-- ============================================================


-- ============================================================
-- 輔助函式：檢查目前使用者是否為管理員
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.members
        WHERE user_id = auth.uid()::text
        AND is_admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;


-- ============================================================
-- 1. members 表 — 會員資料
-- ============================================================

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- 清除舊策略（安全重複執行）
DROP POLICY IF EXISTS "members_public_read" ON public.members;
DROP POLICY IF EXISTS "members_self_update" ON public.members;
DROP POLICY IF EXISTS "members_admin_update" ON public.members;
DROP POLICY IF EXISTS "members_admin_insert" ON public.members;
DROP POLICY IF EXISTS "members_admin_delete" ON public.members;
DROP POLICY IF EXISTS "members_claim_unclaimed" ON public.members;

-- 1a. 公開讀取（前台展示需要）
CREATE POLICY "members_public_read"
    ON public.members FOR SELECT
    USING (true);

-- 1b. 會員只能更新自己的資料
CREATE POLICY "members_self_update"
    ON public.members FOR UPDATE
    USING (user_id = auth.uid()::text)
    WITH CHECK (user_id = auth.uid()::text);

-- 1c. 管理員可以更新任何人的資料
CREATE POLICY "members_admin_update"
    ON public.members FOR UPDATE
    USING (public.is_admin());

-- 1d. 管理員可以新增會員
CREATE POLICY "members_admin_insert"
    ON public.members FOR INSERT
    WITH CHECK (public.is_admin());

-- 1e. 管理員可以刪除會員
CREATE POLICY "members_admin_delete"
    ON public.members FOR DELETE
    USING (public.is_admin());

-- 1f. 未綁定的帳號可被已登入使用者認領
CREATE POLICY "members_claim_unclaimed"
    ON public.members FOR UPDATE
    USING (user_id IS NULL AND auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);


-- ============================================================
-- 2. referrals 表 — 引薦案例
-- ============================================================

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "referrals_public_read" ON public.referrals;
DROP POLICY IF EXISTS "referrals_admin_insert" ON public.referrals;
DROP POLICY IF EXISTS "referrals_admin_update" ON public.referrals;
DROP POLICY IF EXISTS "referrals_admin_delete" ON public.referrals;

-- 2a. 公開讀取
CREATE POLICY "referrals_public_read"
    ON public.referrals FOR SELECT
    USING (true);

-- 2b. 只有管理員可以新增
CREATE POLICY "referrals_admin_insert"
    ON public.referrals FOR INSERT
    WITH CHECK (public.is_admin());

-- 2c. 只有管理員可以修改
CREATE POLICY "referrals_admin_update"
    ON public.referrals FOR UPDATE
    USING (public.is_admin());

-- 2d. 只有管理員可以刪除
CREATE POLICY "referrals_admin_delete"
    ON public.referrals FOR DELETE
    USING (public.is_admin());


-- ============================================================
-- 3. homepage_stats 表 — 首頁統計數據
-- ============================================================

ALTER TABLE public.homepage_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "homepage_stats_public_read" ON public.homepage_stats;
DROP POLICY IF EXISTS "homepage_stats_admin_upsert" ON public.homepage_stats;

-- 3a. 公開讀取
CREATE POLICY "homepage_stats_public_read"
    ON public.homepage_stats FOR SELECT
    USING (true);

-- 3b. 只有管理員可以寫入/更新
CREATE POLICY "homepage_stats_admin_upsert"
    ON public.homepage_stats FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());


-- ============================================================
-- 4. page_views 表 — 頁面瀏覽紀錄
-- ============================================================

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "page_views_anyone_insert" ON public.page_views;
DROP POLICY IF EXISTS "page_views_admin_read" ON public.page_views;

-- 4a. 任何人（包括匿名訪客）都可以寫入瀏覽紀錄
CREATE POLICY "page_views_anyone_insert"
    ON public.page_views FOR INSERT
    WITH CHECK (true);

-- 4b. 只有管理員可以讀取瀏覽紀錄
CREATE POLICY "page_views_admin_read"
    ON public.page_views FOR SELECT
    USING (public.is_admin());


-- ============================================================
-- 5. analytics_events 表 — 分析事件
-- ============================================================

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "analytics_events_anyone_insert" ON public.analytics_events;
DROP POLICY IF EXISTS "analytics_events_admin_read" ON public.analytics_events;

-- 5a. 任何人可以寫入事件紀錄
CREATE POLICY "analytics_events_anyone_insert"
    ON public.analytics_events FOR INSERT
    WITH CHECK (true);

-- 5b. 只有管理員可以讀取事件紀錄
CREATE POLICY "analytics_events_admin_read"
    ON public.analytics_events FOR SELECT
    USING (public.is_admin());


-- ============================================================
-- 6. Storage Policies — member-photos Bucket
-- ============================================================

-- 6a. 公開讀取（所有人可瀏覽會員照片）
DROP POLICY IF EXISTS "member_photos_public_read" ON storage.objects;
CREATE POLICY "member_photos_public_read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'member-photos');

-- 6b. 已登入使用者可以上傳照片（檔名須以自己的 user_id 開頭）
DROP POLICY IF EXISTS "member_photos_auth_upload" ON storage.objects;
CREATE POLICY "member_photos_auth_upload"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'member-photos'
        AND auth.uid() IS NOT NULL
        AND name LIKE auth.uid()::text || '-%'
    );

-- 6c. 使用者可以更新/覆寫自己上傳的照片
DROP POLICY IF EXISTS "member_photos_auth_update" ON storage.objects;
CREATE POLICY "member_photos_auth_update"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'member-photos'
        AND auth.uid() IS NOT NULL
        AND name LIKE auth.uid()::text || '-%'
    );

-- 6d. 管理員可以管理所有照片
DROP POLICY IF EXISTS "member_photos_admin_all" ON storage.objects;
CREATE POLICY "member_photos_admin_all"
    ON storage.objects FOR ALL
    USING (
        bucket_id = 'member-photos'
        AND public.is_admin()
    );


-- ============================================================
-- 驗證：列出所有 RLS 狀態
-- ============================================================
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('members', 'referrals', 'homepage_stats', 'page_views', 'analytics_events')
ORDER BY tablename;
