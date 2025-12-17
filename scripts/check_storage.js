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

async function checkStorage() {
    console.log('Checking Storage Bucket "member-photos"...');

    try {
        const { data, error } = await supabase
            .storage
            .from('member-photos')
            .list('members', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            });

        if (error) {
            console.error('Error listing files:', error.message);
        } else {
            console.log(`Found ${data.length} files in 'members' folder.`);
            if (data.length > 0) {
                console.log('First 5 files:', data.slice(0, 5).map(f => f.name));
            } else {
                console.log('Folder appears empty.');

                // Try listing root just in case
                const { data: rootData } = await supabase.storage.from('member-photos').list();
                console.log('Files in root of bucket:', rootData.map(f => f.name));
            }
        }
    } catch (e) {
        console.error('Unexpected error:', e);
    }
}

checkStorage();
