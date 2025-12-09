import { CONFIG } from './config.js';

/**
 * 引薦案例渲染腳本
 * 負責讀取 data/referrals.json 並渲染引薦卡片
 */

document.addEventListener('DOMContentLoaded', () => {
    const referralsGrid = document.getElementById(CONFIG.SELECTORS.REFERRALS_GRID);
    if (referralsGrid) {
        loadReferralsData();
        initReferralCardToggles();
    }
});

async function loadReferralsData() {
    try {
        const response = await fetch(CONFIG.API.REFERRALS);
        if (!response.ok) throw new Error('無法載入引薦資料');

        const data = await response.json();
        if (!data?.referrals) throw new Error('資料格式錯誤');

        displayReferrals(data.referrals);
    } catch (error) {
        const grid = document.getElementById(CONFIG.SELECTORS.REFERRALS_GRID);
        if (grid) {
            grid.innerHTML = `<div class="error-message">載入失敗: ${error.message}</div>`;
        }
    }
}

function displayReferrals(referrals) {
    const grid = document.getElementById(CONFIG.SELECTORS.REFERRALS_GRID);
    if (!grid) return;

    if (referrals.length === 0) {
        grid.innerHTML = '<p class="no-data">目前沒有引薦案例。</p>';
        return;
    }

    grid.innerHTML = referrals.map(createReferralCard).join('');
}

function createReferralCard(ref) {
    return `
        <div class="referral-card" id="${ref.id}">
            <div class="referral-header">
                <div class="referral-header-top">
                    <h3 class="referral-title">${ref.title}</h3>
                </div>
                <div class="referral-preview-photos-header">
                    <div class="referral-preview-photo-item">
                        <div class="photo-wrapper">
                            <img src="${ref.referrer.photo}" alt="引薦人：${ref.referrer.name}" class="referral-preview-photo-header" loading="lazy" onerror="this.style.display='none';">
                        </div>
                        <div class="referral-preview-photo-info">
                            <div class="referral-preview-photo-label-header">引薦人</div>
                            <div class="referral-preview-photo-name">${ref.referrer.name}</div>
                            <div class="referral-preview-photo-industry">${ref.referrer.industry}</div>
                        </div>
                    </div>
                    <div class="referral-arrow">➜</div>
                    <div class="referral-preview-photo-item">
                        <div class="photo-wrapper">
                            <img src="${ref.referee.photo}" alt="被引薦人：${ref.referee.name}" class="referral-preview-photo-header" loading="lazy" onerror="this.style.display='none';">
                        </div>
                        <div class="referral-preview-photo-info">
                            <div class="referral-preview-photo-label-header">被引薦人</div>
                            <div class="referral-preview-photo-name">${ref.referee.name}</div>
                            <div class="referral-preview-photo-industry">${ref.referee.industry}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="referral-preview">
                <p>${ref.description}</p>
                <button class="read-more-btn-referral">查看完整故事</button>
            </div>

            <div class="referral-content">
                <!-- 引薦人說明 -->
                <div class="referral-section">
                    <div class="section-header">
                        <div class="referral-photo-wrapper">
                            <img src="${ref.referrer.photo}" alt="${ref.referrer.name}" class="referral-photo" loading="lazy" onerror="this.style.display='none';">
                        </div>
                        <div class="section-header-text">
                            <div class="section-icon">👤</div>
                            <h4>引薦人說明：<span class="referrer-name">${ref.referrer.name}</span></h4>
                        </div>
                    </div>
                    <div class="section-content">
                        ${ref.referrer.story.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('')}
                        ${ref.referrer.testimonial ? `<div class="testimonial-tag"><strong>客戶見證：</strong>${ref.referrer.testimonial}</div>` : ''}
                    </div>
                </div>

                <!-- 被引薦人說明 (若無內容則不顯示) -->
                ${ref.referee.story && ref.referee.story.trim() ? `
                <div class="referral-section">
                    <div class="section-header">
                        <div class="referral-photo-wrapper">
                            <img src="${ref.referee.photo}" alt="${ref.referee.name}" class="referral-photo" loading="lazy" onerror="this.style.display='none';">
                        </div>
                        <div class="section-header-text">
                            <div class="section-icon">🎯</div>
                            <h4>被引薦人說明：<span class="referrer-name">${ref.referee.name}</span></h4>
                        </div>
                    </div>
                    <div class="section-content">
                        ${ref.referee.story.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('')}
                        ${ref.referee.value ? `<div class="testimonial-tag"><strong>BNI 系統價值：</strong>${ref.referee.value}</div>` : ''}
                    </div>
                </div>
                ` : ''}
            </div>

            <div class="referral-footer">
                <div class="referral-metrics">
                    <span class="metric-item"><strong>金額：</strong>${ref.metrics.amount}</span>
                    <span class="metric-item"><strong>類型：</strong>${ref.metrics.type}</span>
                </div>
            </div>
        </div>
    `;
}

function initReferralCardToggles() {
    document.body.addEventListener('click', (e) => {
        // Check if the click is on the new button or the card itself (for backward compatibility/UX)
        const btn = e.target.closest('.read-more-btn-referral');
        const card = e.target.closest('.referral-card');

        if (!card) return;

        // If clicking a link inside (other than our button), ignore
        if (e.target.tagName === 'A') return;

        // Toggle expansion
        const isExpanded = card.classList.toggle('expanded');

        // Update button text if the button was clicked or exists
        const toggleBtn = card.querySelector('.read-more-btn-referral');
        if (toggleBtn) {
            toggleBtn.textContent = isExpanded ? '收起故事' : '查看完整故事';
        }

        // Close other cards
        if (isExpanded) {
            document.querySelectorAll('.referral-card.expanded').forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('expanded');
                    const otherBtn = otherCard.querySelector('.read-more-btn-referral');
                    if (otherBtn) otherBtn.textContent = '查看完整故事';
                }
            });
        }
    });
}
