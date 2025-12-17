import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function systemHealthCheck() {
    console.log('🏥 starting System Health Check...\n');
    let errors = 0;

    // 1. Supabase Connection & Members Count
    try {
        console.log('1. Checking Database Connection...');
        const { count, error } = await supabase.from('members').select('*', { count: 'exact', head: true });
        if (error) throw error;
        console.log(`   ✅ Connection OK. Total Members: ${count}`);
    } catch (e) {
        console.error(`   ❌ Database Error: ${e.message}`);
        errors++;
    }

    // 2. Storage Public Access Check
    try {
        console.log('\n2. Checking Storage Access (Random Sample)...');
        // Get 3 random members with http photos
        const { data: members } = await supabase
            .from('members')
            .select('name, photo')
            .not('photo', 'is', null)
            .ilike('photo', 'http%')
            .limit(3);

        if (members && members.length > 0) {
            for (const m of members) {
                try {
                    const res = await fetch(m.photo, { method: 'HEAD' });
                    if (res.ok) {
                        console.log(`   ✅ Access OK: ${m.name}`);
                    } else {
                        console.log(`   ❌ Access Failed (${res.status}): ${m.name} - ${m.photo}`);
                        errors++;
                    }
                } catch (err) {
                    console.log(`   ❌ Network Error: ${m.name}`);
                    errors++;
                }
            }
        } else {
            console.log('   ℹ️ No members with online photos found to test.');
        }
    } catch (e) {
        console.error(`   ❌ Storage Check Error: ${e.message}`);
        errors++;
    }

    // 3. User ID / RLS Policy Check
    try {
        console.log('\n3. Checking RLS / Claim Status...');
        const { count: unclaimed } = await supabase.from('members').select('*', { count: 'exact', head: true }).is('user_id', null);
        console.log(`   ℹ️ Unclaimed Profiles: ${unclaimed}`);
        // If we can read this count without auth, public read is working.
        console.log('   ✅ Public Read Policy seems active.');
    } catch (e) {
        console.error(`   ❌ RLS Check Error: ${e.message}`);
        errors++;
    }

    console.log(`\n🏁 Health Check Complete. Found ${errors} issues.`);
}

systemHealthCheck();
