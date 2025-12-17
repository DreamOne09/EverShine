import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://evershine.tw';

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => resolve());
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

const syncData = async () => {
    console.log('🚀 開始從營運網站同步資料...');

    // 1. Sync Members Data
    console.log('📥 正在下載最新會員資料...');
    const membersDest = path.join(__dirname, '..', 'public', 'data', 'members.json');
    await downloadFile(`${DOMAIN}/data/members.json`, membersDest);
    console.log('✅ members.json 已更新');

    // 2. Sync Images
    console.log('🖼️ 正在同步會員照片...');
    const membersData = JSON.parse(fs.readFileSync(membersDest, 'utf8'));
    const members = membersData.members || membersData;

    const imagesDir = path.join(__dirname, '..', 'public');

    let downloadCount = 0;
    for (const member of members) {
        if (member.photo && member.photo.startsWith('/images/')) {
            const photoUrl = `${DOMAIN}${member.photo}`;
            const photoDest = path.join(imagesDir, member.photo);

            // Ensure dir exists
            const photoDir = path.dirname(photoDest);
            if (!fs.existsSync(photoDir)) {
                fs.mkdirSync(photoDir, { recursive: true });
            }

            // Check if file exists to avoid redownloading? 
            // Better to download to be sure, or check size. 
            // For now, let's just download everything to match production.
            try {
                process.stdout.write(`   下載 ${member.name} 的照片... `);
                await downloadFile(photoUrl, photoDest);
                console.log('OK');
                downloadCount++;
            } catch (e) {
                console.log('失敗 (可能是預設圖或不存在)');
            }
        }
    }
    console.log(`✅ 已同步 ${downloadCount} 張照片`);

    console.log('🎉 資料同步完成！');
    console.log('👉 請執行以下指令將變更推送到 GitHub 以永久保存：');
    console.log('   git add public/data/members.json');
    console.log('   git commit -m "chore: sync data from production"');
    console.log('   git push');
};

syncData().catch(err => {
    console.error('❌ 同步失敗:', err);
});
