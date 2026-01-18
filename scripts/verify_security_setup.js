import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔒 EverShine 資安設定驗證工具\n');
console.log('='.repeat(60));

const checks = [];
const warnings = [];

/**
 * 檢查檔案是否存在
 */
function fileExists(filePath) {
    return fs.existsSync(path.join(__dirname, '..', filePath));
}

/**
 * 檢查檔案內容是否包含特定字串
 */
function fileContains(filePath, patterns, shouldContain = false) {
    const fullPath = path.join(__dirname, '..', filePath);
    if (!fs.existsSync(fullPath)) return false;

    const content = fs.readFileSync(fullPath, 'utf8');
    const results = patterns.map(pattern => {
        const found = content.includes(pattern);
        return shouldContain ? found : !found;
    });
    return results.every(r => r === true);
}

/**
 * 檢查 1: .env 檔案
 */
console.log('\n📋 1. 檢查環境變數檔案...');
if (fileExists('.env')) {
    checks.push({ name: '.env 檔案存在', status: '✅' });
} else {
    warnings.push({ name: '.env 檔案不存在', message: '請建立 .env 檔案，參考 ENV_SETUP.md' });
    checks.push({ name: '.env 檔案存在', status: '⚠️' });
}

// 檢查 .gitignore
if (fileContains('.gitignore', ['.env', '.env.*'])) {
    checks.push({ name: '.env 在 .gitignore 中', status: '✅' });
} else {
    warnings.push({ name: '.env 不在 .gitignore', message: '請確認 .env 已加入 .gitignore' });
    checks.push({ name: '.env 在 .gitignore 中', status: '⚠️' });
}

/**
 * 檢查 2: GitHub Token 安全
 */
console.log('\n📋 2. 檢查 GitHub Token 安全...');

// 檢查 js/github-config.js 是否有硬編碼 Token
const githubConfigPath = 'js/github-config.js';
if (fileExists(githubConfigPath)) {
    // 檢查是否嘗試從環境變數讀取
    if (fileContains(githubConfigPath, ['process.env.GITHUB_TOKEN'], true)) {
        checks.push({ name: 'GitHub Token 從環境變數讀取', status: '✅' });
    } else {
        warnings.push({ name: 'GitHub Token 可能硬編碼', message: '建議檢查 js/github-config.js' });
        checks.push({ name: 'GitHub Token 從環境變數讀取', status: '⚠️' });
    }
}

/**
 * 檢查 3: 安全文件
 */
console.log('\n📋 3. 檢查安全文件...');

const securityFiles = [
    'SECURITY_CHECKLIST.md',
    'ENV_SETUP.md',
    'docs/SUPABASE_SECURITY_FIX_GUIDE.md'
];

securityFiles.forEach(file => {
    if (fileExists(file)) {
        checks.push({ name: `${file} 存在`, status: '✅' });
    } else {
        warnings.push({ name: `${file} 不存在`, message: '安全文件缺失' });
        checks.push({ name: `${file} 存在`, status: '⚠️' });
    }
});

/**
 * 檢查 4: 前端安全
 */
console.log('\n📋 4. 檢查前端安全...');

// 檢查是否有 dangerouslySetInnerHTML（危險）
const srcFiles = [];
function findSrcFiles(dir) {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) return;

    const files = fs.readdirSync(fullPath);
    files.forEach(file => {
        const filePath = path.join(fullPath, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory() && !['node_modules', '.git', 'dist'].includes(file)) {
            findSrcFiles(path.join(dir, file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            srcFiles.push(path.join(dir, file));
        }
    });
}

findSrcFiles('src');

let foundDangerousHTML = false;
srcFiles.forEach(file => {
    const content = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    if (content.includes('dangerouslySetInnerHTML')) {
        foundDangerousHTML = true;
        warnings.push({ name: `發現 dangerouslySetInnerHTML`, message: `檔案: ${file}` });
    }
});

if (!foundDangerousHTML) {
    checks.push({ name: '未使用 dangerouslySetInnerHTML', status: '✅' });
} else {
    checks.push({ name: '未使用 dangerouslySetInnerHTML', status: '⚠️' });
}

/**
 * 總結
 */
console.log('\n' + '='.repeat(60));
console.log('\n📊 檢查結果總結\n');

const passed = checks.filter(c => c.status === '✅').length;
const total = checks.length;

checks.forEach(check => {
    console.log(`${check.status} ${check.name}`);
});

console.log(`\n✅ 通過: ${passed}/${total}`);

if (warnings.length > 0) {
    console.log(`\n⚠️  警告 (${warnings.length} 個):\n`);
    warnings.forEach(w => {
        console.log(`   - ${w.name}`);
        if (w.message) {
            console.log(`     建議: ${w.message}`);
        }
    });
} else {
    console.log('\n✅ 未發現警告！');
}

console.log('\n' + '='.repeat(60));
console.log('\n💡 提示:');
console.log('   - 詳細檢查清單請參考 SECURITY_CHECKLIST.md');
console.log('   - 環境變數設定請參考 ENV_SETUP.md');
console.log('   - Supabase RLS 檢查請使用 scripts/check_supabase_warnings.js\n');
