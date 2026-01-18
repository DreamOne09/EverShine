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
console.log('環境變數檔案路徑:', path.join(__dirname, '..', '.env'));

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 錯誤: 缺少 Supabase 環境變數');
    console.error('請確認 .env 檔案中有以下變數:');
    console.error('  - VITE_SUPABASE_URL');
    console.error('  - VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 要移除的會員名稱清單
const MEMBERS_TO_REMOVE = [
    '吳宇峰',
    '吳睿霖',
    '許雅婷',
    '周芷盈'
];

/**
 * 查找指定的會員
 */
async function findMembers(names) {
    console.log('\n📋 開始查找會員...');
    
    const membersToDelete = [];
    
    for (const name of names) {
        const { data, error } = await supabase
            .from('members')
            .select('id, name, industry, company, email, phone, user_id')
            .eq('name', name);
        
        if (error) {
            console.error(`❌ 查詢 "${name}" 時發生錯誤:`, error.message);
            continue;
        }
        
        if (data && data.length > 0) {
            console.log(`✅ 找到會員: ${name}`);
            data.forEach(member => {
                console.log(`   ID: ${member.id}, 產業: ${member.industry || 'N/A'}, 公司: ${member.company || 'N/A'}`);
                membersToDelete.push(member);
            });
        } else {
            console.log(`⚠️  未找到會員: ${name}`);
        }
    }
    
    return membersToDelete;
}

/**
 * 刪除指定的會員
 */
async function deleteMembers(members) {
    if (members.length === 0) {
        console.log('\n⚠️  沒有需要刪除的會員');
        return;
    }
    
    console.log(`\n🗑️  準備刪除 ${members.length} 位會員...`);
    
    const memberIds = members.map(m => m.id);
    const memberNames = members.map(m => m.name).join(', ');
    
    console.log(`將刪除以下會員 ID: ${memberIds.join(', ')}`);
    console.log(`會員名稱: ${memberNames}`);
    
    // 執行刪除
    const { data, error } = await supabase
        .from('members')
        .delete()
        .in('id', memberIds)
        .select();
    
    if (error) {
        console.error('❌ 刪除失敗:', error.message);
        console.error('錯誤詳情:', error);
        return;
    }
    
    if (data && data.length > 0) {
        console.log(`\n✅ 成功刪除 ${data.length} 位會員:`);
        data.forEach(member => {
            console.log(`   - ${member.name} (ID: ${member.id})`);
        });
    } else {
        console.log('\n⚠️  刪除操作執行，但沒有返回被刪除的資料');
    }
}

/**
 * 主函式
 */
async function main() {
    console.log('🚀 開始移除會員程序...\n');
    console.log('要移除的會員清單:');
    MEMBERS_TO_REMOVE.forEach(name => console.log(`  - ${name}`));
    
    try {
        // 第一步：查找會員
        const membersToDelete = await findMembers(MEMBERS_TO_REMOVE);
        
        if (membersToDelete.length === 0) {
            console.log('\n✅ 程序完成：沒有找到需要刪除的會員');
            process.exit(0);
        }
        
        // 第二步：刪除會員
        await deleteMembers(membersToDelete);
        
        console.log('\n✅ 程序完成！');
        
    } catch (error) {
        console.error('\n❌ 發生未預期的錯誤:', error);
        console.error(error.stack);
        process.exit(1);
    }
}

// 執行主函式
main();
