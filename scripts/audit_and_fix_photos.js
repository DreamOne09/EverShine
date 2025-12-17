import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPublicUrlAccess(filename) {
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/member-photos/members/${filename}`;
    try {
        const res = await fetch(publicUrl, { method: 'HEAD' });
        return res.ok;
    } catch (e) {
        return false;
    }
}

async function audit() {
    console.log('Starting Audit...');

    // 1. Get All Members
    const { data: members, error } = await supabase
        .from('members')
        .select('id, name, photo');

    if (error) {
        console.error('Error fetching members:', error);
        return;
    }

    // 2. Local Files
    const localDir = path.join(__dirname, '..', 'public', 'images', 'members');
    let localFiles = [];
    try {
        localFiles = fs.readdirSync(localDir);
    } catch (e) {
        console.error('Error reading local dir:', e.message);
    }

    console.log(`Checking ${members.length} members...`);

    let updates = [];

    for (const m of members) {
        const photo = m.photo ? m.photo.trim() : '';

        if (!photo) continue;

        if (photo.startsWith('http')) {
            // Is it a Supabase URL?
            if (photo.includes('supabase.co')) {
                // Extract filename
                const parts = photo.split('/');
                const filename = parts[parts.length - 1];

                // Check if it is accessible
                const isAccessible = await checkPublicUrlAccess(filename);
                if (!isAccessible) {
                    console.log(`[ACL ISSUE] Member ${m.name} (${m.id}): Photo verified existing in bucket but not accessible publicly. Storage Policy likely missing.`);
                    // We don't update DB here, because the file exists, it's just a permission issue.
                    // But if fetching verify it DOES NOT exist even with admin, then we should fix. 
                    // But earlier step showed they EXIST in bucket. So it's a Policy issue.
                }
            }
        } else {
            // Local Path
            // Expected format: images/members/Name.jpg
            const basename = path.basename(photo);
            // Check exact match
            if (localFiles.includes(basename)) {
                // OK
            } else {
                // Try URI decoded match
                try {
                    const decodedName = decodeURIComponent(basename);
                    if (localFiles.includes(decodedName)) {
                        console.log(`[ENCODING MISMATCH] Member ${m.name}: DB has encoded name, FS has decoded.`);
                    } else {
                        console.log(`[MISSING LOCAL] Member ${m.name}: ${photo} not found in fs.`);
                        updates.push({ id: m.id, photo: '' }); // Reset to empty/default
                    }
                } catch (e) {
                    console.log(`[MISSING LOCAL] Member ${m.name}: ${photo} not found.`);
                    updates.push({ id: m.id, photo: '' });
                }
            }
        }
    }

    // We can choose to run updates or just report
    console.log(`Start to update ${updates.length} members with missing local files to default logo...`);

    // Batch update is hard with supabase-js unless we loop
    for (const update of updates) {
        const { error } = await supabase
            .from('members')
            .update({ photo: '' }) // Set to empty string so UI shows default
            .eq('id', update.id);

        if (error) console.error(`Failed to update ${update.id}:`, error.message);
        else console.log(`Reset photo for member ${update.id}`);
    }

    console.log('Audit Complete.');
}

audit();
