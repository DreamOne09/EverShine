// ============================================
// 模組化封裝 (IIFE) - 避免污染全域命名空間
// ============================================
(function () {
    'use strict';

    // 狀態管理
    const state = {
        membersData: [],
        allCategories: [],
        categoryCounts: {}
    };

    // 工具函式：節流 (Throttle)
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // ============================================
    // 頁面載入完成後初始化
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
        // 載入共用組件（包含 header/footer 和導航功能）
        if (typeof initComponents === 'function') {
            initComponents();
        }

        // 檢查是否有會員展示區，且沒有使用自定義渲染器
        const membersGrid = document.getElementById('membersGrid');
        if (membersGrid && !membersGrid.hasAttribute('data-custom-render')) {
            loadMembersData();
        }

        // 檢查是否有關鍵數字區塊
        if (document.querySelector('.metric-value')) {
            initMetricsAnimation();
        }

        // 注意：initNavigation()（包含滾動效果）和 initBackToTop() 已由 components.js 處理，無需重複呼叫
        handleAnchorNavigation();
        initFAQ();
        initScrollAnimations();
        initGlobalImageErrorHandler();
        initReferralCardToggles();

        // 確保載入畫面隱藏
        const loader = document.getElementById('pageLoader');
        if (loader && !loader.classList.contains('hidden')) {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 1000);
        }
    });

    // ============================================
    // 全域圖片錯誤處理
    // ============================================
    function initGlobalImageErrorHandler() {
        document.addEventListener('error', function (e) {
            if (e.target.tagName.toLowerCase() === 'img') {
                e.target.style.display = 'none';
                // 如果是會員照片，可以顯示預設圖
                if (e.target.classList.contains('member-photo')) {
                    // 這裡可以設置預設圖片，或者保持隱藏
                }
            }
        }, true); // 使用 capture phase
    }

    // ============================================
    // 滾動動畫功能 (Intersection Observer)
    // ============================================
    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        });

        const elementsToAnimate = document.querySelectorAll('section, .glass-card, .unified-card-primary, .unified-card-secondary, .success-card-individual, .member-card, .referral-card, .faq-item');

        elementsToAnimate.forEach((el, index) => {
            el.classList.add('fade-in-on-scroll');
            // 使用 CSS 變數優化延遲計算，避免過多 inline style
            el.style.setProperty('--animation-delay', `${(index % 5) * 0.1}s`);
            observer.observe(el);
        });
    }

    // ============================================
    // FAQ 互動功能
    // ============================================
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length === 0) return;

        // 使用事件委派優化
        const faqContainer = document.querySelector('.faq-content');
        if (faqContainer) {
            faqContainer.addEventListener('click', (e) => {
                const question = e.target.closest('.faq-question');
                if (!question) return;

                e.preventDefault();
                const item = question.closest('.faq-item');
                const isActive = item.classList.contains('active');

                // 關閉其他
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) otherItem.classList.remove('active');
                });

                // 切換當前
                item.classList.toggle('active', !isActive);
                question.setAttribute('aria-expanded', !isActive);
            });
        }
    }

    // ============================================
    // 處理錨點導航
    // ============================================
    function handleAnchorNavigation() {
        if (window.location.hash) {
            setTimeout(() => {
                const targetId = window.location.hash;
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    window.scrollTo({
                        top: targetSection.offsetTop - navHeight,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }

    // ============================================
    // 載入會員資料
    // ============================================
    async function loadMembersData() {
        try {
            const response = await fetch('data/members.json');
            if (!response.ok) throw new Error('無法載入會員資料');

            const data = await response.json();
            if (!data?.members) throw new Error('資料格式錯誤');

            state.membersData = data.members.map(member => ({
                ...member,
                category: member.category || getCategoryByIndustry(member.industry),
                photo: normalizePhotoPath(member.photo)
            }));

            // 統計分類
            state.membersData.forEach(m => {
                state.categoryCounts[m.category] = (state.categoryCounts[m.category] || 0) + 1;
            });

            state.allCategories = Object.keys(state.categoryCounts)
                .filter(cat => cat !== "其他")
                .sort((a, b) => state.categoryCounts[b] - state.categoryCounts[a]);

            initFilterButtons();
            displayMembersByCategory(state.membersData);

        } catch (error) {
            const membersGrid = document.getElementById('membersGrid');
            if (membersGrid) {
                membersGrid.innerHTML = `<div class="error-message">載入失敗: ${error.message}</div>`;
            }
        }
    }

    function normalizePhotoPath(path) {
        if (!path) return '';
        return path.replace(/^\.\.\//, '')
            .replace('../會員照片/', '會員照片/')
            .replace('../images/members/', 'images/members/');
    }

    function getCategoryByIndustry(industry) {
        // 簡單的分類邏輯，可根據需求擴充
        return "其他";
    }

    // ============================================
    // 初始化篩選器按鈕
    // ============================================
    function initFilterButtons() {
        const container = document.getElementById('filterButtons');
        if (!container) return;

        container.innerHTML = '';

        const createBtn = (text, cat) => {
            const btn = document.createElement('button');
            btn.className = `filter-btn ${cat === 'all' ? 'active' : ''}`;
            btn.dataset.category = cat;
            btn.textContent = text;
            btn.addEventListener('click', () => filterMembersByCategory(cat));
            return btn;
        };

        container.appendChild(createBtn('全部顯示', 'all'));
        state.allCategories.forEach(cat => {
            container.appendChild(createBtn(cat, cat));
        });
    }

    function filterMembersByCategory(category) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        const filtered = category === 'all'
            ? state.membersData
            : state.membersData.filter(m => m.category === category);

        if (category === 'all') {
            displayMembersByCategory(filtered);
        } else {
            displayMembers(filtered);
        }
    }

    // ============================================
    // 顯示會員邏輯
    // ============================================
    function displayMembers(members) {
        const grid = document.getElementById('membersGrid');
        if (!grid) return;

        if (members.length === 0) {
            grid.innerHTML = '<p class="no-members">目前沒有符合條件的會員。</p>';
            return;
        }

        grid.innerHTML = members.map(createMemberCard).join('');
        initMemberToggles();
    }

    function displayMembersByCategory(members) {
        const grid = document.getElementById('membersGrid');
        if (!grid) return;

        const grouped = members.reduce((acc, member) => {
            acc[member.category] = acc[member.category] || [];
            acc[member.category].push(member);
            return acc;
        }, {});

        const sortedCats = Object.keys(grouped)
            .filter(cat => cat !== "其他")
            .sort((a, b) => grouped[b].length - grouped[a].length);

        grid.innerHTML = sortedCats.map(cat => {
            const catMembers = grouped[cat];
            const catId = `category-${cat.replace(/\s+/g, '-').toLowerCase()}`;
            return `
                <div class="category-section" data-category="${cat}">
                    <div class="category-header">
                        <div class="category-header-left">
                            <h3 class="category-title">${cat}</h3>
                            <span class="category-count">${catMembers.length} 位會員</span>
                        </div>
                        <button class="category-toggle-btn expanded" aria-label="展開/摺疊分類" data-target="${catId}">
                            <span class="toggle-icon">▲</span>
                        </button>
                    </div>
                    <div class="category-members-grid expanded" id="${catId}-members">
                        ${catMembers.map(createMemberCard).join('')}
                    </div>
                </div>
            `;
        }).join('');

        initMemberToggles();
        initCategoryToggles();
    }

    function createMemberCard(member) {
        const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' rx='12' fill='%23001933'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%234ca8df' font-family='Arial' font-size='50'%3E${encodeURIComponent(member.name.charAt(0))}%3C/text%3E%3C/svg%3E`;
        const memberId = `member-${member.name.replace(/\s+/g, '-').toLowerCase()}`;
        const shortDesc = member.shortDescription || (member.description ? member.description.substring(0, 30) + '...' : '專業服務提供商');
        const fullDesc = member.fullDescription || member.description || '專業服務提供商';

        return `
            <div class="member-card collapsed" data-member-id="${memberId}">
                <div class="member-header">
                    <div class="member-photo-container">
                        <img src="${member.photo || placeholderSvg}" alt="${member.name}" class="member-photo" loading="lazy" width="100" height="100">
                    </div>
                    <div class="member-basic-info">
                        <div class="member-name-industry">
                            <h3 class="member-name">${member.name}</h3>
                            <span class="member-title">${member.title || ''}</span>
                            <span class="member-industry">${member.industry || ''}</span>
                        </div>
                        <button class="member-toggle-btn" aria-label="展開/摺疊會員資訊" data-target="${memberId}">
                            <span class="toggle-icon">▼</span>
                        </button>
                    </div>
                </div>
                <div class="member-short-description"><p>${shortDesc}</p></div>
                <div class="member-details" id="${memberId}-details">
                    <div class="member-info">
                        <p class="member-description">${fullDesc}</p>
                        ${buildServicesHtml(member.services)}
                        ${buildHashtagsHtml(member.hashtags)}
                        ${buildSocialLinks(member.social)}
                        ${buildContactHtml(member.contact)}
                    </div>
                </div>
            </div>
        `;
    }

    // HTML Helper Functions
    function buildServicesHtml(services) {
        if (!services?.length) return '';
        return `<div class="member-services"><h4>服務項目</h4><ul class="member-services-list">${services.map(s => `<li>${s.trim()}</li>`).join('')}</ul></div>`;
    }

    function buildHashtagsHtml(tags) {
        if (!tags?.length) return '';
        return `<div class="member-hashtags">${tags.map(t => `<span class="hashtag-chip">${t.trim()}</span>`).join('')}</div>`;
    }

    function buildSocialLinks(social) {
        if (!social) return '';
        const icons = { website: '🌐', facebook: '📘', instagram: '📸', linkedin: '💼', youtube: '▶️', threads: '💬' };
        return `<div class="member-social">${Object.entries(social).map(([k, v]) => {
            if (!v) return '';
            const url = v.startsWith('http') ? v : `https://${v}`;
            return `<a class="member-social-link" href="${url}" target="_blank" rel="noopener noreferrer"><span class="social-icon">${icons[k] || '🔗'}</span><span class="social-label">${k}</span></a>`;
        }).join('')}</div>`;
    }

    function buildContactHtml(contact) {
        if (!contact) return '';
        let html = '';
        if (contact.email) html += `<p><strong>Email</strong><a href="mailto:${contact.email}">${contact.email}</a></p>`;
        if (contact.phone) html += `<p><strong>電話</strong><span>${contact.phone}</span></p>`;
        if (contact.line) html += `<p><strong>Line</strong><span>${contact.line}</span></p>`;
        return html ? `<div class="member-contact">${html}</div>` : '';
    }

    // 注意：導航欄滾動效果已整合到 components.js 的 initNavigation() 中，無需重複實作

    function initMetricsAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateValue(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.metric-value').forEach(el => observer.observe(el));
    }

    function animateValue(element) {
        const target = parseInt(element.getAttribute('data-target')) || 0;
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(current));
            }
        }, 16);
    }

    function formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString('zh-TW');
    }

    // 注意：initBackToTop() 已由 components.js 處理，此函數已移除以避免重複

    function initMemberToggles() {
        // 使用事件委派
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

    function initCategoryToggles() {
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('.category-toggle-btn');
            if (!btn) return;

            const targetId = btn.dataset.target;
            const grid = document.getElementById(`${targetId}-members`);
            if (grid) {
                const isExpanded = grid.classList.toggle('expanded');
                btn.classList.toggle('expanded', isExpanded);
                btn.querySelector('.toggle-icon').textContent = isExpanded ? '▲' : '▼';
            }
        });
    }

    // ============================================
    // 初始化引薦卡片展開功能
    // ============================================
    function initReferralCardToggles() {
        document.body.addEventListener('click', (e) => {
            const card = e.target.closest('.referral-card');
            if (!card) return;

            // 如果點擊的是連結，不觸發展開
            if (e.target.closest('a')) return;

            // 切換展開狀態
            const isExpanded = card.classList.toggle('expanded');
            
            // 可選：關閉其他已展開的卡片（只保留一個展開）
            if (isExpanded) {
                document.querySelectorAll('.referral-card.expanded').forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.remove('expanded');
                    }
                });
            }
        });
    }

    // 在初始化時調用
    document.addEventListener('DOMContentLoaded', () => {
        initReferralCardToggles();
    });

})();



// ============================================
// 初始化動態星點背景 - 生成大量星點營造宇宙感
// ============================================
function initStarfield() {
    const starfield = document.getElementById('starfield');
    if (!starfield) return;

    // 根據螢幕大小計算星點數量（響應式）
    const width = window.innerWidth;
    const height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    const starCount = Math.floor((width * height) / 8000); // 每 8000 像素一個星點

    // 星點顏色配置（使用現有的 CSS 變數顏色）
    const starColors = [
        'rgba(255, 255, 255, 0.9)',      // 白色亮星
        'rgba(255, 255, 255, 0.8)',      // 白色中等
        'rgba(255, 255, 255, 0.7)',      // 白色暗星
        'rgba(169, 214, 255, 0.85)',    // 藍色亮星
        'rgba(169, 214, 255, 0.75)',    // 藍色中等
        'rgba(200, 230, 255, 0.8)',     // 青色亮星
        'rgba(200, 230, 255, 0.7)',     // 青色中等
        'rgba(115, 188, 255, 0.75)',    // 天藍色
        'rgba(115, 188, 255, 0.65)',    // 天藍色暗
    ];

    // 清空現有星點
    starfield.innerHTML = '';

    // 生成星點
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // 隨機位置
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        // 隨機大小（0.5px 到 2px）
        const size = Math.random() * 1.5 + 0.5;

        // 隨機顏色
        const color = starColors[Math.floor(Math.random() * starColors.length)];

        // 隨機動畫延遲（創造閃爍效果）
        const delay = Math.random() * 3;

        // 隨機動畫持續時間
        const duration = Math.random() * 2 + 2;

        star.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            box-shadow: 0 0 ${size * 2}px ${color};
            animation: starTwinkle ${duration}s ease-in-out infinite;
            animation-delay: ${delay}s;
            pointer-events: none;
        `;

        starfield.appendChild(star);
    }

    // 視窗大小改變時重新生成星點
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initStarfield();
        }, 250);
    });
}

