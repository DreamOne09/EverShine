-- EverShine 長輝白金分會：引薦案例 71–76（2026-07～08）口語版
-- 可重複執行（ON CONFLICT 依 id 更新）——正式庫已有這 6 筆時，執行即覆寫文案
-- 在 Supabase Dashboard > SQL Editor 貼上執行（專案 bapwzqmlvwwmnucjimsn）
-- 編號 68–70 本批未收錄；補錄 A、B 待當事人確認，見 scripts/referrals_pending_confirm.json

BEGIN;

INSERT INTO public.referrals (id, title, description, referrer_name, referee_name, referrer_story, referee_story, metrics, created_at)
VALUES (
  'es-case-071',
  '空調工程 × 水電工程',
  '裝冷氣發現電壓不夠，當場打電話給水電夥伴接手。',
  '洪智威',
  '劉弼凱',
  '我到客戶老公寓裝冷氣，發現電壓不夠、會跳電，客戶另外還要加插座。這已經超出空調，我沒硬接下來，當場打電話給弼凱，請他過來評估。',
  '謝謝智威兄。老公寓電力本來就容易被忽略，他在現場就把我找過去，客戶配合度很高。電力不足的部分我處理完了。',
  '{"amount": "已完成", "type": "空調工程 × 水電工程"}'::jsonb,
  '2026-07-08'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  referrer_name = EXCLUDED.referrer_name,
  referee_name = EXCLUDED.referee_name,
  referrer_story = EXCLUDED.referrer_story,
  referee_story = EXCLUDED.referee_story,
  metrics = EXCLUDED.metrics,
  created_at = EXCLUDED.created_at;

INSERT INTO public.referrals (id, title, description, referrer_name, referee_name, referrer_story, referee_story, metrics, created_at)
VALUES (
  'es-case-072',
  '資訊弱電 × 展覽設計',
  '太太公司的展場案，兩次見面成交 50 萬。',
  '施秉辰',
  '劉懿德',
  '這是我太太公司的案子，大型生技展的展場設計。我知道懿德在這塊很專業，就直接對接，不用再比三家。見了兩次面就確定要做，成交 50 萬。',
  '因為是秉辰自己家人的公司，需求講得很清楚。我們見兩次面就把 50 萬的展場定下來。謝謝秉辰。',
  '{"amount": "NT$50萬", "type": "資訊弱電 × 展覽設計"}'::jsonb,
  '2026-07-22'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  referrer_name = EXCLUDED.referrer_name,
  referee_name = EXCLUDED.referee_name,
  referrer_story = EXCLUDED.referrer_story,
  referee_story = EXCLUDED.referee_story,
  metrics = EXCLUDED.metrics,
  created_at = EXCLUDED.created_at;

INSERT INTO public.referrals (id, title, description, referrer_name, referee_name, referrer_story, referee_story, metrics, created_at)
VALUES (
  'es-case-073',
  '策展規劃 × 銀行融資',
  '罰款期一過才轉貸，1,050 萬、利率約 3%。',
  '劉懿德',
  '陳亭儒',
  '朋友是建築師，房貸利率偏高，當時還在原約罰款期，不能急著轉。我知道亭儒走正規銀行專案，就先把人接上，等時間到了再動。',
  '這種案子最怕客戶心急，罰款期還沒過就硬轉，反而更虧。夥伴先引薦，我們等到對的時間：1,050 萬、利率大約 3%、23 年期，含 3 年寬限期。',
  '{"amount": "NT$1,050萬", "type": "策展規劃 × 銀行融資"}'::jsonb,
  '2026-07-29'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  referrer_name = EXCLUDED.referrer_name,
  referee_name = EXCLUDED.referee_name,
  referrer_story = EXCLUDED.referrer_story,
  referee_story = EXCLUDED.referee_story,
  metrics = EXCLUDED.metrics,
  created_at = EXCLUDED.created_at;

INSERT INTO public.referrals (id, title, description, referrer_name, referee_name, referrer_story, referee_story, metrics, created_at)
VALUES (
  'es-case-074',
  '策展規劃 × 抗病毒地板',
  '把合作多年的林師傅介紹給夥伴，兩個案場都做完了。',
  '劉懿德',
  '游凱地',
  '凱地需要信得過的施工夥伴。林師傅跟我做了很多年，我願意把人交出去。兩邊已經做完兩個案場，過程順、收尾也整齊。',
  '兩個案場都做完了。有穩定的工班，品質才撐得住。謝謝懿德把林師傅介紹過來。',
  '{"amount": "兩個案場", "type": "策展規劃 × 抗病毒地板"}'::jsonb,
  '2026-08-05'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  referrer_name = EXCLUDED.referrer_name,
  referee_name = EXCLUDED.referee_name,
  referrer_story = EXCLUDED.referrer_story,
  referee_story = EXCLUDED.referee_story,
  metrics = EXCLUDED.metrics,
  created_at = EXCLUDED.created_at;

INSERT INTO public.referrals (id, title, description, referrer_name, referee_name, referrer_story, referee_story, metrics, created_at)
VALUES (
  'es-case-075',
  '營養保健 × 品牌設計',
  '同一個客人，品牌、團服、網站都在分會裡做成，團服已經第三刷。',
  '江沛璇',
  '江學洋',
  '服務這位客人的時候，我看到對方還需要品牌，就把人交給學洋。後來同一個客人又接到團服、網站，變成四個人的生意。',
  '沛璇把品牌交給我，我做完規劃，團服找慰祖、網站找維恩。團服已經出到第三刷，網站也接了。',
  '{"amount": "團服第3次下單", "type": "營養保健 × 品牌設計"}'::jsonb,
  '2026-08-26'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  referrer_name = EXCLUDED.referrer_name,
  referee_name = EXCLUDED.referee_name,
  referrer_story = EXCLUDED.referrer_story,
  referee_story = EXCLUDED.referee_story,
  metrics = EXCLUDED.metrics,
  created_at = EXCLUDED.created_at;

INSERT INTO public.referrals (id, title, description, referrer_name, referee_name, referrer_story, referee_story, metrics, created_at)
VALUES (
  'es-case-076',
  '品牌設計 × 運動營養師',
  '教練自己先有效果，再帶學員過來，變成長期配合。',
  '江學洋',
  '楊承樺',
  '我有一位女性健身教練，訓練遇到瓶頸。卡關不是課表，是營養。我跟承樺熟，就把人轉過去。',
  '教練自己先有效果，接著介紹好幾位學員過來，後來變成長期配合。謝謝學洋。',
  '{"amount": "長期配合", "type": "品牌設計 × 運動營養師"}'::jsonb,
  '2026-08-26'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  referrer_name = EXCLUDED.referrer_name,
  referee_name = EXCLUDED.referee_name,
  referrer_story = EXCLUDED.referrer_story,
  referee_story = EXCLUDED.referee_story,
  metrics = EXCLUDED.metrics,
  created_at = EXCLUDED.created_at;

COMMIT;

-- Total: 6 cases