// ============================================
// 星空背景效果 - 參考 Webflow 網站風格
// 僅應用於非 hero 的 section
// ============================================

function createStarryBackground() {
    // 檢查是否已經存在
    const existing = document.querySelector('.starry-background-container');
    if (existing) {
        existing.remove();
    }
    
    // 創建星空容器 - 直接插入到 body，作為背景層
    const starryContainer = document.createElement('div');
    starryContainer.className = 'starry-background-container';
    starryContainer.innerHTML = `
        <div class="starry-sky">
            <div class="stars-layer stars"></div>
            <div class="stars-layer stars1"></div>
            <div class="stars-layer stars2"></div>
        </div>
    `;
    
    // 插入到 body 開頭，作為背景層
    document.body.insertBefore(starryContainer, document.body.firstChild);
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
    // 創建背景容器
    createStarryBackground();
    
    // 動態生成星星位置
    setTimeout(() => {
        const starsLayer = document.querySelector('.stars-layer.stars');
        const stars1Layer = document.querySelector('.stars-layer.stars1');
        const stars2Layer = document.querySelector('.stars-layer.stars2');
        
        if (starsLayer && stars1Layer && stars2Layer) {
            const viewportWidth = window.innerWidth;
            const viewportHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
            const maxX = Math.max(viewportWidth, 2560);
            const maxY = Math.max(viewportHeight, 2560);
            
            // 生成不同層級的星星 - 更多星星讓背景更豐富
            starsLayer.style.boxShadow = generateStarsShadow(80, maxX, maxY);
            stars1Layer.style.boxShadow = generateStarsShadow(60, maxX, maxY);
            stars2Layer.style.boxShadow = generateStarsShadow(40, maxX, maxY);
        }
    }, 100);
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

