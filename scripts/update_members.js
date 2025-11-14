const fs = require('fs');
const path = require('path');

// 讀取會員資料
const membersPath = path.join(__dirname, '..', 'data', 'members.json');
const membersData = JSON.parse(fs.readFileSync(membersPath, 'utf8'));

// 更新每個會員
membersData.members.forEach(member => {
    // 1. 移除 "#專業引薦" hashtag
    member.hashtags = member.hashtags.filter(tag => tag !== '#專業引薦');
    
    // 2. 移除第二個hashtag（重複的專業服務標籤）
    if (member.hashtags.length >= 2) {
        const filteredTags = [member.hashtags[0]]; // 保留第一個
        if (member.hashtags.length > 2) {
            filteredTags.push(...member.hashtags.slice(2)); // 跳過第二個，保留其餘
        }
        member.hashtags = filteredTags;
    }
    
    // 3. 簡介已經在generate_member_content.py中處理，這裡不需要再處理
    // 因為fullDescription已經存在
});

// 寫回檔案
fs.writeFileSync(membersPath, JSON.stringify(membersData, null, 2), 'utf8');

console.log(`已更新 ${membersData.members.length} 位會員的資料`);
console.log('- 已移除所有 "#專業引薦" hashtag');
console.log('- 已移除每個會員的第二個hashtag');

