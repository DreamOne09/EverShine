/**
 * 為所有會員生成 PIN 碼雜湊值
 * 預設 PIN 碼：追求夢想得第一
 */

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// 預設 PIN 碼
const DEFAULT_PIN = '追求夢想得第一';

// 生成 SHA-256 雜湊值
function generatePinHash(pin) {
    return crypto.createHash('sha256').update(pin).digest('hex');
}

// 讀取會員資料
const membersPath = path.join(__dirname, '../data/members.json');
const membersData = JSON.parse(fs.readFileSync(membersPath, 'utf8'));

// 為每個會員新增 pinHash
let updatedCount = 0;
membersData.members.forEach(member => {
    if (!member.pinHash) {
        member.pinHash = generatePinHash(DEFAULT_PIN);
        updatedCount++;
        console.log(`✓ 已為 ${member.name} 生成 PIN 碼雜湊值`);
    } else {
        console.log(`- ${member.name} 已有 PIN 碼雜湊值，跳過`);
    }
});

// 儲存更新後的資料
fs.writeFileSync(membersPath, JSON.stringify(membersData, null, 2), 'utf8');

console.log(`\n完成！共更新 ${updatedCount} 位會員的 PIN 碼。`);
console.log(`預設 PIN 碼：${DEFAULT_PIN}`);
console.log(`PIN 碼雜湊值：${generatePinHash(DEFAULT_PIN)}`);
