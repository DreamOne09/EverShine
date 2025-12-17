import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase credentials
const supabaseUrl = 'https://bapwzqmlvwwmnucjimsn.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // 需要 Service Role Key

if (!supabaseServiceKey) {
    console.error('❌ Please set SUPABASE_SERVICE_KEY environment variable');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migratePhotos() {
    console.log('🚀 Starting photo migration to Supabase...\n');

    // 1. Get all members from database
    const { data: members, error: fetchError } = await supabase
        .from('members')
        .select('id, name, photo')
        .order('id');

    if (fetchError) {
        console.error('❌ Error fetching members:', fetchError);
        return;
    }

    console.log(`📊 Found ${members.length} members in database\n`);

    let uploadedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const member of members) {
        // Skip if already using Supabase URL
        if (member.photo && member.photo.startsWith('https://')) {
            console.log(`⏭️  Skipping ${member.name} - already using Supabase URL`);
            skippedCount++;
            continue;
        }

        // Extract filename from path
        let filename = '';
        if (member.photo) {
            filename = member.photo.replace('/images/members/', '').replace('images/members/', '');
        } else {
            console.log(`⚠️  ${member.name} has no photo path`);
            skippedCount++;
            continue;
        }

        // Check if local file exists
        const localPath = path.join(__dirname, '../public/images/members', filename);

        if (!fs.existsSync(localPath)) {
            console.log(`❌ File not found for ${member.name}: ${filename}`);
            errorCount++;
            continue;
        }

        try {
            // Read file
            const fileBuffer = fs.readFileSync(localPath);
            const fileExt = path.extname(filename);
            const newFileName = `member-${member.id}${fileExt}`;

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('member-photos')
                .upload(`members/${newFileName}`, fileBuffer, {
                    contentType: 'image/jpeg',
                    upsert: true // Overwrite if exists
                });

            if (uploadError) {
                console.error(`❌ Upload failed for ${member.name}:`, uploadError.message);
                errorCount++;
                continue;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('member-photos')
                .getPublicUrl(`members/${newFileName}`);

            // Update database
            const { error: updateError } = await supabase
                .from('members')
                .update({ photo: publicUrl })
                .eq('id', member.id);

            if (updateError) {
                console.error(`❌ Database update failed for ${member.name}:`, updateError.message);
                errorCount++;
                continue;
            }

            console.log(`✅ ${member.name}: ${filename} → ${newFileName}`);
            uploadedCount++;

        } catch (err) {
            console.error(`❌ Error processing ${member.name}:`, err.message);
            errorCount++;
        }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`   ✅ Uploaded: ${uploadedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📊 Total: ${members.length}`);
}

migratePhotos().catch(console.error);
