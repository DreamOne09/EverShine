import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bapwzqmlvwwmnucjimsn.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
    console.error('❌ Please set SUPABASE_SERVICE_KEY environment variable');
    console.log('💡 Get it from: Supabase Dashboard → Settings → API → service_role key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updatePhotoUrls() {
    console.log('🔄 Updating photo URLs in database...\n');

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

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const member of members) {
        // Skip if already using full Supabase URL
        if (member.photo && member.photo.startsWith('https://bapwzqmlvwwmnucjimsn.supabase.co')) {
            console.log(`✅ ${member.name} - Already correct`);
            skippedCount++;
            continue;
        }

        // Construct new Supabase URL
        const newPhotoUrl = `https://bapwzqmlvwwmnucjimsn.supabase.co/storage/v1/object/public/member-photos/members/member-${member.id}.jpg`;

        // Check if file exists in Supabase Storage
        try {
            const response = await fetch(newPhotoUrl, { method: 'HEAD' });

            if (!response.ok) {
                console.log(`⚠️  ${member.name} (ID: ${member.id}) - Photo not found in Storage, skipping`);
                errorCount++;
                continue;
            }

            // Update database
            const { error: updateError } = await supabase
                .from('members')
                .update({ photo: newPhotoUrl })
                .eq('id', member.id);

            if (updateError) {
                console.error(`❌ ${member.name} - Update failed:`, updateError.message);
                errorCount++;
                continue;
            }

            console.log(`🔄 ${member.name} - Updated to Supabase URL`);
            updatedCount++;

        } catch (err) {
            console.error(`❌ ${member.name} - Error:`, err.message);
            errorCount++;
        }
    }

    console.log('\n📈 Update Summary:');
    console.log(`   🔄 Updated: ${updatedCount}`);
    console.log(`   ✅ Already correct: ${skippedCount}`);
    console.log(`   ❌ Errors/Not found: ${errorCount}`);
    console.log(`   📊 Total: ${members.length}`);
}

updatePhotoUrls().catch(console.error);
