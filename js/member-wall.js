/**
 * 雙向無限滾動會員牆
 * 載入更新過的會員並建立雙向滾動動畫
 */

document.addEventListener('DOMContentLoaded', async () => {
    const wallContainer = document.getElementById('memberWallContainer');
    if (!wallContainer) return;

    try {
        // 從 API 獲取更新過的會員（已經是加倍的陣列）
        const response = await fetch('/api/updated-members');
        if (!response.ok) throw new Error('Failed to fetch members');

        const data = await response.json();
        const members = data.members;

        if (!members || members.length === 0) {
            wallContainer.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6);">目前沒有會員更新資料</p>';
            return;
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
    const photoUrl = member.photo || 'images/members/default.jpg';
    const updateBadge = member.updateCount > 1 ? `已更新 ${member.updateCount} 次` : '最近更新';

    return `
        <div class="wall-member-card">
            <img src="${photoUrl}" 
                 alt="${member.name}" 
                 class="wall-member-photo"
                 loading="lazy"
                 onerror="this.src='images/members/default.jpg'">
            <h3 class="wall-member-name">${member.name}</h3>
            <p class="wall-member-title">${member.position || member.title || ''}</p>
            <span class="wall-member-badge">${updateBadge}</span>
        </div>
    `;
}
