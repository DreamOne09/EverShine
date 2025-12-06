import { createMemberCard } from './member-card-component.js';
import { CONFIG } from './config.js';

/**
 * 會員名單渲染腳本 (模組化版)
 * 負責讀取 data/members.json 並渲染會員卡片與篩選器
 */

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Members Renderer: Initializing...');

    const membersGrid = document.getElementById(CONFIG.SELECTORS.MEMBERS_GRID);
    const filterButtonsContainer = document.getElementById(CONFIG.SELECTORS.FILTER_BUTTONS);

    if (!membersGrid || !filterButtonsContainer) {
        console.error('Members Renderer: Required containers not found.');
        return;
    }

    try {
        // 1. 載入數據
        const response = await fetch(CONFIG.API.MEMBERS);
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

        // 6. 初始化展開/收起功能 (事件委派)
        initMemberToggles();

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

    container.innerHTML = members.map(createMemberCard).join('');
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
            // 添加淡出動畫效果
            container.style.opacity = '0';
            setTimeout(() => {
                renderMembers(filteredMembers, container);
                container.style.opacity = '1';
            }, 200);
        });
    });
}

function initMemberToggles() {
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.member-toggle-btn');
        if (!btn) return;

        e.stopPropagation();
        const targetId = btn.dataset.target;
        const details = document.getElementById(`${targetId}-details`);
        const card = btn.closest('.member-card');

        if (details && card) {
            const isExpanded = details.classList.toggle('expanded');
            btn.classList.toggle('expanded', isExpanded);
            btn.querySelector('.toggle-icon').textContent = isExpanded ? '▲' : '▼';

            card.classList.toggle('collapsed', !isExpanded);
            card.classList.toggle('expanded-full', isExpanded);

            const shortDesc = card.querySelector('.member-short-description');
            if (shortDesc) shortDesc.style.display = isExpanded ? 'none' : 'block';
        }
    });
}
