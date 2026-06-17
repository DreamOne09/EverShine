-- 刪除已被 es-case-001～067 取代的舊引薦案例（與前端 dedupeReferralsForDisplay 對應）
-- 在 Supabase SQL Editor 執行一次即可；若 ID 不存在則略過。

DELETE FROM referrals
WHERE id IN (
    'ref-001',
    'ref-002',
    'ref-003',
    'ref-004',
    'ref-005',
    'ref-006',
    'ref-007',
    'ref-008',
    'ref-009',
    'ref-010',
    'ref-011',
    'ref-012',
    'ref-013',
    'new-case-1',
    'new-case-2',
    'new-case-3',
    'new-case-4',
    'new-case-5',
    'new-case-6'
);
