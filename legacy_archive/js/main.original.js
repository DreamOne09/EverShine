// ============================================
// 全域變數
// ============================================
let membersData = [];
let allCategories = [];

// ============================================
// 頁面載入完成後初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // 載入共用組件（導航欄、頁尾、橫幅等）
    if (typeof initComponents === 'function') {
        initComponents();
    }

    // 星空背景已由 starry-sky.js 處理
    // initStarfield(); // 改用 Canvas 星空背景

    // 檢查是否有會員展示區，才載入會員資料
    if (document.getElementById('membersGrid')) {
        loadMembersData();
    }

    initNavigation();

    // 檢查是否有關鍵數字區塊
    if (document.querySelector('.metric-value')) {
        initMetricsAnimation();
    }

    initBackToTop();

    // 處理頁面載入時的錨點定位
    handleAnchorNavigation();

    // 初始化 FAQ 互動功能
    initFAQ();

    // 初始化滾動動畫
    initScrollAnimations();

    // 載入畫面隱藏邏輯已移至 index.html 內聯腳本，確保一定會執行
    // 此處保留診斷功能（可選）
    const loader = document.getElementById('pageLoader');
    if (loader && !loader.classList.contains('hidden')) {
        // 如果載入畫面還在顯示，可能是內聯腳本未執行，這裡作為備用
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    }
});

// ============================================
// 滾動動畫功能 (Intersection Observer)
// ============================================
function initScrollAnimations() {
    // 檢查瀏覽器是否支援 Intersection Observer
    if (!('IntersectionObserver' in window)) {
        // 不支援時，直接顯示所有元素
        const animatedElements = document.querySelectorAll('.fade-in-on-scroll');
        animatedElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
        return;
    }

    // 設定動畫選項
    const animationOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // 提前 100px 觸發動畫
        threshold: 0.1
    };

    // 創建 Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // 觀察一次後就停止觀察
                observer.unobserve(entry.target);
            }
        });
    }, animationOptions);

    // 為需要動畫的元素添加類別和初始樣式
    const sections = document.querySelectorAll('section');
    const cards = document.querySelectorAll('.glass-card, .unified-card-primary, .unified-card-secondary, .success-card-individual, .member-card, .referral-card, .faq-item');

    // 合併所有需要動畫的元素
    const elementsToAnimate = [...sections, ...cards];

    elementsToAnimate.forEach((el, index) => {
        // 添加動畫類別
        el.classList.add('fade-in-on-scroll');

        // 設定初始狀態（透過 CSS 變數控制延遲）
        el.style.setProperty('--animation-delay', `${index * 0.1}s`);

        // 開始觀察
        observer.observe(el);
    });
}

// ============================================
// FAQ 互動功能
// ============================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    // 如果頁面沒有 FAQ 區塊，靜默返回（這是正常的，不是所有頁面都有 FAQ）
    if (faqItems.length === 0) {
        return;
    }

    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const toggle = item.querySelector('.faq-toggle');

        if (!question) {
            console.warn(`FAQ: 項目 ${index} 找不到 .faq-question`);
            return;
        }

        if (!toggle) {
            console.warn(`FAQ: 項目 ${index} 找不到 .faq-toggle`);
        }

        // 確保初始狀態正確
        if (!item.classList.contains('active')) {
            item.classList.remove('active');
        }

        question.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const isActive = item.classList.contains('active');

            // 關閉其他 FAQ
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // 切換當前 FAQ
            if (isActive) {
                item.classList.remove('active');
                question.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });

        // 添加鍵盤支援
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');

        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });

    console.log(`FAQ: 已初始化 ${faqItems.length} 個 FAQ 項目`);
}

