import { CONFIG } from './config.js';
import { normalizePhotoPath } from './utils.js';

/**
 * 雙向無限滾動會員牆
 * 載入會員並建立雙向滾動動畫
 */

document.addEventListener('DOMContentLoaded', async () => {
    const wallContainer = document.getElementById('memberWallContainer');
    if (!wallContainer) return;

    try {
        // 使用 CONFIG 中的路徑讀取靜態 JSON
        const response = await fetch(CONFIG.API.MEMBERS);
        if (!response.ok) throw new Error('Failed to fetch members');

        const data = await response.json();
        let members = data.members;

        if (!members || members.length === 0) {
            wallContainer.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6);">目前沒有會員資料</p>';
            return;
        }

        // 為了無限滾動效果，我們需要足夠的會員數量
        // 如果會員太少，複製幾份
        if (members.length < 20) {
            members = [...members, ...members, ...members];
        }

        // 分成兩排
        const half = Math.ceil(members.length / 2);
        const row1Members = members.slice(0, half);
        const row2Members = members.slice(half);

        // 渲染第一排（向左滾動）
        const row1 = document.createElement('div');
        row1.className = 'scroll-row scroll-left';
        row1.innerHTML = row1Members.map(renderMemberCard).join('');

        // 渲染第二排（向右滾動）
        const row2 = document.createElement('div');
        row2.className = 'scroll-row scroll-right';
        row2.innerHTML = row2Members.map(renderMemberCard).join('');

        wallContainer.appendChild(row1);
        wallContainer.appendChild(row2);

    } catch (error) {
        console.error('載入會員牆失敗:', error);
        wallContainer.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6);">載入失敗，請稍後再試</p>';
    }
});

function renderMemberCard(member) {
    const photoUrl = normalizePhotoPath(member.photo) || CONFIG.PATHS.DEFAULT_MEMBER_PHOTO;
    const company = member.company || '';
    const position = member.position || member.title || '';
    const industry = member.industry || '';

    return `
        <div class="wall-member-card">
            <img src="${photoUrl}" 
                 alt="${member.name}" 
                 class="wall-member-photo"
                 loading="lazy"
                 width="80"
                 height="80"
                 onerror="this.src='${CONFIG.PATHS.DEFAULT_MEMBER_PHOTO}'; this.onerror=null;">
            <h3 class="wall-member-name">${member.name}</h3>
            <p class="wall-member-industry">${industry}</p>
            <p class="wall-member-company">${company}</p>
            <p class="wall-member-title">${position}</p>
        </div>
    `;
}
