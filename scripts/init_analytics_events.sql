
-- 1. 建立進階分析事件表 (analytics_events)
-- 用於追蹤「點擊 Line」、「查看電話」、「下載檔案」等高價值行為
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL, -- e.g. click_line, view_member
    event_data JSONB DEFAULT '{}', -- e.g. { "member_name": "Alex" }
    user_agent TEXT,
    path VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 開啟安全性控制
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- 允許所有人寫入 (追蹤)
CREATE POLICY "Allow public insert events" ON analytics_events FOR INSERT WITH CHECK (true);

-- 允許管理員讀取
CREATE POLICY "Allow authenticated select events" ON analytics_events FOR SELECT USING (auth.role() = 'authenticated');
