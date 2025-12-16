
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const MEMBERS_FILE = path.join(__dirname, '..', 'public', 'data', 'members.json');
const REFERRALS_FILE = path.join(__dirname, '..', 'public', 'data', 'referrals.json');
const IMAGES_DIR = path.join(__dirname, '..', 'public'); // Base dir for images

const uploadImage = async (localPath, memberId) => {
    if (!localPath) return null;

    // Normalize path (remove leading slash)
    const relativePath = localPath.startsWith('/') ? localPath.slice(1) : localPath;
    const fullPath = path.join(IMAGES_DIR, relativePath);

    if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️  Image not found locally: ${fullPath}`);
        return null;
    }

    const fileContent = fs.readFileSync(fullPath);
    // Use Member ID as filename to avoid Chinese character issues in Supabase Storage
    const ext = path.extname(relativePath) || '.jpg';
    const safeInfo = memberId || 'unknown';
    const storagePath = `members/${safeInfo}${ext}`;

    const { data, error } = await supabase.storage
        .from('member-photos')
        .upload(storagePath, fileContent, {
            upsert: true,
            contentType: 'image/jpeg'
        });

    if (error) {
        console.error(`❌ Failed to upload image for ${memberId}:`, error.message);
        return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('member-photos')
        .getPublicUrl(storagePath);

    return publicUrl;
};

const migrateMembers = async () => {
    console.log('🚀 Starting Members Migration (Retry)...');
    const rawData = fs.readFileSync(MEMBERS_FILE, 'utf8');
    const json = JSON.parse(rawData);
    const members = Array.isArray(json) ? json : json.members;

    let successCount = 0;

    for (const member of members) {
        process.stdout.write(`Processing ${member.name} (${member.id})... `);

        // 1. Upload Photo
        let photoUrl = member.photo;
        // Check if it's a local path needs uploading (not already http)
        if (member.photo && !member.photo.startsWith('http')) {
            const uploadedUrl = await uploadImage(member.photo, member.id);
            if (uploadedUrl) {
                photoUrl = uploadedUrl;
                process.stdout.write(' [Photo Uploaded] ');
            }
        }

        // 2. Prepare Data
        const dbMember = {
            id: member.id,
            name: member.name,
            company: member.company,
            position: member.position,
            title: member.title,
            industry: member.industry,
            category: member.category,
            shortIntro: member.shortIntro,
            fullIntro: member.fullIntro,
            photo: photoUrl,
            photoPosition: member.photoPosition,
            services: member.services,
            hashtags: member.hashtags,
            links: member.links,
            pinHash: member.pinHash,
            editCount: member.editCount || 0,
            createdAt: member.createdAt || new Date().toISOString(),
            updatedAt: member.updatedAt || new Date().toISOString(),
        };

        // 3. Upsert to DB
        const { error } = await supabase
            .from('members')
            .upsert(dbMember, { onConflict: 'id' });

        if (error) {
            console.error(`\n❌ Failed to upsert member ${member.name}:`, error.message);
        } else {
            console.log('✅ Done');
            successCount++;
        }
    }
    console.log(`🎉 Members Migration Completed! (${successCount}/${members.length})`);
};

const migrateReferrals = async () => {
    console.log('\n🚀 Starting Referrals Migration...');
    if (!fs.existsSync(REFERRALS_FILE)) {
        console.log('ℹ️  No referrals.json found. Skipping.');
        return;
    }

    const rawData = fs.readFileSync(REFERRALS_FILE, 'utf8');
    const json = JSON.parse(rawData);
    const referrals = json.referrals || [];

    let successCount = 0;

    for (const ref of referrals) {
        // Skip if either name is missing
        if (!ref.referrer?.name || !ref.referee?.name) {
            console.warn(`⚠️  Skipping referral ${ref.id}: Missing names`);
            continue;
        }

        const dbRef = {
            id: ref.id,
            title: ref.title,
            description: ref.description,
            metrics: ref.metrics,
            referrer_name: ref.referrer.name,
            referee_name: ref.referee.name,
            referrer_story: ref.referrer.story,
            referrer_testimonial: ref.referrer.testimonial,
            referee_story: ref.referee.story,
            referee_value: ref.referee.value,
        };

        const { error } = await supabase
            .from('referrals')
            .upsert(dbRef, { onConflict: 'id' });

        if (error) {
            console.error(`❌ Failed to upsert referral ${ref.id}:`, error.message);
        } else {
            successCount++;
        }
    }
    console.log(`🎉 Referrals Migration Completed! (${successCount}/${referrals.length})`);
};

const main = async () => {
    await migrateMembers();
    await migrateReferrals();
};

main();
