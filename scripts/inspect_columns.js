import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function inspectColumns() {
    console.log('Inspecting "members" table columns...');

    // Trick: Select a non-existent column to force an error listing valid columns, 
    // OR select * and look at keys of one row.
    const { data, error } = await supabase
        .from('members')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error:', error.message);
    } else if (data && data.length > 0) {
        const columns = Object.keys(data[0]);
        console.log('Valid Columns:', columns);

        if (columns.includes('title')) console.log('✅ Column "title" exists.');
        else console.log('❌ Column "title" DOES NOT exist.');

        if (columns.includes('position')) console.log('✅ Column "position" exists.');
        else console.log('❌ Column "position" DOES NOT exist.');
    } else {
        console.log('Table empty or no access.');
    }
}

inspectColumns();
