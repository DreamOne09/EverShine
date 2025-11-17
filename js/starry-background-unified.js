// ============================================
// 統一星空背景系統 - 優化效能版本
// ============================================

// 配置常數
const CONFIG = {
    canvas: {
        starDensity: 2000,
        maxStars: 1500,
        nebulaCount: 8
    },
    css: {
        // 靜態小星星層（會閃爍）- 大幅增加數量以達到滿天星點
        staticStars: [
            { count: 2500, size: '1px', twinkleSpeed: '3s' },
            { count: 2000, size: '1px', twinkleSpeed: '4s' },
            { count: 1500, size: '1px', twinkleSpeed: '5s' },
            { count: 1000, size: '1px', twinkleSpeed: '6s' }
        ],
        // 移動的星星層
        movingStars: [
            { count: 500, size: '2px', duration: '100s' },
            { count: 300, size: '3px', duration: '125s' }
        ],
        shootingStarCount: 8 // 減少流星數量，但增加光暈效果
    }
};

// 統一初始化函數
function initStarryBackground() {
    // Hero section 使用 Canvas 星空
    initCanvasSky();
    
    // 其他 section 使用 CSS 星空 + 流星
    initCSSSky();
}

// Canvas 星空（Hero section）
function initCanvasSky() {
    let canvas = document.getElementById('starrySkyCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'starrySkyCanvas';
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;min-height:100vh;z-index:-3;pointer-events:none;background:transparent;display:block;';
        document.body.insertBefore(canvas, document.body.firstChild);
    }
    
    const ctx = canvas.getContext('2d');
    let stars = [];
    let nebulas = [];
    let animationId = null;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    }
    
    function createStars() {
        stars = [];
        const count = Math.min(
            Math.floor((canvas.width * canvas.height) / CONFIG.canvas.starDensity),
            CONFIG.canvas.maxStars
        );
        
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.5,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2,
                color: Math.random() < 0.6 ? 'rgba(255, 255, 255' : 
                       Math.random() < 0.85 ? 'rgba(200, 230, 255' : 'rgba(169, 214, 255'
            });
        }
    }
    
    function createNebulas() {
        nebulas = [];
        const colors = [[76, 168, 223], [110, 84, 255], [35, 150, 255], [120, 87, 255], [135, 206, 250]];
        
        for (let i = 0; i < CONFIG.canvas.nebulaCount; i++) {
            nebulas.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radiusX: Math.random() * 800 + 400,
                radiusY: Math.random() * 600 + 300,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: Math.random() * 0.15 + 0.05,
                driftSpeedX: (Math.random() - 0.5) * 0.1,
                driftSpeedY: (Math.random() - 0.5) * 0.1
            });
        }
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 繪製星雲
        nebulas.forEach(n => {
            n.x += n.driftSpeedX;
            n.y += n.driftSpeedY;
            if (n.x < -n.radiusX) n.x = canvas.width + n.radiusX;
            if (n.x > canvas.width + n.radiusX) n.x = -n.radiusX;
            if (n.y < -n.radiusY) n.y = canvas.height + n.radiusY;
            if (n.y > canvas.height + n.radiusY) n.y = -n.radiusY;
            
            const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, Math.max(n.radiusX, n.radiusY));
            g.addColorStop(0, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${n.opacity})`);
            g.addColorStop(1, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, 0)`);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.ellipse(n.x, n.y, n.radiusX, n.radiusY, 0, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // 繪製星星
        stars.forEach(s => {
            s.twinklePhase += s.twinkleSpeed;
            const opacity = s.opacity * (Math.sin(s.twinklePhase) * 0.3 + 0.7);
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fillStyle = `${s.color}, ${opacity})`;
            ctx.fill();
        });
        
        animationId = requestAnimationFrame(draw);
    }
    
    resize();
    createStars();
    createNebulas();
    draw();
    
    window.addEventListener('resize', () => {
        resize();
        createStars();
        createNebulas();
    });
}

