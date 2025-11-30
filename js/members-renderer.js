/**
 * 會員名單渲染腳本 (重構版)
 * 負責讀取 data/members-data.json 並渲染會員卡片與篩選器
 */

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Members Renderer: Initializing...');

    const membersGrid = document.getElementById('membersGrid');
    const filterButtonsContainer = document.getElementById('filterButtons');

    if (!membersGrid || !filterButtonsContainer) {
        console.error('Members Renderer: Required containers not found.');
        return;
    }

    try {
        // 1. 載入數據
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const members = data.members;

        console.log(`Members Renderer: Loaded ${members.length} members.`);

        // 2. 提取分類
        const categories = ['全部顯示', ...new Set(members.map(m => m.category).filter(Boolean))];

        // 3. 渲染篩選按鈕
        renderFilterButtons(categories, filterButtonsContainer);

        // 4. 渲染所有會員
        renderMembers(members, membersGrid);

        // 5. 綁定篩選事件
        setupFilterEvents(members, membersGrid);

    } catch (error) {
        console.error('Members Renderer: Error loading members data:', error);
        membersGrid.innerHTML = '<p class="error-message">載入會員資料失敗，請稍後再試。</p>';
    }
});

function renderFilterButtons(categories, container) {
    container.innerHTML = categories.map(category => {
        const isActive = category === '全部顯示' ? 'active' : '';
        const dataCategory = category === '全部顯示' ? 'all' : category;
        return `<button class="filter-btn ${isActive}" data-category="${dataCategory}">${category}</button>`;
    }).join('');
}

function renderMembers(members, container) {
    if (members.length === 0) {
        container.innerHTML = '<p class="no-results">沒有找到符合條件的會員。</p>';
        return;
    }

    container.innerHTML = members.map(member => {
        // 處理圖片路徑，確保有預設值
        const photoUrl = member.photo || 'images/members/default.jpg';

        // 處理連結
        const linksHtml = member.links && member.links.length > 0
            ? `<div class="member-links">
                ${member.links.map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="member-link" title="${link.type}">
                        <i class="icon-${link.type}"></i>
                    </a>
                `).join('')}
               </div>`
            : '';

        return `
            <div class="member-card" data-category="${member.category || ''}">
                <div class="member-header">
                    <div class="member-photo-container">
                        <img src="${photoUrl}" 
                             alt="${member.name}" 
                             class="member-photo" 
                             loading="lazy"
                             onerror="this.src='images/members/default.jpg'; this.onerror=null;">
                    </div>
                    <div class="member-basic-info">
                        <h3 class="member-name">${member.name}</h3>
                        <p class="member-title">${member.title || member.industry}</p>
                        <p class="member-industry">${member.industry}</p>
                        <span class="member-category-tag">${member.category}</span>
                    </div>
                </div>
                <div class="member-body">
                    <p class="member-short-intro">${member.shortIntro || ''}</p>
                    ${linksHtml}
                </div>
            </div>
        `;
    }).join('');
}

function setupFilterEvents(allMembers, container) {
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新按鈕狀態
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;

            // 篩選會員
            const filteredMembers = category === 'all'
                ? allMembers
                : allMembers.filter(m => m.category === category);

            // 重新渲染
            // 添加淡出動畫效果 (可選)
            container.style.opacity = '0';
            setTimeout(() => {
                renderMembers(filteredMembers, container);
                container.style.opacity = '1';
            }, 200);
        });
    });
}
