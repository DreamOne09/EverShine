
const { createClient } = require('@supabase/supabase-client');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkLeadership() {
    const { data, error } = await supabase
        .from('members')
        .select('name, industry, company, photo, email, phone, position')
        .in('name', ['王年煜', '王祈', '劉懿德']);

    if (error) {
        console.error(error);
        return;
    }
    console.log(JSON.stringify(data, null, 2));
}

checkLeadership();
