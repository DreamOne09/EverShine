import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bapwzqmlvwwmnucjimsn.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
    console.error('❌ Please set SUPABASE_SERVICE_KEY environment variable');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkPhotoUrls() {
    console.log('🔍 Checking photo URLs in database...\n');

    const { data: members, error } = await supabase
        .from('members')
        .select('id, name, photo')
        .order('id')
        .limit(10);

    if (error) {
        console.error('❌ Error:', error);
        return;
    }

    console.log('First 10 members:\n');
    members.forEach(m => {
        console.log(`ID ${m.id}: ${m.name}`);
        console.log(`  Photo: "${m.photo}"`);
        console.log(`  Starts with /: ${m.photo?.startsWith('/')}`);
        console.log(`  Starts with https://: ${m.photo?.startsWith('https://')}`);
        console.log('');
    });
}

checkPhotoUrls().catch(console.error);
