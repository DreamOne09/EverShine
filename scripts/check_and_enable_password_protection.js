import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || `https://${process.env.SUPABASE_PROJECT_ID || 'bapwzqmlvwwmnucjimsn'}.supabase.co`;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔐 檢查洩漏密碼保護設定...\n');

if (!supabaseServiceKey) {
    console.error('❌ 錯誤: 缺少 SUPABASE_SERVICE_ROLE_KEY 環境變數');
    console.error('請在 .env 檔案中設定：');
    console.error('  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key\n');
    console.error('⚠️  重要：Service Role Key 不應在前端使用！');
    process.exit(1);
}

// 使用 Service Role Key 建立客戶端
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

/**
 * 檢查當前認證設定
 */
async function checkAuthSettings() {
    console.log('📋 檢查認證設定...\n');

    try {
        // 嘗試讀取 auth.config（但這可能不適用於所有 Supabase 版本）
        // 大部分 Supabase 設定需要透過 Dashboard 或 Management API
        
        console.log('⚠️  注意：洩漏密碼保護設定通常無法透過 SQL 或一般 API 直接修改');
        console.log('   需要在 Supabase Dashboard 中手動啟用\n');
        
        // 提供指導
        console.log('📝 啟用步驟：');
        console.log('   1. 前往 Supabase Dashboard');
        console.log(`   2. 專案 ID: ${supabaseUrl.split('//')[1].split('.')[0]}`);
        console.log('   3. 左側選單：Authentication → CONFIGURATION → Policies');
        console.log('   4. 或搜尋：leaked password / password protection');
        console.log('   5. 啟用 "Check for leaked passwords" 或 "Leaked Password Protection"\n');
        
        console.log('🔗 參考文件：');
        console.log('   https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection\n');

    } catch (error) {
        console.error('❌ 檢查設定時發生錯誤:', error.message);
    }
}

/**
 * 測試密碼檢查（模擬）
 */
async function testPasswordCheck() {
    console.log('🧪 測試密碼檢查功能...\n');
    
    // 注意：Service Role Key 無法直接測試密碼保護功能
    // 這個功能是在 auth.signUp() 或 auth.updateUser() 時由 Supabase 自動檢查
    
    console.log('ℹ️  洩漏密碼保護是在使用者註冊或更改密碼時自動檢查的');
    console.log('   不需要在應用層面額外實作（如果已在 Dashboard 啟用）\n');
    
    console.log('💡 測試方式：');
    console.log('   1. 啟用保護後，嘗試使用洩漏的密碼註冊');
    console.log('   2. 例如：password123, 12345678 等常見洩漏密碼');
    console.log('   3. 應該會被 Supabase 拒絕並顯示錯誤訊息\n');
}

/**
 * 主函式
 */
async function main() {
    console.log('🚀 開始檢查 Supabase 認證設定...\n');
    console.log('='.repeat(60) + '\n');
    
    await checkAuthSettings();
    await testPasswordCheck();
    
    console.log('='.repeat(60));
    console.log('\n✅ 檢查完成！');
    console.log('\n📌 總結：');
    console.log('   洩漏密碼保護需要在 Supabase Dashboard 中啟用');
    console.log('   無法透過 SQL 或一般 API 直接設定');
    console.log('   請按照上述步驟在 Dashboard 中手動啟用\n');
}

// 執行主函式
main().catch(error => {
    console.error('\n❌ 發生錯誤:', error);
    process.exit(1);
});
