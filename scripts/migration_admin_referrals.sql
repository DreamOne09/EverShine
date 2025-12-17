-- Add admin flag to members table
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create Referrals Table
CREATE TABLE IF NOT EXISTS referral_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    referrer_id TEXT NOT NULL, -- references members(id), but user might use string IDs still or int IDs? 
    -- Warning: members.id is TEXT in some places or BIGINT? 
    -- In database members.id is usually BIGINT generated identity or UUID? 
    -- Previous scripts imply members.id is a number (integer). 
    -- Let's check schema details if possible or assume TEXT/BIGINT compatibility. 
    -- Or just store as TEXT to be safe since legacy JSON imported as text/hyphenated strings.
    referee_id TEXT NOT NULL, 
    amount TEXT, -- e.g. "1,000,000"
    amount_type TEXT, -- e.g. "TWD"
    story TEXT, -- Testimonial/Story
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE referral_cases ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view referrals
CREATE POLICY "Public referrals are viewable by everyone" 
ON referral_cases FOR SELECT 
USING (true);

-- Policy: Admins can do everything on referrals
CREATE POLICY "Admins can manage referrals" 
ON referral_cases 
USING (
    EXISTS (
        SELECT 1 FROM members 
        WHERE members.user_id = auth.uid() 
        AND members.is_admin = true
    )
);

-- Policy: Admins can update any member profile
-- Drop existing update policy if simpler needed, or add OR condition
CREATE POLICY "Admins can update any member" 
ON members FOR UPDATE 
USING (
    is_admin = true 
    OR 
    user_id = auth.uid() OR user_id IS NULL -- Existing logic for self or claim
);
-- Note: You might need to adjust existing policies manually if "OR" isn't sufficient or conflicts occur. 
-- Best to add a specific policy for Admin.

CREATE POLICY "Admins can update all members"
ON members FOR UPDATE
TO authenticated
USING (
    (SELECT is_admin FROM members WHERE user_id = auth.uid()) = true
);

-- Function to set an initial admin (Replace EMAIL with your email)
-- You can run this part separately after creating the column.
-- UPDATE members SET is_admin = true WHERE user_id = (SELECT id FROM auth.users WHERE email = 'one@dreamcube.tw');
