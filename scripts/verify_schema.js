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
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySchema() {
    console.log('Verifying user_id column...');

    try {
        // Try to select user_id from one row
        const { data, error } = await supabase
            .from('members')
            .select('user_id')
            .limit(1);

        if (error) {
            console.error('Schema Check Failed:', error.message);
        } else {
            console.log('Schema Check Passed: user_id column exists.');
        }
    } catch (e) {
        console.error('Unexpected error:', e);
    }
}

verifySchema();
