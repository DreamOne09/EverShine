import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Loading env from:', path.join(__dirname, '..', '.env'));

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase environment variables missing.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing Supabase Connection...');
    console.log('URL:', supabaseUrl);

    try {
        const { count, error } = await supabase
            .from('members')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Connection failed:', error.message);
        } else {
            console.log('Connection successful!');
            console.log('Total members count:', count);

            const { data: members, error: fetchError } = await supabase
                .from('members')
                .select('id, name, editCount, user_id')
                .limit(10);

            if (fetchError) {
                console.error('Error fetching members:', fetchError.message);
            } else {
                console.log('First 10 members check:');
                members.forEach(m => {
                    console.log(`ID: ${m.id}, Name: ${m.name}, EditCount: ${m.editCount}, UserID: ${m.user_id}`);
                });
            }
        }
    } catch (e) {
        console.error('Unexpected error:', e);
    }
}

testConnection();