// ============================================
// 處理錨點導航
// ============================================
function handleAnchorNavigation() {
    // 檢查 URL 中是否有錨點
    if (window.location.hash) {
        setTimeout(() => {
            const targetId = window.location.hash;
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = targetSection.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
}

// ============================================
// 載入會員資料 - 簡化路徑處理（遵循 KISS 原則）
// ============================================
async function loadMembersData() {
    try {
        // 簡化：只嘗試最常見的路徑
        const dataPath = 'data/members.json';
        const response = await fetch(dataPath);

        if (!response.ok) {
            throw new Error(`無法載入會員資料檔案。請確認檔案存在於 ${dataPath}，或使用 HTTP 伺服器開啟網站（避免 CORS 限制）。`);
        }

        const data = await response.json();

        if (!data || !data.members || !Array.isArray(data.members)) {
            throw new Error('會員資料格式錯誤：找不到 members 陣列');
        }

        membersData = data.members;

        // 為每個會員添加分類（如果沒有）並修正照片路徑
        membersData.forEach(member => {
            if (!member.category) {
                member.category = getCategoryByIndustry(member.industry);
            }
            // 修正照片路徑 - 統一使用相對路徑
            if (member.photo) {
                // 移除 ../ 前綴，統一使用相對路徑
                member.photo = member.photo.replace(/^\.\.\//, '');
                // 如果路徑包含 ../會員照片/，改為 會員照片/
                if (member.photo.includes('../會員照片/')) {
                    member.photo = member.photo.replace('../會員照片/', '會員照片/');
                }
                // 如果路徑包含 ../images/members/，改為 images/members/
                if (member.photo.includes('../images/members/')) {
                    member.photo = member.photo.replace('../images/members/', 'images/members/');
                }
            }
        });

        // 提取所有分類並統計人數
        const categoryCounts = {};
        membersData.forEach(member => {
            const cat = member.category;
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        // 按會員人數排序分類（從多到少），並過濾掉「其他」分類
        allCategories = Object.keys(categoryCounts)
            .filter(cat => cat !== "其他")
            .sort((a, b) => categoryCounts[b] - categoryCounts[a]);

        // 儲存分類統計資訊
        window.categoryCounts = categoryCounts;

        // 初始化篩選器
        initFilterButtons();

        // 顯示所有會員（按分類分組）
        displayMembersByCategory(membersData);
    } catch (error) {
        console.error('載入會員資料失敗:', error);
        console.error('錯誤詳情:', error.message);

        // 顯示錯誤訊息
        const membersGrid = document.getElementById('membersGrid');
        if (membersGrid) {
            membersGrid.innerHTML = `
                <div style="text-align: center; color: #888; grid-column: 1 / -1; padding: 2rem;">
                    <p style="margin-bottom: 1rem; color: #D4AF37; font-size: 1.1rem;">載入會員資料時發生錯誤</p>
                    <p style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">${error.message}</p>
                    <p style="font-size: 0.85rem; color: #555; margin-top: 1rem;">
                        提示：如果使用本地檔案開啟，請使用 HTTP 伺服器（如 VS Code Live Server）或部署到 GitHub Pages
                    </p>
                </div>
            `;
        }
    }
}

// ============================================
// 初始化篩選器按鈕
// ============================================
function initFilterButtons() {
    const filterButtonsContainer = document.getElementById('filterButtons');
    if (!filterButtonsContainer) return;

    // 清空現有按鈕
    filterButtonsContainer.innerHTML = '';

    // 加入「全部顯示」按鈕
    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn active';
    allBtn.setAttribute('data-category', 'all');
    allBtn.textContent = '全部顯示';
    allBtn.addEventListener('click', () => filterMembersByCategory('all'));
    filterButtonsContainer.appendChild(allBtn);

    // 為每個分類建立按鈕
    allCategories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.setAttribute('data-category', category);
        btn.textContent = category;
        btn.addEventListener('click', () => filterMembersByCategory(category));
        filterButtonsContainer.appendChild(btn);
    });
}

// ============================================
// 依分類篩選會員
// ============================================
function filterMembersByCategory(category) {
    // 更新按鈕狀態
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });

    // 篩選會員
    let filteredMembers;
    if (category === 'all') {
        filteredMembers = membersData;
        // 顯示所有會員（按分類分組）
        displayMembersByCategory(filteredMembers);
    } else {
        filteredMembers = membersData.filter(member => member.category === category);
        // 顯示單一分類的會員
        displayMembers(filteredMembers);
    }
}

// ============================================
// 顯示會員卡片
// ============================================
function displayMembers(members) {
    const membersGrid = document.getElementById('membersGrid');
    if (!membersGrid) return;

    if (members.length === 0) {
        membersGrid.innerHTML = '<p style="text-align: center; color: #888; grid-column: 1 / -1;">目前沒有符合條件的會員。</p>';
        return;
    }

    membersGrid.innerHTML = members.map(member => createMemberCard(member)).join('');

    // 初始化摺疊功能
    initMemberToggles();
}

// ============================================
// 按分類分組顯示會員
// ============================================
function displayMembersByCategory(members) {
    const membersGrid = document.getElementById('membersGrid');
    if (!membersGrid) return;

    // 按分類分組會員
    const membersByCategory = {};
    members.forEach(member => {
        const cat = member.category;
        if (!membersByCategory[cat]) {
            membersByCategory[cat] = [];
        }
        membersByCategory[cat].push(member);
    });

    // 按分類人數排序（從多到少），並過濾掉「其他」分類
    const sortedCategories = Object.keys(membersByCategory)
        .filter(cat => cat !== "其他")
        .sort((a, b) => membersByCategory[b].length - membersByCategory[a].length);

    // 生成 HTML
    let html = '';
    sortedCategories.forEach(category => {
        const categoryMembers = membersByCategory[category];
        const count = categoryMembers.length;

        const categoryId = `category-${category.replace(/\s+/g, '-').toLowerCase()}`;
        html += `
            <div class="category-section" data-category="${category}">
                <div class="category-header">
                    <div class="category-header-left">
                        <h3 class="category-title">${category}</h3>
                        <span class="category-count">${count} 位會員</span>
                    </div>
                    <button class="category-toggle-btn expanded" aria-label="展開/摺疊分類" data-target="${categoryId}">
                        <span class="toggle-icon">▲</span>
                    </button>
                </div>
                <div class="category-members-grid expanded" id="${categoryId}-members">
                    ${categoryMembers.map(member => createMemberCard(member)).join('')}
                </div>
            </div>
        `;
    });

    membersGrid.innerHTML = html;

    // 初始化摺疊功能
    initMemberToggles();
    initCategoryToggles();
}

// ============================================
// 建立會員卡片 HTML
// ============================================
function createMemberCard(member) {
    // 處理照片路徑 - 使用 JSON 中的照片路徑，如果沒有則使用占位圖
    const photoPath = member.photo || '';
    const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' rx='12' fill='%23001933'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%234ca8df' font-family='Arial' font-size='50'%3E${encodeURIComponent(member.name.charAt(0))}%3C/text%3E%3C/svg%3E`;

    const servicesHtml = buildServicesHtml(member.services);
    const hashtagsHtml = buildHashtagsHtml(member.hashtags);
    const socialHtml = buildSocialLinks(member.social);
    const contactHtml = buildContactHtml(member.contact);

    // 使用簡短介紹（摺疊時顯示，30字）和詳細介紹（展開時顯示，200字）
    const shortDescription = member.shortDescription || (member.description ? member.description.substring(0, 30) + '...' : '專業服務提供商');
    const fullDescription = member.fullDescription || member.description || '專業服務提供商';

    const memberId = `member-${member.name.replace(/\s+/g, '-').toLowerCase()}`;

    return `
        <div class="member-card collapsed" data-member-id="${memberId}">
            <div class="member-header">
                <div class="member-photo-container">
                    <img src="${photoPath || placeholderSvg}" alt="${member.name}" class="member-photo" onerror="this.src='${placeholderSvg}';">
                </div>
                <div class="member-basic-info">
                    <div class="member-name-industry">
                        <h3 class="member-name">${member.name}</h3>
                        <span class="member-title">${member.title || member.company + ' ' + member.position || ''}</span>
                        <span class="member-industry">${member.industry || ''}</span>
                    </div>
                    <button class="member-toggle-btn" aria-label="展開/摺疊會員資訊" data-target="${memberId}">
                        <span class="toggle-icon">▼</span>
                    </button>
                </div>
            </div>
            <!-- 摺疊時顯示的簡短介紹 -->
            <div class="member-short-description">
                <p>${shortDescription}</p>
            </div>
            <div class="member-details" id="${memberId}-details">
                <div class="member-info">
                    <!-- 展開時顯示的詳細介紹 -->
                    <p class="member-description">${fullDescription}</p>
                    ${servicesHtml}
                    ${hashtagsHtml}
                    ${socialHtml}
                    ${contactHtml ? `<div class="member-contact">${contactHtml}</div>` : ''}
                </div>
            </div>
        </div>
    `;
}

// ============================================
// 取得會員照片路徑（根據現有照片檔名）
// ============================================
function getMemberPhotoPath(name) {
    // 如果 JSON 中已有照片路徑，直接使用
    // 否則返回空字串，讓 onerror 處理占位圖
    return '';
}

// ============================================
// 建立聯絡方式 HTML
// ============================================
function buildContactHtml(contact) {
    if (!contact) return '';

    let html = '';
    if (contact.email) {
        html += `<p><strong>Email</strong><a class="contact-link" href="mailto:${contact.email}">${contact.email}</a></p>`;
    }
    if (contact.phone) {
        html += `<p><strong>電話</strong><span>${contact.phone}</span></p>`;
    }
    if (contact.line) {
        html += `<p><strong>Line</strong><span>${contact.line}</span></p>`;
    }

    return html;
}

// ============================================
// 建立服務項目 HTML
// ============================================
function buildServicesHtml(services) {
    if (!Array.isArray(services) || services.length === 0) return '';
    const items = services
        .filter(service => typeof service === 'string' && service.trim().length > 0)
        .map(service => `<li>${service.trim()}</li>`)
        .join('');
    if (!items) return '';
    return `
        <div class="member-services">
            <h4>服務項目</h4>
            <ul class="member-services-list">
                ${items}
            </ul>
        </div>
    `;
}

// ============================================
// 建立 Hashtag HTML
// ============================================
function buildHashtagsHtml(hashtags) {
    if (!Array.isArray(hashtags) || hashtags.length === 0) return '';
    const chips = hashtags
        .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
        .map(tag => `<span class="hashtag-chip">${tag.trim()}</span>`)
        .join('');
    if (!chips) return '';
    return `
        <div class="member-hashtags">
            ${chips}
        </div>
    `;
}

// ============================================
// 建立社群連結 HTML
// ============================================
function buildSocialLinks(social) {
    if (!social || typeof social !== 'object') return '';
    const labelMap = {
        website: { label: '官方網站', icon: '🌐' },
        facebook: { label: 'Facebook', icon: '📘' },
        instagram: { label: 'Instagram', icon: '📸' },
        linkedin: { label: 'LinkedIn', icon: '💼' },
        youtube: { label: 'YouTube', icon: '▶️' },
        threads: { label: 'Threads', icon: '💬' },
    };
    const links = Object.entries(social)
        .filter(([, value]) => typeof value === 'string' && value.trim().length > 0)
        .map(([key, value]) => {
            const meta = labelMap[key] || { label: key, icon: '🔗' };
            const href = ensureUrlProtocol(value.trim());
            const aria = `${meta.label} - ${value.trim()}`;
            return `
                <a class="member-social-link" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${aria}">
                    <span class="social-icon">${meta.icon}</span>
                    <span class="social-label">${meta.label}</span>
                </a>
            `;
        })
        .join('');
    if (!links) return '';
    return `
        <div class="member-social">
            ${links}
        </div>
    `;
}

// ============================================
// 確保連結包含協定
// ============================================
function ensureUrlProtocol(url) {
    if (!url) return '';
    if (/^(https?:)?\/\//i.test(url) || url.startsWith('mailto:')) {
        return url;
    }
    return `https://${url}`;
}

// ============================================
// 初始化導航功能
// ============================================
function initNavigation() {
    // 平滑滾動（只處理錨點連結）
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // 如果是頁面連結（包含 .html），讓瀏覽器正常處理
            if (href && href.includes('.html')) {
                // 如果是跨頁面錨點（例如 index.html#join），讓瀏覽器正常跳轉
                return; // 不阻止預設行為
            }

            // 如果是同頁面的錨點連結，處理平滑滾動
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }

            // 關閉行動選單
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            if (navMenu && navToggle) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // 響應式選單切換 - 使用延遲確保元素已載入
    setTimeout(() => {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (navToggle && navMenu) {
            // 移除舊的事件監聽器（如果有）
            const newToggle = navToggle.cloneNode(true);
            navToggle.parentNode.replaceChild(newToggle, navToggle);

            // 添加新的事件監聽器
            newToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile menu toggle clicked');
                navMenu.classList.toggle('active');
                newToggle.classList.toggle('active');
            });

            console.log('Mobile navigation initialized successfully');
        } else {
            console.warn('Navigation elements not found:', { navToggle: !!navToggle, navMenu: !!navMenu });
        }
    }, 100);

    // 滾動時導航欄樣式變化
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(6, 32, 58, 0.95)';
                navbar.style.boxShadow = '0 12px 24px rgba(1, 27, 54, 0.35)';
            } else {
                navbar.style.background = 'rgba(8, 38, 68, 0.9)';
                navbar.style.boxShadow = '0 8px 18px rgba(1, 27, 54, 0.25)';
            }
        });
    }
}

