// ============================================
// 共用元件模組 - 遵循 DRY 原則
// ============================================

// 流星動畫容器 HTML
function getMeteorShowerHTML() {
    return `
    <div class="meteor-shower">
        <div class="meteor"></div>
        <div class="meteor"></div>
        <div class="meteor"></div>
        <div class="meteor"></div>
        <div class="meteor"></div>
    </div>`;
}

// 導航欄 HTML
function getNavigationHTML() {
    return `
    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="index.html">
                    <img src="images/assets/logo/透明底白字長條logo.png" alt="長輝白金分會" class="logo-image">
                </a>
            </div>
            <button class="nav-toggle" id="navToggle" aria-label="選單開關">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-menu" id="navMenu">
                <li><a href="index.html" class="nav-link">首頁</a></li>
                <li><a href="what-is-bni.html" class="nav-link">什麼是BNI</a></li>
                <li><a href="members.html" class="nav-link">會員介紹</a></li>
                <li><a href="referrals.html" class="nav-link">會員引薦報告</a></li>
                <li class="nav-social">
                    <a href="https://www.facebook.com/BNlLongTermCare" target="_blank" rel="noopener noreferrer" class="nav-social-link" aria-label="Facebook">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </a>
                    <a href="https://www.instagram.com/chhubni/" target="_blank" rel="noopener noreferrer" class="nav-social-link" aria-label="Instagram">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                    </a>
                    <a href="https://www.threads.net/@chhubni" target="_blank" rel="noopener noreferrer" class="nav-social-link" aria-label="Threads">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.001 0C5.373 0 0 5.373 0 12.001c0 5.301 3.258 9.838 7.863 11.674-.11-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.001 12.001 24.001c6.628 0 12.001-5.373 12.001-12.001C24.002 5.373 18.629.001 12.001.001z"/>
                        </svg>
                    </a>
                </li>
            </ul>
        </div>
    </nav>`;
}

// Footer HTML
function getFooterHTML() {
    return `
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>BNI 長輝白金分會</h4>
                    <p>專業商務引薦平台</p>
                    <p style="margin-top: 1rem; color: var(--text-gray-dark); font-size: 0.9rem;">連結優秀企業家、業務與經理人，創造無限商機與成長機會</p>
                </div>
                <div class="footer-section">
                    <h4>快速連結</h4>
                    <ul class="footer-links">
                        <li><a href="index.html">首頁</a></li>
                        <li><a href="what-is-bni.html">什麼是BNI</a></li>
                        <li><a href="members.html">會員介紹</a></li>
                        <li><a href="referrals.html">會員引薦報告</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>關注我們</h4>
                    <div class="footer-social">
                        <a href="https://www.facebook.com/BNlLongTermCare" target="_blank" rel="noopener noreferrer" class="footer-social-link" aria-label="Facebook">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <span class="social-name">Facebook</span>
                        </a>
                        <a href="https://www.instagram.com/chhubni/" target="_blank" rel="noopener noreferrer" class="footer-social-link" aria-label="Instagram">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                            <span class="social-name">Instagram</span>
                        </a>
                        <a href="https://www.threads.net/@chhubni" target="_blank" rel="noopener noreferrer" class="footer-social-link" aria-label="Threads">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.001 0C5.373 0 0 5.373 0 12.001c0 5.301 3.258 9.838 7.863 11.674-.11-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.001 12.001 24.001c6.628 0 12.001-5.373 12.001-12.001C24.002 5.373 18.629.001 12.001.001z"/>
                            </svg>
                            <span class="social-name">Threads</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
            </div>
        </div>
        <button class="back-to-top" id="backToTop" aria-label="回到頂部">
            <span>↑</span>
        </button>
    </footer>`;
}

// 固定橫幅 HTML
function getFixedBannerHTML() {
    return `
        <div class="fixed-banner">
            <div class="banner-content">
                <span class="banner-text">Copyright © 2025 BNI 台灣 - 長輝白金分會</span>
                <span class="banner-separator">|</span>
                <span class="banner-text">每週三早上 6:30 線上開會</span>
            </div>
        </div>
    `;
}

// 初始化共用元件 - 自動載入所有組件
function initComponents() {
    // 載入流星動畫容器（如果不存在）
    if (!document.querySelector('.meteor-shower')) {
        document.body.insertAdjacentHTML('afterbegin', getMeteorShowerHTML());
    }
    
    // 載入導航欄（如果不存在）
    if (!document.getElementById('navbar')) {
        const navPlaceholder = document.getElementById('nav-placeholder');
        if (navPlaceholder) {
            navPlaceholder.outerHTML = getNavigationHTML();
        } else {
            // 如果沒有 placeholder，在 body 開頭插入
            document.body.insertAdjacentHTML('afterbegin', getNavigationHTML());
        }
    }
    
    // 載入 Footer（如果不存在）
    if (!document.querySelector('footer.footer')) {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.outerHTML = getFooterHTML();
        } else {
            // 如果沒有 placeholder，在 body 結尾插入
            document.body.insertAdjacentHTML('beforeend', getFooterHTML());
        }
    }
    
    // 載入固定橫幅（如果不存在）
    if (!document.querySelector('.fixed-banner')) {
        document.body.insertAdjacentHTML('beforeend', getFixedBannerHTML());
    }
}

