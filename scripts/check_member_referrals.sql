-- 檢查四位會員在 referrals 表格中的記錄
-- 使用方法：在 Supabase Dashboard > SQL Editor 中執行此查詢

-- 要檢查的會員名稱
-- 吳宇峰、吳睿霖、許雅婷、周芷盈

-- 方法 1: 先確認 referrals 表格的名稱和結構
-- 請先執行這個來確認表格名稱（可能是 'referrals' 或 'referral_cases'）
-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
--   AND table_name LIKE '%referral%';

-- ============================================================
-- 查詢 referrals 表格（如果表格名稱是 'referrals'）
-- ============================================================
-- 搜尋這四位會員作為「引薦人」(referrer) 的記錄
SELECT 
    id,
    title,
    '引薦人' as role,
    referrer_name as member_name,
    referee_name as other_party_name,
    description,
    created_at
FROM referrals
WHERE referrer_name IN ('吳宇峰', '吳睿霖', '許雅婷', '周芷盈')
   OR referrer_id::text IN (
       SELECT id::text FROM members 
       WHERE name IN ('吳宇峰', '吳睿霖', '許雅婷', '周芷盈')
   );

-- 搜尋這四位會員作為「被引薦人」(referee) 的記錄
SELECT 
    id,
    title,
    '被引薦人' as role,
    referee_name as member_name,
    referrer_name as other_party_name,
    description,
    created_at
FROM referrals
WHERE referee_name IN ('吳宇峰', '吳睿霖', '許雅婷', '周芷盈')
   OR referee_id::text IN (
       SELECT id::text FROM members 
       WHERE name IN ('吳宇峰', '吳睿霖', '許雅婷', '周芷盈')
   );

-- ============================================================
-- 查詢 referral_cases 表格（如果表格名稱是 'referral_cases'）
-- ============================================================
-- 如果上面沒有結果，請執行以下查詢

-- 搜尋這四位會員作為「引薦人」(referrer) 的記錄
-- SELECT 
--     id,
--     title,
--     '引薦人' as role,
--     referrer_id as member_id,
--     referee_id as other_party_id,
--     description,
--     created_at
-- FROM referral_cases
-- WHERE referrer_id::text IN (
--     SELECT id::text FROM members 
--     WHERE name IN ('吳宇峰', '吳睿霖', '許雅婷', '周芷盈')
-- );

-- 搜尋這四位會員作為「被引薦人」(referee) 的記錄
-- SELECT 
--     id,
--     title,
--     '被引薦人' as role,
--     referee_id as member_id,
--     referrer_id as other_party_id,
--     description,
--     created_at
-- FROM referral_cases
-- WHERE referee_id::text IN (
--     SELECT id::text FROM members 
--     WHERE name IN ('吳宇峰', '吳睿霖', '許雅婷', '周芷盈')
-- );

-- ============================================================
-- 簡化版本：一次性查詢（如果表格使用姓名欄位）
-- ============================================================
-- 如果 referrals 表格使用 referrer_name 和 referee_name 欄位
-- 可以直接執行這個：

-- SELECT 
--     'referrer' as type,
--     id,
--     title,
--     referrer_name as member_name,
--     referee_name as other_party_name,
--     created_at
-- FROM referrals
-- WHERE referrer_name IN ('吳宇峰', '吳睿霖', '許雅婷', '周芷盈')

-- UNION ALL

-- SELECT 
--     'referee' as type,
--     id,
--     title,
--     referee_name as member_name,
--     referrer_name as other_party_name,
--     created_at
-- FROM referrals
-- WHERE referee_name IN ('吳宇峰', '吳睿霖', '許雅婷', '周芷盈')
-- ORDER BY created_at DESC;
