-- 2026-05 ~ 2026-08 引薦成果。ON CONFLICT month 可重跑。
-- 5 月數字與既有列相同，一併寫入以免漏月。
INSERT INTO public.homepage_stats (month, referral_count, referral_value, guest_count)
VALUES
    ('2026-05', 412,  4779489, 16),
    ('2026-06', 389, 15511211,  8),
    ('2026-07', 524, 17204244, 13),
    ('2026-08', 405, 12203395, 14)
ON CONFLICT (month) DO UPDATE SET
    referral_count = EXCLUDED.referral_count,
    referral_value = EXCLUDED.referral_value,
    guest_count    = EXCLUDED.guest_count;

SELECT month, referral_count, referral_value, guest_count
FROM public.homepage_stats
WHERE month BETWEEN '2026-05' AND '2026-08'
ORDER BY month;
