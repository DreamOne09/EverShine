-- Apply after migration_members_add_20260921.sql and the ID-based member-page deployment.
BEGIN;
LOCK TABLE public.members IN SHARE ROW EXCLUSIVE MODE;
ALTER TABLE public.members DROP CONSTRAINT IF EXISTS members_name_key;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.members WHERE id=48 AND name='楊明翰' AND user_id IS NULL AND status='active') THEN
    RAISE EXCEPTION 'Insurance member identity differs; abort';
  END IF;
END $$;
UPDATE public.members SET company='泰安產物保險股份有限公司', "Company"='泰安產物保險股份有限公司',
industry='產物保險規劃', position=NULL, phone='0972735987', email='G413@mail.taian.com.tw',
"shortIntro"='產物保險 找明翰 天災人禍 零負擔',
"fullIntro"=E'個人性保險（車險、火險、意外險、旅遊險）\n企業體保險（商業火險、責任保險、工程保險）\n\n【理想引薦對象】\n中小企業主、中古車商',
services=ARRAY['車險','火險','意外險','旅遊險','商業火險','責任保險','工程保險'], "updatedAt"=now()
WHERE id=48;
INSERT INTO public.members (id,name,company,"Company",industry,category,photo,phone,email,"shortIntro","fullIntro",services,hashtags,links,status)
SELECT (SELECT max(id)+1 FROM public.members),'楊明翰','欣楠科技股份有限公司','欣楠科技股份有限公司','機電設計','居住空間與工程','','0978059263','sunshineminghan@gmail.com',
'機電設計 找明翰 智能創新 沒煩惱',
E'機電規劃、設計、施工、監工、完工、測試，後續使用中的開機操作、維護保養。\n\n【理想引薦對象】\n統包工程、室內裝修、室內設計師',
ARRAY['機電規劃','設計','施工','監工','完工','測試','開機操作','維護保養'],ARRAY[]::text[],'[]'::jsonb,'active'
WHERE NOT EXISTS (SELECT 1 FROM public.members WHERE name='楊明翰' AND company='欣楠科技股份有限公司');
UPDATE public.members SET category='居住空間與工程', "updatedAt"=now() WHERE (status='active' OR status IS NULL) AND (id IN (6,8,17,29,45,60,1008,1009) OR name IN ('劉宗霖','蔡育錚') OR (name='楊明翰' AND company='欣楠科技股份有限公司'));
UPDATE public.members SET category='品牌整合與行銷', "updatedAt"=now() WHERE (status='active' OR status IS NULL) AND (id IN (10,11,27,30,41,44,46,49,56,1011));
UPDATE public.members SET category='健康照護與身心', "updatedAt"=now() WHERE (status='active' OR status IS NULL) AND (id IN (1,4,9,19,20,22,23,1007));
UPDATE public.members SET category='金融財富與資產', "updatedAt"=now() WHERE (status='active' OR status IS NULL) AND (id IN (2,5,34,48,50,53) OR name IN ('江啟亮'));
UPDATE public.members SET category='數位科技與智能應用', "updatedAt"=now() WHERE (status='active' OR status IS NULL) AND (id IN (32,33,39,40,54));
UPDATE public.members SET category='學習成長與探索', "updatedAt"=now() WHERE (status='active' OR status IS NULL) AND (id IN (26,37,1012,1013,1014,1016));
UPDATE public.members SET category='生活服務與消費', "updatedAt"=now() WHERE (status='active' OR status IS NULL) AND (id IN (3,21,28,51,59,63,1015));
UPDATE public.members SET category='企業經營與法稅', "updatedAt"=now() WHERE (status='active' OR status IS NULL) AND (id IN (7,13,14,18,24));
DO $$ BEGIN
  IF (SELECT count(*) FROM public.members WHERE status='active' OR status IS NULL) <> 59 THEN RAISE EXCEPTION 'Expected 59 active members'; END IF;
  IF (SELECT count(*) FROM public.members WHERE (status='active' OR status IS NULL) AND category='居住空間與工程') <> 11 THEN RAISE EXCEPTION 'Unexpected count for 居住空間與工程'; END IF;
  IF (SELECT count(*) FROM public.members WHERE (status='active' OR status IS NULL) AND category='品牌整合與行銷') <> 10 THEN RAISE EXCEPTION 'Unexpected count for 品牌整合與行銷'; END IF;
  IF (SELECT count(*) FROM public.members WHERE (status='active' OR status IS NULL) AND category='健康照護與身心') <> 8 THEN RAISE EXCEPTION 'Unexpected count for 健康照護與身心'; END IF;
  IF (SELECT count(*) FROM public.members WHERE (status='active' OR status IS NULL) AND category='金融財富與資產') <> 7 THEN RAISE EXCEPTION 'Unexpected count for 金融財富與資產'; END IF;
  IF (SELECT count(*) FROM public.members WHERE (status='active' OR status IS NULL) AND category='數位科技與智能應用') <> 5 THEN RAISE EXCEPTION 'Unexpected count for 數位科技與智能應用'; END IF;
  IF (SELECT count(*) FROM public.members WHERE (status='active' OR status IS NULL) AND category='學習成長與探索') <> 6 THEN RAISE EXCEPTION 'Unexpected count for 學習成長與探索'; END IF;
  IF (SELECT count(*) FROM public.members WHERE (status='active' OR status IS NULL) AND category='生活服務與消費') <> 7 THEN RAISE EXCEPTION 'Unexpected count for 生活服務與消費'; END IF;
  IF (SELECT count(*) FROM public.members WHERE (status='active' OR status IS NULL) AND category='企業經營與法稅') <> 5 THEN RAISE EXCEPTION 'Unexpected count for 企業經營與法稅'; END IF;
  IF (SELECT count(*) FROM public.members WHERE name='楊明翰' AND status='active') <> 2 THEN RAISE EXCEPTION 'Expected two distinct Yang members'; END IF;
END $$;
COMMIT;
SELECT category,count(*) FROM public.members WHERE status='active' OR status IS NULL GROUP BY category ORDER BY category;

