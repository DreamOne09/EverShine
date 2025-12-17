
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const newMember = {
    name: "周律廷",
    industry: "身心健康與醫療", // Mapped from "中醫師" -> "身心健康與醫療"
    title: "中醫師",
    company: "新莊京都堂中醫診所",
    category: "身心健康與醫療,中醫", // Added tags
    shortIntro: "病症調理找律廷 身體健康看中醫",
    fullIntro: `大家好！我是長輝中醫師代表周律廷。
你是否因為生活壓力大，而有睡眠障礙、腸胃不適或長期疲勞的問題呢？這些都可能是身體失衡的警訊。
我們診所提供全面的病症調理服務，從內科、婦科到皮膚調理，透過精準把脈與溫和中藥，找回您身體的自癒力。

尋求引薦：
有慢性病、婦科、皮膚病症困擾的族群。

服務項目：
中醫內科看診把脈、客製化水藥調理、中醫玉顏針美顏療程`,
    links: {
        "website": "",
        "facebook": "",
        "instagram": "",
        "line": "0921495828"
    },
    services: ["中醫內科", "玉顏針", "體質調理"],
    hashtags: ["中醫", "健康", "調理"],
    email: "u992302704@gmail.com",
    phone: "0921495828",
    photo: "/images/members/alex_chou.jpg"
};

async function addMember() {
    console.log(`Preparing to add member: ${newMember.name}`);

    // Check if member already exists (by name or phone)
    const { data: existing } = await supabase
        .from('members')
        .select('id')
        .or(`name.eq.${newMember.name},phone.eq.${newMember.phone}`)
        .maybeSingle();

    if (existing) {
        console.log(`Member ${newMember.name} already exists (ID: ${existing.id}). Updating...`);
        const { error } = await supabase.from('members').update(newMember).eq('id', existing.id);
        if (error) console.error('Error updating:', error);
        else console.log('Update successful.');
    } else {
        // Insert new
        const { error } = await supabase.from('members').insert(newMember);
        if (error) console.error('Error inserting:', error);
        else console.log('Insert successful.');
    }
}

addMember();