// ============================================
// 初始化關鍵數字動畫
// ============================================
function initMetricsAnimation() {
    const metricValues = document.querySelectorAll('.metric-value');

    // 建立 Intersection Observer 來觸發動畫
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    metricValues.forEach(value => {
        observer.observe(value);
    });
}

// ============================================
// 數字動畫
// ============================================
function animateValue(element) {
    const target = parseInt(element.getAttribute('data-target')) || 0;
    const duration = 2000; // 動畫持續時間（毫秒）
    const start = 0;
    const increment = target / (duration / 16); // 60fps
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

// ============================================
// 格式化數字（加入千分位）
// ============================================
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString('zh-TW');
}

// ============================================
// 初始化回到頂部按鈕
// ============================================
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// 初始化會員卡片摺疊功能
// ============================================
function initMemberToggles() {
    const toggleButtons = document.querySelectorAll('.member-toggle-btn');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetId = btn.getAttribute('data-target');
            const detailsElement = document.getElementById(`${targetId}-details`);
            const icon = btn.querySelector('.toggle-icon');
            const card = btn.closest('.member-card');
            const shortDesc = card?.querySelector('.member-short-description');
            const membersGrid = card?.closest('.category-members-grid');

            if (detailsElement) {
                const isExpanded = detailsElement.classList.toggle('expanded');
                btn.classList.toggle('expanded', isExpanded);
                icon.textContent = isExpanded ? '▲' : '▼';

                // 控制簡短介紹的顯示/隱藏
                if (shortDesc) {
                    if (isExpanded) {
                        shortDesc.style.display = 'none';
                        card.classList.remove('collapsed');
                        card.classList.add('expanded-full');

                        // 隱藏旁邊的會員卡片
                        if (membersGrid) {
                            const allCards = membersGrid.querySelectorAll('.member-card');
                            allCards.forEach(otherCard => {
                                if (otherCard !== card && !otherCard.classList.contains('expanded-full')) {
                                    otherCard.style.display = 'none';
                                }
                            });
                        }
                    } else {
                        shortDesc.style.display = 'block';
                        card.classList.add('collapsed');
                        card.classList.remove('expanded-full');

                        // 顯示所有會員卡片
                        if (membersGrid) {
                            const allCards = membersGrid.querySelectorAll('.member-card');
                            allCards.forEach(otherCard => {
                                otherCard.style.display = '';
                            });
                        }
                    }
                }
            }
        });
    });
}

// ============================================
// 初始化類別摺疊功能
// ============================================
function initCategoryToggles() {
    const toggleButtons = document.querySelectorAll('.category-toggle-btn');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('data-target');
            const membersGrid = document.getElementById(`${targetId}-members`);
            const icon = btn.querySelector('.toggle-icon');

            if (membersGrid) {
                const isExpanded = membersGrid.classList.toggle('expanded');
                btn.classList.toggle('expanded', isExpanded);
                icon.textContent = isExpanded ? '▲' : '▼';
            }
        });
    });
}

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

