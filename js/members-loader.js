// 會員資料載入腳本 - 簡化版本
console.log('會員載入腳本開始執行');

document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOM 已載入，開始載入會員資料');

    try {
        // 載入會員資料
        const response = await fetch('data/members-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const members = data.members;

        console.log(`成功獲取 ${members.length} 位會員資料`);

        // 獲取會員容器
        const memberGrid = document.getElementById('membersGrid');
        if (!memberGrid) {
            console.error('找不到會員容器 #membersGrid');
            return;
        }

        console.log('找到會員容器，開始生成卡片');

        // 清空現有內容
        memberGrid.innerHTML = '';

        // 為每位會員生成卡片
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            try {
                const card = document.createElement('div');
                card.className = 'member-card';
                if (member.category) card.dataset.category = member.category;
                if (member.industry) card.dataset.industry = member.industry;

                // 使用 innerHTML 一次性設置內容
                const linksHTML = (member.links && member.links.length > 0)
                    ? `<div class="member-links">
                        ${member.links.map(link =>
                        `<a href="${link.url || '#'}" target="_blank" rel="noopener noreferrer" class="member-link" title="${getLinkLabel(link.type)}">
                                <i class="icon-${link.icon || link.type}"></i>
                            </a>`
                    ).join('')}
                    </div>`
                    : '';

                card.innerHTML = `
                    <div class="member-header">
                        <div class="member-photo-container">
                            <img src="${member.photo || 'images/members/default.jpg'}" 
                                 alt="${member.name || '會員'}" 
                                 class="member-photo"
                                 loading="lazy"
                                 onerror="this.style.display='none';">
                        </div>
                        <div class="member-basic-info">
                            <h3 class="member-name">${member.name || '未提供姓名'}</h3>
                            <p class="member-title">${member.title || ''}</p>
                            <p class="member-industry">${member.industry || ''}</p>
                            <p class="member-category">${member.category || ''}</p>
                        </div>
                    </div>
                    <div class="member-body">
                        <p class="member-short-intro">${member.shortIntro || ''}</p>
                        ${linksHTML}
                    </div>
                `;

                memberGrid.appendChild(card);
                successCount++;
            } catch (err) {
                failCount++;
                console.error(`創建會員卡片失敗 [${i}] (${member.name}):`, err);
            }
        }

        console.log(`✅ 成功載入 ${successCount} 位會員，失敗 ${failCount} 位`);

    } catch (error) {
        console.error('載入會員資料失敗:', error);
    }
});

// 獲取連結標籤
function getLinkLabel(type) {
    const labels = {
        website: '官方網站',
        facebook: 'Facebook',
        instagram: 'Instagram',
        linkedin: 'LinkedIn',
        line: 'LINE',
        youtube: 'YouTube'
    };
    return labels[type] || type;
}

console.log('會員載入腳本已載入');
