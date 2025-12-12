#!/usr/bin/env node
/**
 * EverShine 檔案引用完整檢查腳本
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const results = {
    passed: [],
    failed: [],
    warnings: []
};

function check(id, description, condition, severity = 'error') {
    const result = { id, description, passed: condition };

    if (condition) {
        results.passed.push(result);
        console.log(`✅ [${id}] ${description}`);
    } else {
        if (severity === 'warning') {
            results.warnings.push(result);
            console.log(`⚠️  [${id}] ${description}`);
        } else {
            results.failed.push(result);
            console.log(`❌ [${id}] ${description}`);
        }
    }
}

function fileExists(filePath) {
    return fs.existsSync(path.join(rootDir, filePath));
}

function fileContains(filePath, searchString) {
    if (!fileExists(filePath)) return false;
    const content = fs.readFileSync(path.join(rootDir, filePath), 'utf-8');
    return content.includes(searchString);
}

console.log('🔍 開始全面檢查檔案引用...\n');

// ===== dist 資料夾檢查 =====
console.log('\n📦 dist 資料夾檢查\n' + '='.repeat(50));

check('D001', 'dist/index.html 存在', fileExists('dist/index.html'));
check('D002', 'dist/index.html 包含 root div', fileContains('dist/index.html', '<div id="root">'));
check('D003', 'dist/index.html 引用 CSS', fileContains('dist/index.html', '.css'));
check('D004', 'dist/index.html 引用 JS', fileContains('dist/index.html', '.js'));
check('D005', 'dist/assets 資料夾存在', fileExists('dist/assets'));

// ===== public 資料夾檢查 =====
console.log('\n🖼️  public 資料夾檢查\n' + '='.repeat(50));

check('P001', 'public/images 存在', fileExists('public/images'));
check('P002', 'public/images/assets 存在', fileExists('public/images/assets'));
check('P003', 'public/images/members 存在', fileExists('public/images/members'));
check('P004', 'public/data 存在', fileExists('public/data'));
check('P005', 'public/data/members.json 存在', fileExists('public/data/members.json'));
check('P006', 'public/data/referrals.json 存在', fileExists('public/data/referrals.json'));
check('P007', 'background.png 存在', fileExists('public/images/assets/background.png'));
check('P008', 'BNI logo 存在', fileExists('public/images/assets/logo/BNI紅色商標.png'));
check('P009', 'EverShine logo 存在', fileExists('public/images/assets/logo/白色正方形logo.png'));

// ===== src 檔案引用檢查 =====
console.log('\n📝 src 檔案引用檢查\n' + '='.repeat(50));

check('S001', 'main.tsx 存在', fileExists('src/main.tsx'));
check('S002', 'App.tsx 存在', fileExists('src/App.tsx'));
check('S003', 'main.tsx 引用 App', fileContains('src/main.tsx', 'App'));
check('S004', 'main.tsx 引用 index.css', fileContains('src/main.tsx', 'index.css'));
check('S005', 'App.tsx 引用 BrowserRouter', fileContains('src/App.tsx', 'BrowserRouter'));

// ===== 組件引用檢查 =====
console.log('\n🧩 組件引用檢查\n' + '='.repeat(50));

check('C001', 'Home.tsx 引用 About', fileContains('src/pages/Home.tsx', 'About'));
check('C002', 'Home.tsx 引用 Results', fileContains('src/pages/Home.tsx', 'Results'));
check('C003', 'Home.tsx 引用 MemberWall', fileContains('src/pages/Home.tsx', 'MemberWall'));
check('C004', 'Home.tsx 引用 FAQ', fileContains('src/pages/Home.tsx', 'FAQ'));
check('C005', 'Home.tsx 引用 Contact', fileContains('src/pages/Home.tsx', 'Contact'));
check('C006', 'Members.tsx 引用 MemberCard', fileContains('src/pages/Members.tsx', 'MemberCard'));
check('C007', 'Members.tsx 引用 CategoryFilter', fileContains('src/pages/Members.tsx', 'CategoryFilter'));
check('C008', 'Layout.tsx 引用 Navbar', fileContains('src/components/layout/Layout.tsx', 'Navbar'));
check('C009', 'Layout.tsx 引用 Footer', fileContains('src/components/layout/Layout.tsx', 'Footer'));
check('C010', 'Layout.tsx 引用 StarryBackground', fileContains('src/components/layout/Layout.tsx', 'StarryBackground'));

// ===== 圖片路徑檢查 =====
console.log('\n🖼️  圖片路徑引用檢查\n' + '='.repeat(50));

check('I001', 'Home.tsx 引用 background.png', fileContains('src/pages/Home.tsx', 'background.png'));
check('I002', 'Home.tsx 引用 BNI logo', fileContains('src/pages/Home.tsx', 'BNI紅色商標.png'));
check('I003', 'BNI.tsx 引用 BNI logo', fileContains('src/pages/BNI.tsx', 'BNI紅色商標.png'));
check('I004', 'Footer.tsx 引用 logo', fileContains('src/components/layout/Footer.tsx', 'logo.png'));
check('I005', 'Navbar.tsx 引用 logo', fileContains('src/components/layout/Navbar.tsx', 'logo.png'));

// ===== Hooks 引用檢查 =====
console.log('\n🪝 Hooks 引用檢查\n' + '='.repeat(50));

check('H001', 'Members.tsx 引用 useMembers', fileContains('src/pages/Members.tsx', 'useMembers'));
check('H002', 'Referrals.tsx 引用 useReferrals', fileContains('src/pages/Referrals.tsx', 'useReferrals'));
check('H003', 'Results.tsx 引用 useCountUp', fileContains('src/components/home/Results.tsx', 'useCountUp'));
check('H004', 'useMembers 引用 members.json', fileContains('src/hooks/useMembers.ts', 'members.json') || fileContains('src/hooks/useMembers.tsx', 'members.json'));

// ===== 部署檔案檢查 =====
console.log('\n🚀 部署檔案檢查\n' + '='.repeat(50));

check('DEP001', 'Dockerfile 存在', fileExists('Dockerfile'));
check('DEP002', 'server.js 存在', fileExists('server.js'));
check('DEP003', 'package.json 存在', fileExists('package.json'));
check('DEP004', 'Dockerfile 複製 dist', fileContains('Dockerfile', 'COPY dist'));
check('DEP005', 'Dockerfile 複製 public', fileContains('Dockerfile', 'COPY public'));
check('DEP006', 'Dockerfile 複製 server.js', fileContains('Dockerfile', 'COPY server.js'));
check('DEP007', 'server.js 處理 /images/', fileContains('server.js', '/images/'));
check('DEP008', 'server.js 處理 /data/', fileContains('server.js', '/data/'));

// ===== 配置檔案檢查 =====
console.log('\n⚙️  配置檔案檢查\n' + '='.repeat(50));

check('CFG001', 'vite.config.ts 存在', fileExists('vite.config.ts'));
check('CFG002', 'tsconfig.json 存在', fileExists('tsconfig.json'));
check('CFG003', 'tailwind.config.js 存在', fileExists('tailwind.config.js'));
check('CFG004', 'package.json 有 build script', fileContains('package.json', '"build"'));
check('CFG005', 'package.json 有 start script', fileContains('package.json', '"start"'));

// ===== 總結 =====
console.log('\n' + '='.repeat(50));
console.log('📊 檢查結果總結\n');
console.log(`✅ 通過: ${results.passed.length}`);
console.log(`❌ 失敗: ${results.failed.length}`);
console.log(`⚠️  警告: ${results.warnings.length}`);

const total = results.passed.length + results.failed.length + results.warnings.length;
const passRate = (results.passed.length / total * 100).toFixed(1);
console.log(`\n通過率: ${passRate}%`);

if (results.failed.length > 0) {
    console.log('\n❌ 需要修復的項目:');
    results.failed.forEach((item, index) => {
        console.log(`${index + 1}. [${item.id}] ${item.description}`);
    });
}

if (results.warnings.length > 0) {
    console.log('\n⚠️  警告項目:');
    results.warnings.forEach((item, index) => {
        console.log(`${index + 1}. [${item.id}] ${item.description}`);
    });
}

// 寫入檢查報告
const reportPath = path.join(rootDir, '.agent', 'file-reference-check.json');
fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
        total,
        passed: results.passed.length,
        failed: results.failed.length,
        warnings: results.warnings.length,
        passRate: passRate + '%'
    },
    results: {
        passed: results.passed,
        failed: results.failed,
        warnings: results.warnings
    }
}, null, 2));

console.log(`\n📄 詳細報告已儲存至: ${reportPath}`);

// 退出碼
process.exit(results.failed.length > 0 ? 1 : 0);
