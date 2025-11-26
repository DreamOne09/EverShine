// 會員資料載入腳本
// 從 data/members-data.json 讀取會員資料並動態生成會員卡片

document.addEventListener('DOMContentLoaded', async function () {
    try {
        // 載入會員資料
        const response = await fetch('data/members-data.json');
        const data = await response.json();
        const members = data.members;

        // 獲取會員容器
        const memberGrid = document.querySelector('.members-grid');
        if (!memberGrid) {
            console.error('找不到會員容器');
            return;
        }

        // 清空現有內容
        memberGrid.innerHTML = '';

        // 為每位會員生成卡片
        members.forEach(member => {
            const memberCard = createMemberCard(member);
            memberGrid.appendChild(memberCard);
        });

        console.log(`✅ 成功載入 ${members.length} 位會員資料`);
    } catch (error) {
        console.error('載入會員資料失敗:', error);
    }
});

// 創建會員卡片
function createMemberCard(member) {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.dataset.category = member.category;
    card.dataset.industry = member.industry;

    card.innerHTML = `
        <div class="member-header">
            <div class="member-photo-container">
                <img src="${member.photo}" 
                     alt="${member.name}" 
                     class="member-photo"
                     loading="lazy"
                     onerror="this.style.display='none';">
            </div>
            <div class="member-basic-info">
                <h3 class="member-name">${member.name}</h3>
                <p class="member-title">${member.title}</p>
                <p class="member-industry">${member.industry}</p>
                <p class="member-category">${member.category}</p>
            </div>
        </div>
        <div class="member-body">
            <p class="member-short-intro">${member.shortIntro}</p>
            ${member.links && member.links.length > 0 ? `
                <div class="member-links">
                    ${member.links.map(link => `
                        <a href="${link.url}" target="_blank" rel="noopener noreferrer" 
                           class="member-link" title="${getLinkLabel(link.type)}">
                            <i class="icon-${link.icon}"></i>
                        </a>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;

    return card;
}

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
