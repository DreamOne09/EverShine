// ============================================
// 全域變數
// ============================================
let membersData = [];
let allIndustries = [];

// ============================================
// 頁面載入完成後初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadMembersData();
    initNavigation();
    initMetricsAnimation();
    initBackToTop();
});

// ============================================
// 載入會員資料
// ============================================
async function loadMembersData() {
    try {
        // 嘗試多種路徑，確保在不同環境下都能正常運作
        let response;
        const paths = [
            './data/members.json',
            'data/members.json',
            '/data/members.json',
            '../data/members.json'
        ];
        
        let lastError = null;
        for (const path of paths) {
            try {
                response = await fetch(path);
                if (response.ok) {
                    break;
                }
            } catch (err) {
                lastError = err;
                continue;
            }
        }
        
        if (!response || !response.ok) {
            throw new Error(`無法載入會員資料檔案。請確認檔案存在於 data/members.json，或使用 HTTP 伺服器開啟網站（避免 CORS 限制）。`);
        }
        
        const data = await response.json();
        
        if (!data || !data.members || !Array.isArray(data.members)) {
            throw new Error('會員資料格式錯誤：找不到 members 陣列');
        }
        
        membersData = data.members;
        
        // 提取所有產業別
        allIndustries = [...new Set(membersData.map(member => member.industry))].sort();
        
        // 初始化篩選器
        initFilterButtons();
        
        // 顯示所有會員
        displayMembers(membersData);
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
    
    // 清空現有按鈕（保留「全部顯示」）
    const allButton = filterButtonsContainer.querySelector('[data-industry="all"]');
    filterButtonsContainer.innerHTML = '';
    
    // 重新加入「全部顯示」按鈕
    if (allButton) {
        filterButtonsContainer.appendChild(allButton);
    } else {
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.setAttribute('data-industry', 'all');
        allBtn.textContent = '全部顯示';
        allBtn.addEventListener('click', () => filterMembers('all'));
        filterButtonsContainer.appendChild(allBtn);
    }
    
    // 為每個產業別建立按鈕
    allIndustries.forEach(industry => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.setAttribute('data-industry', industry);
        btn.textContent = industry;
        btn.addEventListener('click', () => filterMembers(industry));
        filterButtonsContainer.appendChild(btn);
    });
}

// ============================================
// 篩選會員
// ============================================
function filterMembers(industry) {
    // 更新按鈕狀態
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-industry') === industry) {
            btn.classList.add('active');
        }
    });
    
    // 篩選會員
    let filteredMembers;
    if (industry === 'all') {
        filteredMembers = membersData;
    } else {
        filteredMembers = membersData.filter(member => member.industry === industry);
    }
    
    // 顯示篩選後的會員
    displayMembers(filteredMembers);
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
}

// ============================================
// 建立會員卡片 HTML
// ============================================
function createMemberCard(member) {
    // 處理照片路徑 - 使用 JSON 中的照片路徑，如果沒有則使用占位圖
    const photoPath = member.photo || '';
    const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect width='120' height='120' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23D4AF37' font-family='Arial' font-size='40'%3E${encodeURIComponent(member.name.charAt(0))}%3C/text%3E%3C/svg%3E`;
    
    // 建立聯絡方式 HTML
    const contactHtml = buildContactHtml(member.contact);
    
    return `
        <div class="member-card">
            <img src="${photoPath || placeholderSvg}" alt="${member.name}" class="member-photo" onerror="this.src='${placeholderSvg}';">
            <h3 class="member-name">${member.name}</h3>
            <span class="member-industry">${member.industry}</span>
            <p class="member-description">${member.description || '專業服務提供商'}</p>
            ${contactHtml ? `<div class="member-contact">${contactHtml}</div>` : ''}
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
        html += `<p><strong>Email:</strong> <a href="mailto:${contact.email}" style="color: #D4AF37;">${contact.email}</a></p>`;
    }
    if (contact.phone) {
        html += `<p><strong>電話:</strong> ${contact.phone}</p>`;
    }
    if (contact.line) {
        html += `<p><strong>Line:</strong> ${contact.line}</p>`;
    }
    
    return html;
}

// ============================================
// 初始化導航功能
// ============================================
function initNavigation() {
    // 平滑滾動
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
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
    
    // 響應式選單切換
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // 滾動時導航欄樣式變化
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(10, 10, 10, 0.98)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                navbar.style.boxShadow = 'none';
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

