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

    // Icon mapping for social links
    const iconMap = {
        'website': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
        'facebook': '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
        'instagram': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
        'linkedin': '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
        'line': '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>',
        'youtube': '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
        'email': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'
    };

    container.innerHTML = members.map(member => {
        const photoUrl = member.photo || 'images/members/default.jpg';

        // 處理連結 - 使用 SVG icons
        const linksHtml = member.links && member.links.length > 0
            ? `<div class="member-links">
                ${member.links.map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="member-link" title="${link.type}">
                        ${iconMap[link.type] || iconMap['website']}
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
                        <p class="member-industry">${member.industry}</p>
                        <p class="member-position">${member.position || member.title || '專業顧問'}</p>
                        ${linksHtml}
                    </div>
                </div>
                <div class="member-body">
                    <div class="member-intro-section">
                        <p class="member-short-intro">${member.shortIntro || ''}</p>
                        <div class="member-full-intro hidden">
                            <p>${member.fullIntro || ''}</p>
                            <div class="member-full-services">
                                <h4>服務項目：</h4>
                                <ul>
                                    ${member.services ? member.services.map(s => `<li>${s}</li>`).join('') : ''}
                                </ul>
                            </div>
                        </div>
                        <button class="read-more-btn" onclick="toggleMemberInfo(this)">查看更多</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 新增切換函數，隱藏簡短介紹當展開時
function toggleMemberInfo(button) {
    const introSection = button.parentElement;
    const shortIntro = introSection.querySelector('.member-short-intro');
    const fullIntro = introSection.querySelector('.member-full-intro');

    fullIntro.classList.toggle('hidden');

    if (fullIntro.classList.contains('hidden')) {
        button.textContent = '查看更多';
        shortIntro.style.display = 'block';
    } else {
        button.textContent = '收起內容';
        shortIntro.style.display = 'none';
    }
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
