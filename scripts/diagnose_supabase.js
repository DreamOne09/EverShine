import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function diagnose() {
    console.log('--- Supabase Data Diagnosis ---');

    // 1. Check Total Count
    const { count: totalCount, error: countError } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('CRITICAL: Cannot access members table.', countError.message);
        return;
    }
    console.log(`Total Members: ${totalCount}`);

    // 2. Check Claimed vs Unclaimed
    const { count: unclaimedCount } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .is('user_id', null);

    const { count: claimedCount } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .not('user_id', 'is', null);

    console.log(`Unclaimed Profiles: ${unclaimedCount}`);
    console.log(`Claimed Profiles: ${claimedCount}`);

    // 3. Check Data Quality (First 3)
    const { data: sampleMembers, error: fetchError } = await supabase
        .from('members')
        .select('id, name, industry, user_id, editCount')
        .limit(3);

    if (fetchError) {
        console.error('Error fetching sample:', fetchError.message);
    } else {
        console.log('Sample Data:', sampleMembers);
    }
}

diagnose();
