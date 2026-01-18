-- ============================================================
-- 檢查四位會員在 referrals 表格中的記錄
-- 使用方法：在 Supabase Dashboard > SQL Editor 中執行此查詢
-- ============================================================

-- 一次查詢：找出這四位會員作為「引薦人」或「被引薦人」的所有記錄
SELECT 
    id,
    title,
    description,
    '引薦人' as 角色,
    referrer_name as 會員姓名,
    referee_name as 對方姓名,
    created_at
FROM referrals
WHERE referrer_name IN ('吳宇峰', '吳睿霖', '許雅婷', '周芷盈')

UNION ALL

SELECT 
    id,
    title,
    description,
    '被引薦人' as 角色,
    referee_name as 會員姓名,
    referrer_name as 對方姓名,
    created_at
FROM referrals
WHERE referee_name IN ('吳宇峰', '吳睿霖', '許雅婷', '周芷盈')

ORDER BY created_at DESC;

-- ============================================================
-- 如果上面的查詢沒有結果，表示：
-- 1. 這四位會員沒有任何 referrals 記錄 ✅ 可以安全刪除
-- 2. 或者表格名稱不是 'referrals'，請執行以下查詢確認表格名稱：
-- ============================================================

-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
--   AND (table_name LIKE '%referral%' OR table_name LIKE '%referral%');
