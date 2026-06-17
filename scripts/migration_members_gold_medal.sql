-- ============================================================
-- Migration: members.has_gold_medal — 金質獎章
-- ============================================================
-- 目的：標記會員是否獲得分會金質獎章。
-- 顯示位置：
--   * /members 列表卡片左上角（王冠 icon，hover 顯示說明）
--   * /member/:slug 個別頁姓名旁
--   * Modal 同樣顯示
-- 權限：只有 admin 可在後台新增會員時勾選；會員自己不能改（RLS 由
--      members_self_update 已保護一般欄位，has_gold_medal 雖然 RLS 沒
--      明文擋，但前端不開放編輯，admin 可透過 SQL 或新增會員 modal 設定）。
-- 安全：idempotent，可重複執行。
-- ============================================================

ALTER TABLE public.members
    ADD COLUMN IF NOT EXISTS has_gold_medal boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.members.has_gold_medal IS '金質獎章 — 分會年度卓越貢獻表揚';

-- 之後要把指定會員設為金質獎章，請執行：
--   UPDATE public.members SET has_gold_medal = true WHERE name = '李孟一';
-- 取消：
--   UPDATE public.members SET has_gold_medal = false WHERE name = '李孟一';

SELECT name, industry, has_gold_medal
FROM public.members
WHERE has_gold_medal = true
ORDER BY name;