// CSS 星空 + 流星（其他 section）
function initCSSSky() {
    const existing = document.querySelector('.starry-background-container');
    if (existing) existing.remove();
    
    const container = document.createElement('div');
    container.className = 'starry-background-container';
    
    const sky = document.createElement('div');
    sky.className = 'starry-sky';
    
    // 創建靜態小星星層（會閃爍）
    CONFIG.css.staticStars.forEach((layer, i) => {
        const div = document.createElement('div');
        div.className = `static-stars-layer static-stars${i}`;
        sky.appendChild(div);
    });
    
    // 創建移動的星星層
    CONFIG.css.movingStars.forEach((layer, i) => {
        const div = document.createElement('div');
        div.className = `moving-stars-layer moving-stars${i}`;
        sky.appendChild(div);
    });
    
    container.appendChild(sky);
    document.body.insertBefore(container, document.body.firstChild);
    
    // 生成星星位置
    setTimeout(() => {
        generateAllStars(sky, container);
    }, 100);
    
    // 創建流星 - 360度隨機方向
    createShootingStars();
    
    // 監聽滾動，動態更新高度
    window.addEventListener('scroll', () => {
        const newHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
        container.style.height = `${newHeight}px`;
        sky.style.height = `${newHeight}px`;
    });
}

// 生成所有星星
function generateAllStars(sky, container) {
    const w = Math.max(window.innerWidth, 2560);
    const h = Math.max(document.documentElement.scrollHeight, window.innerHeight, 5000);
    
    container.style.height = `${h}px`;
    sky.style.height = `${h}px`;
    
    // 生成靜態星星
    const staticLayers = sky.querySelectorAll('.static-stars-layer');
    staticLayers.forEach((layer, i) => {
        const config = CONFIG.css.staticStars[i];
        layer.style.boxShadow = generateStaticStarsShadow(config.count, w, h);
    });
    
    // 生成移動星星
    const movingLayers = sky.querySelectorAll('.moving-stars-layer');
    movingLayers.forEach((layer, i) => {
        const config = CONFIG.css.movingStars[i];
        layer.style.boxShadow = generateMovingStarsShadow(config.count, w, h);
    });
}

// 生成靜態星星（會閃爍）- 增加光暈效果
function generateStaticStarsShadow(count, maxX, maxY) {
    const shadows = [];
    for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);
        const brightness = Math.random() * 0.5 + 0.5; // 0.5 到 1.0，更亮
        const glowSize = Math.random() * 3 + 1; // 1px 到 4px 光暈
        
        // 小星星，有明顯光暈效果（雙層光暈）
        const color = Math.random() < 0.7 ? '255, 255, 255' : 
                      Math.random() < 0.9 ? '200, 230, 255' : '169, 214, 255';
        shadows.push(`${x}px ${y}px ${glowSize}px rgba(${color}, ${brightness})`);
    }
    return shadows.join(', ');
}

// 生成移動星星
function generateMovingStarsShadow(count, maxX, maxY) {
    const shadows = [];
    for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);
        const brightness = Math.random() * 0.3 + 0.7;
        const glowSize = Math.random() * 2 + 2; // 2px 到 4px 光暈
        
        shadows.push(`${x}px ${y}px ${glowSize}px rgba(255, 255, 255, ${brightness})`);
    }
    return shadows.join(', ');
}

// 創建流星 - 360度隨機方向，不同速度
function createShootingStars() {
    // 清除舊的流星
    document.querySelectorAll('.shooting-stars').forEach(el => el.remove());
    
    for (let i = 0; i < CONFIG.css.shootingStarCount; i++) {
        const div = document.createElement('div');
        div.className = 'shooting-stars';
        
        // 隨機起始位置（0% 到 100%）
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        
        // 360度隨機角度
        const angle = Math.random() * 360;
        
        // 計算移動距離（vh單位）- 不同方向不同距離
        const distance = 120 + Math.random() * 180; // 120-300vh，更長的距離
        const rad = (angle * Math.PI) / 180;
        const moveX = Math.cos(rad) * distance;
        const moveY = Math.sin(rad) * distance;
        
        // 隨機延遲時間（0 到 40 秒）
        const randomDelay = Math.random() * 40;
        
        // 隨機動畫持續時間（3 到 12 秒）- 不同速度
        const randomDuration = Math.random() * 9 + 3;
        
        // 設置樣式
        div.style.left = `${startX}%`;
        div.style.top = `${startY}%`;
        div.style.animationDelay = `${randomDelay}s`;
        div.style.animationDuration = `${randomDuration}s`;
        div.style.setProperty('--move-x', `${moveX}vh`);
        div.style.setProperty('--move-y', `${moveY}vh`);
        div.style.setProperty('--angle', `${angle}deg`);
        
        document.body.appendChild(div);
    }
}

// 統一初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStarryBackground);
} else {
    initStarryBackground();
}
