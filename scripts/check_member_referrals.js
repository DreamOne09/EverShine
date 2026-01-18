import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 載入環境變數...');

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 錯誤: 缺少 Supabase 環境變數');
    console.error('請確認 .env 檔案中有以下變數:');
    console.error('  - VITE_SUPABASE_URL');
    console.error('  - VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 要檢查的會員名稱清單
const MEMBERS_TO_CHECK = [
    '吳宇峰',
    '吳睿霖',
    '許雅婷',
    '周芷盈'
];

/**
 * 檢查會員在 referrals 表格中的記錄
 */
async function checkReferrals() {
    console.log('\n📋 開始檢查 referrals 表格...\n');
    console.log('要檢查的會員:');
    MEMBERS_TO_CHECK.forEach(name => console.log(`  - ${name}`));
    console.log('\n');

    try {
        // 先嘗試查詢 referrals 表格的所有記錄
        // 可能的名稱有：referrals 或 referral_cases
        const tableNames = ['referrals', 'referral_cases'];
        let referralsData = null;
        let tableName = null;

        for (const name of tableNames) {
            const { data, error } = await supabase
                .from(name)
                .select('*');

            if (!error && data) {
                tableName = name;
                referralsData = data;
                console.log(`✅ 找到表格: ${name} (共 ${data.length} 筆記錄)`);
                break;
            } else {
                console.log(`⚠️  表格 ${name} 不存在或無法存取`);
            }
        }

        if (!referralsData) {
            console.log('\n❌ 無法找到 referrals 表格，或表格為空');
            return;
        }

        console.log(`\n📊 開始搜尋這四位會員的相關記錄...\n`);

        // 檢查欄位名稱
        const firstRecord = referralsData[0];
        const referrerField = firstRecord.referrer_name || firstRecord.referrer_id || null;
        const refereeField = firstRecord.referee_name || firstRecord.referee_id || null;

        console.log('表格欄位結構:');
        console.log(JSON.stringify(Object.keys(firstRecord), null, 2));
        console.log('\n');

        const foundReferrals = [];

        // 逐一檢查每位會員
        for (const memberName of MEMBERS_TO_CHECK) {
            console.log(`🔍 搜尋 "${memberName}" 的相關記錄...`);

            // 搜尋作為 referrer（引薦人）的記錄
            const asReferrer = referralsData.filter(ref => {
                const referrerName = ref.referrer_name || ref.referrer_id || '';
                return referrerName.toString().includes(memberName) || referrerName === memberName;
            });

            // 搜尋作為 referee（被引薦人）的記錄
            const asReferee = referralsData.filter(ref => {
                const refereeName = ref.referee_name || ref.referee_id || '';
                return refereeName.toString().includes(memberName) || refereeName === memberName;
            });

            if (asReferrer.length > 0) {
                console.log(`  ✅ 找到 ${asReferrer.length} 筆作為「引薦人」的記錄:`);
                asReferrer.forEach(ref => {
                    console.log(`     - ID: ${ref.id}`);
                    console.log(`       標題: ${ref.title || 'N/A'}`);
                    console.log(`       被引薦人: ${ref.referee_name || ref.referee_id || 'N/A'}`);
                    foundReferrals.push({
                        member: memberName,
                        role: '引薦人',
                        referral: ref
                    });
                });
            }

            if (asReferee.length > 0) {
                console.log(`  ✅ 找到 ${asReferee.length} 筆作為「被引薦人」的記錄:`);
                asReferee.forEach(ref => {
                    console.log(`     - ID: ${ref.id}`);
                    console.log(`       標題: ${ref.title || 'N/A'}`);
                    console.log(`       引薦人: ${ref.referrer_name || ref.referrer_id || 'N/A'}`);
                    foundReferrals.push({
                        member: memberName,
                        role: '被引薦人',
                        referral: ref
                    });
                });
            }

            if (asReferrer.length === 0 && asReferee.length === 0) {
                console.log(`  ⚪ 未找到相關記錄`);
            }

            console.log('');
        }

        // 總結
        console.log('\n' + '='.repeat(60));
        console.log('📊 檢查結果總結');
        console.log('='.repeat(60));

        if (foundReferrals.length === 0) {
            console.log('✅ 好消息！這四位會員沒有任何 referrals 記錄');
            console.log('✅ 可以直接刪除，不會影響到其他資料');
        } else {
            console.log(`⚠️  找到 ${foundReferrals.length} 筆相關的 referrals 記錄\n`);
            console.log('建議處理方式:');
            console.log('  1. 如果這些 referrals 記錄不重要 → 可以一併刪除');
            console.log('  2. 如果想保留記錄 → 需要修改 referrals 中的姓名欄位');
            console.log('  3. 或者 → 刪除會員後，系統會顯示 "Unknown"，但不影響功能\n');

            console.log('詳細記錄列表:');
            foundReferrals.forEach((item, index) => {
                console.log(`\n${index + 1}. ${item.member} (作為${item.role})`);
                console.log(`   Referral ID: ${item.referral.id}`);
                console.log(`   標題: ${item.referral.title || 'N/A'}`);
            });
        }

        console.log('\n' + '='.repeat(60));

    } catch (error) {
        console.error('\n❌ 發生錯誤:', error);
        console.error(error.stack);
        process.exit(1);
    }
}

/**
 * 主函式
 */
async function main() {
    console.log('🚀 開始檢查會員的 referrals 記錄...\n');
    
    await checkReferrals();
    
    console.log('\n✅ 檢查完成！');
}

// 執行主函式
main();
