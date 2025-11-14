// ============================================
// 星空背景效果 - 參考 Webflow 網站風格
// 僅應用於非 hero 的 section
// ============================================

function createStarryBackground() {
    // 檢查是否已經存在
    if (document.querySelector('.starry-background-container')) {
        return;
    }
    
    // 創建星空容器
    const starryContainer = document.createElement('div');
    starryContainer.className = 'starry-background-container';
    starryContainer.innerHTML = `
        <div class="starry-sky">
            <div class="stars-layer stars"></div>
            <div class="stars-layer stars1"></div>
            <div class="stars-layer stars2"></div>
        </div>
    `;
    
    // 找到第一個非 hero 的 section，在它之前插入
    const hero = document.querySelector('.hero') || document.querySelector('.page-hero');
    const firstNonHeroSection = document.querySelector('section:not(.hero):not(.page-hero)');
    
    if (firstNonHeroSection) {
        firstNonHeroSection.parentNode.insertBefore(starryContainer, firstNonHeroSection);
    } else if (hero && hero.nextSibling) {
        hero.parentNode.insertBefore(starryContainer, hero.nextSibling);
    } else {
        // 如果沒有找到合適的位置，插入到 body 末尾
        document.body.appendChild(starryContainer);
    }
}

// 生成星星的 box-shadow
function generateStarsShadow(count, maxX, maxY) {
    const shadows = [];
    for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);
        shadows.push(`${x}px ${y}px #FFF`);
    }
    return shadows.join(', ');
}

// 初始化星空背景
function initStarryBackground() {
    // 只在非 hero 頁面或 hero 之後的區域顯示
    const hero = document.querySelector('.hero');
    const pageHero = document.querySelector('.page-hero');
    
    // 如果沒有 hero，直接創建背景
    if (!hero && !pageHero) {
        createStarryBackground();
        return;
    }
    
    // 創建背景容器，但設置為在 hero 之後顯示
    createStarryBackground();
    
    // 動態生成星星位置
    const starsLayer = document.querySelector('.stars-layer.stars');
    const stars1Layer = document.querySelector('.stars-layer.stars1');
    const stars2Layer = document.querySelector('.stars-layer.stars2');
    
    if (starsLayer) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
        const maxX = Math.max(viewportWidth, 2560);
        const maxY = Math.max(viewportHeight, 2560);
        
        // 生成不同層級的星星
        starsLayer.style.boxShadow = generateStarsShadow(60, maxX, maxY);
        stars1Layer.style.boxShadow = generateStarsShadow(50, maxX, maxY);
        stars2Layer.style.boxShadow = generateStarsShadow(40, maxX, maxY);
        
        // 為 :after 偽元素生成星星（通過 data 屬性）
        starsLayer.setAttribute('data-after-shadow', generateStarsShadow(60, maxX, maxY));
        stars1Layer.setAttribute('data-after-shadow', generateStarsShadow(50, maxX, maxY));
        stars2Layer.setAttribute('data-after-shadow', generateStarsShadow(40, maxX, maxY));
    }
}

// 頁面載入時初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStarryBackground);
} else {
    initStarryBackground();
}

// 視窗大小改變時重新生成
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        initStarryBackground();
    }, 250);
});

