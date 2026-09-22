-- 2026-09-22
-- 機電設計那位改名為「陽明翰M」，不再跟泰安產險「楊明翰」同名。
-- 正式站先前只有一筆混在一起的 id=48（公司/介紹是欣楠機電，產業卻寫產物保險）。
-- 此腳本：把 id=48 還原成機電並改名；另建泰安產險楊明翰。不刪引薦。

BEGIN;

-- 1) 現有 id=48 是欣楠科技機電設計 → 陽明翰M
UPDATE public.members
SET
  name = '陽明翰M',
  industry = '機電設計',
  category = '居住空間與工程',
  company = '欣楠科技股份有限公司',
  "Company" = '欣楠科技股份有限公司',
  phone = COALESCE(phone, '0978059263'),
  email = COALESCE(email, 'sunshineminghan@gmail.com'),
  hashtags = ARRAY['#機電設計', '#陽明翰M', '#BNI長輝白金分會'],
  "updatedAt" = now()
WHERE id = 48
  AND name IN ('楊明翰', '陽明翰M')
  AND company = '欣楠科技股份有限公司';

-- 2) 泰安產險楊明翰（新紀錄；照片尚未提供則用預設 logo）
INSERT INTO public.members (
  id, name, company, "Company", industry, category, photo, phone, email,
  "shortIntro", "fullIntro", services, hashtags, links, status, "updatedAt"
)
SELECT
  (SELECT COALESCE(max(id), 0) + 1 FROM public.members),
  '楊明翰',
  '泰安產物保險股份有限公司',
  '泰安產物保險股份有限公司',
  '產物保險規劃',
  '金融財富與資產',
  '/images/assets/logo/白色正方形logo.png',
  '0972735987',
  'G413@mail.taian.com.tw',
  '產物保險 找明翰 天災人禍 零負擔',
  E'個人性保險（車險、火險、意外險、旅遊險）\n企業體保險（商業火險、責任保險、工程保險）\n\n【理想引薦對象】\n中小企業主、中古車商',
  ARRAY['車險','火險','意外險','旅遊險','商業火險','責任保險','工程保險'],
  ARRAY['#產物保險規劃', '#楊明翰', '#BNI長輝白金分會'],
  '[]'::jsonb,
  'active',
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM public.members
  WHERE name = '楊明翰' AND company LIKE '泰安產物保險%'
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.members
    WHERE id = 48 AND name = '陽明翰M' AND industry = '機電設計' AND status = 'active'
  ) THEN
    RAISE EXCEPTION '陽明翰M identity not applied';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.members
    WHERE name = '楊明翰' AND company LIKE '泰安產物保險%' AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Insurance 楊明翰 not inserted';
  END IF;
  IF (SELECT count(*) FROM public.members WHERE name IN ('楊明翰', '陽明翰M') AND status = 'active') <> 2 THEN
    RAISE EXCEPTION 'Expected 楊明翰 and 陽明翰M as two active members';
  END IF;
END $$;

COMMIT;

SELECT id, name, company, industry, category, status
FROM public.members
WHERE name IN ('楊明翰', '陽明翰M')
ORDER BY id;
