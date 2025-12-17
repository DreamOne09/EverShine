import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bapwzqmlvwwmnucjimsn.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
    console.error('❌ Please set SUPABASE_SERVICE_KEY environment variable');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixPhotoUrls() {
    console.log('🔧 Fixing photo URLs in database...\n');

    // Get all members
    const { data: members, error: fetchError } = await supabase
        .from('members')
        .select('id, name, photo')
        .order('id');

    if (fetchError) {
        console.error('❌ Error fetching members:', fetchError);
        return;
    }

    console.log(`📊 Found ${members.length} members\n`);

    let fixedCount = 0;
    let skippedCount = 0;

    for (const member of members) {
        if (!member.photo) {
            console.log(`⏭️  ${member.name} - No photo`);
            skippedCount++;
            continue;
        }

        let needsUpdate = false;
        let newPhotoUrl = member.photo;

        // Fix 1: Remove leading slash from https:// URLs
        if (member.photo.startsWith('/https://') || member.photo.startsWith('/http://')) {
            newPhotoUrl = member.photo.substring(1); // Remove the leading /
            needsUpdate = true;
            console.log(`🔧 ${member.name} - Removing leading slash`);
        }

        // Fix 2: Ensure Supabase URLs are complete and correct
        if (newPhotoUrl.includes('supabase.co') && !newPhotoUrl.startsWith('https://')) {
            newPhotoUrl = `https://${newPhotoUrl}`;
            needsUpdate = true;
            console.log(`🔧 ${member.name} - Adding https://`);
        }

        if (needsUpdate) {
            const { error: updateError } = await supabase
                .from('members')
                .update({ photo: newPhotoUrl })
                .eq('id', member.id);

            if (updateError) {
                console.error(`❌ ${member.name} - Update failed:`, updateError.message);
            } else {
                console.log(`✅ ${member.name} - Fixed: ${member.photo} → ${newPhotoUrl}`);
                fixedCount++;
            }
        } else {
            console.log(`✅ ${member.name} - Already correct`);
            skippedCount++;
        }
    }

    console.log('\n📈 Fix Summary:');
    console.log(`   🔧 Fixed: ${fixedCount}`);
    console.log(`   ✅ Already correct: ${skippedCount}`);
    console.log(`   📊 Total: ${members.length}`);
}

fixPhotoUrls().catch(console.error);
