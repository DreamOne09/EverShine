
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
// Note: User needs SERVICE_ROLE_KEY to actually create tables via API if RLS is strict, 
// but often we can just print the SQL.
// Actually, I will just print the SQL for the user.

console.log(`
-- 請在 Supabase SQL Editor 中執行以下 SQL 指令以建立必要的資料表 --

-- 1. 建立網站數據表 (homepage_stats)
CREATE TABLE IF NOT EXISTS homepage_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    referral_count INTEGER DEFAULT 0,
    referral_value NUMERIC(15,2) DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id),
    UNIQUE(month)
);

-- Enabling RLS
ALTER TABLE homepage_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read
CREATE POLICY "Allow public read access" ON homepage_stats FOR SELECT USING (true);

-- Policy: Only Admins can update (We assume 'members' table has is_admin check logic, 
-- but simpler RLS for now: authenticated users can 'select', only admins 'insert/update')
-- Complex RLS for admin requires a custom claim or join. 
-- For now, let's allow authenticated users to Insert if they are admins (checked in app logic).
-- ideally:
-- CREATE POLICY "Allow admin update" ON homepage_stats FOR ALL USING (
--   auth.uid() IN (SELECT user_id FROM members WHERE is_admin = true)
-- );

-- 2. 建立頁面瀏覽紀錄表 (page_views)
CREATE TABLE IF NOT EXISTS page_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    path VARCHAR(255) NOT NULL,
    user_agent TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enabling RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can insert (tracking)
CREATE POLICY "Allow public insert" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin select" ON page_views FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM members WHERE is_admin = true)
);

-- 3. 確保 referrals 表存在 (如果尚未建立)
-- (這部分假設 referrals 表已經由之前的遷移腳本建立)

console.log('SQL script instructions printed.');
`);
