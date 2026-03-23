-- ============================================================
-- Storage Policies — member-photos Bucket
-- ============================================================
-- 請在執行完 supabase-rls.sql 之後，再單獨執行本檔案。
-- 如果本檔案報錯，請改用 Supabase Dashboard → Storage →
-- member-photos → Policies 手動設定以下規則。
-- ============================================================

-- 清除舊策略
DROP POLICY IF EXISTS "member_photos_public_read" ON storage.objects;
DROP POLICY IF EXISTS "member_photos_auth_upload" ON storage.objects;
DROP POLICY IF EXISTS "member_photos_auth_update" ON storage.objects;
DROP POLICY IF EXISTS "member_photos_admin_all" ON storage.objects;

-- 所有人可讀（公開照片）
CREATE POLICY "member_photos_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'member-photos');

-- 已登入使用者可上傳（檔名以 user_id 開頭）
CREATE POLICY "member_photos_auth_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'member-photos'
    AND auth.role() = 'authenticated'
    AND (name LIKE CAST(auth.uid() AS text) || '-%')
  );

-- 已登入使用者可更新自己的照片
CREATE POLICY "member_photos_auth_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'member-photos'
    AND auth.role() = 'authenticated'
    AND (name LIKE CAST(auth.uid() AS text) || '-%')
  );

-- 管理員可管理所有照片
CREATE POLICY "member_photos_admin_all"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'member-photos'
    AND public.is_admin()
  );
