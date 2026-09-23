-- 2026-09-23 名錄順序：楊明翰M 緊接在劉弼凱（id=60）之後。
-- 前台 /members 依 id 排序；61 原本空號。照片 URL 仍指向 member-48.jpg，不隨 id 改檔名。
UPDATE public.members
SET id = 61, "updatedAt" = now()
WHERE name = '楊明翰M'
  AND company = '欣楠科技股份有限公司'
  AND id IN (48, 61)
  AND NOT EXISTS (SELECT 1 FROM public.members WHERE id = 61 AND name <> '楊明翰M');
