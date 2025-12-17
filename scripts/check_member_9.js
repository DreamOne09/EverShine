import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkMember9() {
    const { data, error } = await supabase
        .from('members')
        .select('id, name, photo')
        // We can't filter by ID easily without knowing it, so let's match the photo string pattern
        .ilike('photo', '%member-9.jpg%');

    console.log('Member with photo member-9.jpg:', data);
}

checkMember9();
