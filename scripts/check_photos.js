import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase environment variables missing.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMemberPhotos() {
    console.log('Checking Member Photos...');

    try {
        const { data: members, error } = await supabase
            .from('members')
            .select('id, name, photo')
            .limit(20);

        if (error) {
            console.error('Error fetching members:', error.message);
        } else {
            console.log('Member Photos (First 20):');
            members.forEach(m => {
                console.log(`ID: ${m.id}, Name: ${m.name}`);
                console.log(`   Photo Value: '${m.photo}'`); // Single quotes to see whitespace or hidden chars
            });
        }
    } catch (e) {
        console.error('Unexpected error:', e);
    }
}

checkMemberPhotos();
