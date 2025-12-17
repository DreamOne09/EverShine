import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// We need the SERVICE ROLE KEY (or at least a key with admin rights) to update bucket settings.
// Usually the Anon key can't update bucket config.
// BUT, often in these environments users only have the Anon key in .env.
// Let's check if we can do it with the current key. If not, we fall back to SQL advice.
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function makeBucketPublic() {
    console.log('Attempting to set "member-photos" bucket to PUBLIC...');

    try {
        const { data, error } = await supabase
            .storage
            .updateBucket('member-photos', {
                public: true,
                allowedMimeTypes: ['image/*'],
                fileSizeLimit: 5242880 // 5MB
            });

        if (error) {
            console.error('Failed to update bucket settings:', error.message);
            console.log('NOTE: You may need to do this in the Supabase Dashboard > Storage > member-photos > Configuration.');
        } else {
            console.log('Bucket updated successfully to PUBLIC!');
            console.log('Data:', data);
        }
    } catch (e) {
        console.error('Unexpected error:', e);
    }
}

makeBucketPublic();
