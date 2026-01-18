-- ============================================================
-- 剩餘 Supabase 資安警告修復腳本
-- 說明：此腳本處理 analytics_events 和 page_views 表
-- ============================================================

-- ⚠️ 重要提示：
-- analytics_events 和 page_views 的公開 INSERT 可能是預期行為
-- （前端需要記錄分析和頁面瀏覽）
-- 
-- 如果您的應用確實需要前端直接插入這些資料，可以保持現狀
-- 但建議在應用層面加入：
-- 1. Rate limiting（防止濫用）
-- 2. 資料驗證（確保資料完整性）
-- 3. 監控異常活動

-- ============================================================
-- 選項 A：保持現狀（推薦，如果這是預期行為）
-- ============================================================
-- 不做任何修改，但建議在應用層面加入保護機制

-- ============================================================
-- 選項 B：改為僅允許已認證使用者插入（如果需要更嚴格）
-- ============================================================

-- 1. analytics_events 表
-- 如果決定改為需要認證，執行以下 SQL：

-- DROP POLICY IF EXISTS "Allow public insert events" ON analytics_events;
-- 
-- CREATE POLICY "Allow authenticated insert events" 
-- ON analytics_events FOR INSERT 
-- TO authenticated
-- WITH CHECK (true);

-- 注意：改為需要認證後，匿名使用者將無法記錄分析事件
-- 這可能影響您的分析數據完整性

-- 2. page_views 表
-- 如果決定改為需要認證，執行以下 SQL：

-- DROP POLICY IF EXISTS "Allow public insert" ON page_views;
-- 
-- CREATE POLICY "Allow authenticated insert page views" 
-- ON page_views FOR INSERT 
-- TO authenticated
-- WITH CHECK (true);

-- 注意：改為需要認證後，匿名使用者將無法記錄頁面瀏覽
-- 這可能影響您的頁面統計數據

-- ============================================================
-- 選項 C：加入基本驗證（推薦替代方案）
-- ============================================================
-- 保持公開插入，但在 RLS 政策中加入基本驗證

-- 範例：確保必要欄位存在（這需要在應用層面實作）
-- 當前 RLS 無法直接驗證欄位內容，只能透過 WITH CHECK

-- analytics_events 表 - 加入基本驗證
-- DROP POLICY IF EXISTS "Allow public insert events" ON analytics_events;
-- 
-- CREATE POLICY "Allow public insert events with validation" 
-- ON analytics_events FOR INSERT 
-- WITH CHECK (
--     event_name IS NOT NULL 
--     AND LENGTH(event_name) <= 100
--     AND created_at IS NOT NULL
-- );

-- page_views 表 - 加入基本驗證
-- DROP POLICY IF EXISTS "Allow public insert" ON page_views;
-- 
-- CREATE POLICY "Allow public insert with validation" 
-- ON page_views FOR INSERT 
-- WITH CHECK (
--     path IS NOT NULL 
--     AND LENGTH(path) <= 255
--     AND created_at IS NOT NULL
-- );

-- ============================================================
-- 建議的處理方式
-- ============================================================

-- 1. 保持現狀（如果這是預期行為）
--    ✅ 不需要修改 SQL
--    ✅ 但要在應用層面加入 rate limiting

-- 2. 如果需要更嚴格的安全控制
--    選擇選項 B（改為需要認證）
--    ⚠️ 注意：這會影響匿名使用者的數據記錄

-- 3. 如果需要平衡安全性和功能
--    選擇選項 C（加入基本驗證）
--    ✅ 仍然允許公開插入，但確保資料完整性

-- ============================================================
-- 當前狀態檢查
-- ============================================================

-- 查看當前政策
SELECT 
    tablename,
    policyname,
    cmd as "operation",
    permissive,
    qual as "using_expression",
    with_check as "with_check_expression"
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('analytics_events', 'page_views')
ORDER BY tablename, cmd, policyname;

-- ============================================================
-- 應用層面建議
-- ============================================================

-- 如果您決定保持公開插入，建議在應用層面：

-- 1. Rate Limiting
--    - 限制每個 IP 的請求頻率
--    - 例如：每分鐘最多 60 次插入

-- 2. 資料驗證
--    - 檢查必要欄位
--    - 驗證資料格式和長度
--    - 防止 SQL 注入（Supabase 已預設保護）

-- 3. 監控
--    - 監控異常的大量插入
--    - 設定 Supabase Dashboard 的日誌和警報

-- ============================================================
-- 範例：Rate Limiting（在應用層面實作）
-- ============================================================

-- 在 src/lib/analytics.ts 或相關檔案中加入：

/*
// 簡單的 Rate Limiting 實作
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) || [];
  
  // 清除過期的時間戳
  const validTimestamps = timestamps.filter(ts => now - ts < windowMs);
  
  if (validTimestamps.length >= limit) {
    return false; // 超過限制
  }
  
  validTimestamps.push(now);
  rateLimitMap.set(key, validTimestamps);
  return true; // 允許
}

// 使用範例
const ip = getClientIP(); // 從請求中取得 IP
if (!checkRateLimit(`analytics_${ip}`, 60, 60000)) {
  // 超過限制，不記錄
  return;
}
*/
