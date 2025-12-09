// ============================================
// 模組化封裝 (IIFE) - 避免污染全域命名空間
// ============================================
(function () {
    'use strict';

    // ============================================
    // 頁面載入完成後初始化
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
        // 載入共用組件（包含 header/footer 和導航功能）
        if (typeof initComponents === 'function') {
            initComponents();
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

        // 確保載入畫面隱藏
        const loader = document.querySelector('.page-loader');
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
    // 數字動畫
    // ============================================
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

})();
