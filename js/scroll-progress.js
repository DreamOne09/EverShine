// ============================================
// 滾動進度指示器
// ============================================

(function() {
    'use strict';
    
    // 創建進度條元素
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, 
            var(--color-primary-dark), 
            var(--color-primary), 
            var(--color-primary-light));
        z-index: 9999;
        transition: width 0.1s ease-out;
        box-shadow: 0 2px 8px rgba(76, 168, 223, 0.5);
    `;
    document.body.appendChild(progressBar);
    
    // 更新進度條
    function updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    }
    
    // 監聽滾動事件（使用節流）
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateProgress();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateProgress);
    
    // 初始更新
    updateProgress();
})();

