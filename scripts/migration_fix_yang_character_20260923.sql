-- 2026-09-23 錯字：陽明翰M → 楊明翰M（木字邊楊）
UPDATE public.members
SET
  name = '楊明翰M',
  hashtags = ARRAY['#機電設計', '#楊明翰M', '#BNI長輝白金分會'],
  "updatedAt" = now()
WHERE id IN (48, 61)
  AND name IN ('陽明翰M', '楊明翰M');
