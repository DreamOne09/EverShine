import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Supabase Warning 檢查工具\n');

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 錯誤: 缺少 Supabase 環境變數');
    console.error('請確認 .env 檔案中有以下變數:');
    console.error('  - VITE_SUPABASE_URL');
    console.error('  - VITE_SUPABASE_ANON_KEY 或 SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

// 使用 Service Role Key 可以檢查 RLS 政策
const useServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(
    supabaseUrl, 
    useServiceRole ? process.env.SUPABASE_SERVICE_ROLE_KEY : supabaseKey
);

const warnings = [];

/**
 * 檢查 RLS 狀態
 */
async function checkRLS() {
    console.log('📋 1. 檢查 Row Level Security (RLS) 狀態...\n');

    // 常見的表名列表
    const expectedTables = [
        'members',
        'referrals',
        'referral_cases',
        'homepage_stats',
        'page_views',
        'analytics_events'
    ];

    try {
        // 查詢所有公開表（使用 SQL）
        const { data: tables, error } = await supabase.rpc('exec_sql', {
            query: `
                SELECT 
                    tablename,
                    rowsecurity as "rls_enabled"
                FROM pg_tables 
                WHERE schemaname = 'public'
                ORDER BY tablename;
            `
        }).catch(() => ({ data: null, error: 'RPC not available' }));

        if (error || !tables) {
            // 如果無法使用 RPC，改用查詢各個表來判斷
            console.log('   ℹ️  無法直接查詢 RLS 狀態，改用間接檢查...\n');

            for (const tableName of expectedTables) {
                try {
                    // 嘗試查詢表（如果 RLS 過於嚴格可能失敗）
                    const { error: queryError } = await supabase
                        .from(tableName)
                        .select('*', { count: 'exact', head: true })
                        .limit(0);

                    if (queryError) {
                        // 某些錯誤可能表示 RLS 已啟用但政策過嚴
                        console.log(`   ✅ ${tableName}: RLS 可能已啟用（有政策限制）`);
                    } else {
                        console.log(`   ⚠️  ${tableName}: 可能未啟用 RLS 或政策允許公開存取`);
                        warnings.push({
                            type: 'RLS',
                            table: tableName,
                            severity: 'medium',
                            message: '表可能未啟用 RLS 或政策過於寬鬆'
                        });
                    }
                } catch (e) {
                    console.log(`   ❓ ${tableName}: 無法檢查（表可能不存在）`);
                }
            }
        } else {
            // 顯示 RLS 狀態
            tables.forEach(table => {
                if (table.rls_enabled) {
                    console.log(`   ✅ ${table.tablename}: RLS 已啟用`);
                } else {
                    console.log(`   ⚠️  ${table.tablename}: RLS 未啟用`);
                    warnings.push({
                        type: 'RLS',
                        table: table.tablename,
                        severity: 'high',
                        message: '表未啟用 Row Level Security'
                    });
                }
            });
        }
    } catch (error) {
        console.error('   ❌ 檢查 RLS 時發生錯誤:', error.message);
    }

    console.log('');
}

/**
 * 檢查 RLS 政策
 */
async function checkRLSPolicies() {
    console.log('📋 2. 檢查 RLS 政策...\n');

    const { data: policies, error } = await supabase.rpc('exec_sql', {
        query: `
            SELECT 
                schemaname,
                tablename,
                policyname,
                permissive,
                roles,
                cmd,
                qual
            FROM pg_policies
            WHERE schemaname = 'public'
            ORDER BY tablename, policyname;
        `
    }).catch(() => ({ data: null, error: 'RPC not available' }));

    if (error || !policies) {
        console.log('   ℹ️  無法直接查詢 RLS 政策（需要 Service Role Key）\n');
        console.log('   💡 建議：使用 Service Role Key 或直接在 Supabase Dashboard 查看\n');
        return;
    }

    if (!policies || policies.length === 0) {
        console.log('   ⚠️  未找到任何 RLS 政策');
        warnings.push({
            type: 'POLICY',
            severity: 'high',
            message: '資料表未設定 RLS 政策'
        });
    } else {
        console.log(`   ✅ 找到 ${policies.length} 個 RLS 政策\n`);

        // 按表分組顯示
        const policiesByTable = {};
        policies.forEach(policy => {
            if (!policiesByTable[policy.tablename]) {
                policiesByTable[policy.tablename] = [];
            }
            policiesByTable[policy.tablename].push(policy);
        });

        Object.entries(policiesByTable).forEach(([table, tablePolicies]) => {
            console.log(`   📊 ${table}:`);
            tablePolicies.forEach(policy => {
                console.log(`      - ${policy.policyname} (${policy.cmd})`);
                if (policy.cmd === 'SELECT' && policy.qual && policy.qual.includes('true')) {
                    console.log(`        ⚠️  警告：允許公開讀取`);
                }
            });
            console.log('');
        });
    }
}

/**
 * 檢查 Service Role Key 是否暴露
 */
async function checkServiceRoleKey() {
    console.log('📋 3. 檢查 Service Role Key 暴露風險...\n');

    if (useServiceRole) {
        console.log('   ✅ 正在使用 Service Role Key（僅用於後端腳本）\n');
    } else {
        console.log('   ✅ 正在使用 Anon Key（適合前端使用）\n');
    }

    // 檢查前端程式碼中是否有 Service Role Key 的痕跡
    console.log('   💡 建議：手動檢查前端程式碼是否包含 Service Role Key\n');
    console.log('      搜尋方式: grep -r "service_role" src/\n');
}

/**
 * 檢查環境變數設定
 */
function checkEnvironmentVariables() {
    console.log('📋 4. 檢查環境變數設定...\n');

    const required = [
        { key: 'VITE_SUPABASE_URL', value: supabaseUrl },
        { key: 'VITE_SUPABASE_ANON_KEY', value: process.env.VITE_SUPABASE_ANON_KEY }
    ];

    const optional = [
        { key: 'GITHUB_TOKEN', value: process.env.GITHUB_TOKEN },
        { key: 'SUPABASE_SERVICE_ROLE_KEY', value: process.env.SUPABASE_SERVICE_ROLE_KEY }
    ];

    console.log('   必填項目:');
    required.forEach(({ key, value }) => {
        if (value) {
            console.log(`   ✅ ${key}: 已設定`);
        } else {
            console.log(`   ❌ ${key}: 未設定`);
            warnings.push({
                type: 'ENV',
                key,
                severity: 'high',
                message: '缺少必要的環境變數'
            });
        }
    });

    console.log('\n   選填項目:');
    optional.forEach(({ key, value }) => {
        if (value) {
            console.log(`   ✅ ${key}: 已設定`);
        } else {
            console.log(`   ⚪ ${key}: 未設定（可選）`);
        }
    });

    console.log('');
}

/**
 * 主函式
 */
async function main() {
    console.log('🚀 開始檢查 Supabase 安全設定...\n');
    console.log('='.repeat(60) + '\n');

    try {
        await checkRLS();
        await checkRLSPolicies();
        await checkServiceRoleKey();
        checkEnvironmentVariables();

        // 總結
        console.log('='.repeat(60));
        console.log('\n📊 檢查結果總結\n');

        if (warnings.length === 0) {
            console.log('✅ 未發現明顯的安全問題！\n');
            console.log('💡 建議：');
            console.log('   1. 定期檢查 Supabase Dashboard 中的 Security 警告');
            console.log('   2. 確認所有表都已啟用 RLS');
            console.log('   3. 審查 RLS 政策是否適當\n');
        } else {
            console.log(`⚠️  發現 ${warnings.length} 個警告:\n`);

            const highSeverity = warnings.filter(w => w.severity === 'high');
            const mediumSeverity = warnings.filter(w => w.severity === 'medium');

            if (highSeverity.length > 0) {
                console.log('🔴 高優先級:');
                highSeverity.forEach(w => {
                    console.log(`   - ${w.message}${w.table ? ` (表: ${w.table})` : ''}${w.key ? ` (變數: ${w.key})` : ''}`);
                });
                console.log('');
            }

            if (mediumSeverity.length > 0) {
                console.log('🟡 中優先級:');
                mediumSeverity.forEach(w => {
                    console.log(`   - ${w.message}${w.table ? ` (表: ${w.table})` : ''}`);
                });
                console.log('');
            }

            console.log('💡 處理建議：');
            console.log('   1. 檢視 docs/SUPABASE_WARNINGS_GUIDE.md 了解詳細處理方式');
            console.log('   2. 在 Supabase Dashboard 中檢查 Security 警告');
            console.log('   3. 確認所有表都已啟用 RLS 並設定適當政策\n');
        }

        console.log('='.repeat(60));

    } catch (error) {
        console.error('\n❌ 發生未預期的錯誤:', error);
        console.error(error.stack);
        process.exit(1);
    }
}

// 執行主函式
main();
