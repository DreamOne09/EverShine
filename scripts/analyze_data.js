import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function inspectData() {
    console.log('--- Inspecting "referrals" table ---');
    const { data: referrals, error: refError } = await supabase
        .from('referrals')
        .select('*')
        .limit(1);

    if (refError) {
        console.error('Error reading referrals:', refError.message);
    } else if (referrals && referrals.length > 0) {
        console.log('Referrals columns:', Object.keys(referrals[0]));
        console.log('Sample referral:', referrals[0]);
    } else {
        console.log('Referrals table is empty or exists but no data.');
    }

    console.log('\n--- Fetching Member Industries ---');
    const { data: members, error: memError } = await supabase
        .from('members')
        .select('name, industry, category'); // fetch existing category too

    if (memError) {
        console.error('Error reading members:', memError.message);
    } else {
        console.log(`Found ${members.length} members.`);
        const industries = [...new Set(members.map(m => m.industry))];
        console.log('Unique Industries:', industries);
        console.log('Member Data Sample:', members.slice(0, 5));
    }
}

inspectData();
