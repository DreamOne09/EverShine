// ============================================
// 統一星空背景系統 - DRY & KISS 原則
// ============================================

// 配置常數
const CONFIG = {
    canvas: {
        starDensity: 2000, // 每2000像素一個星星（增加密度）
        maxStars: 1500, // 增加最大星星數
        nebulaCount: 8 // 增加星雲數量
    },
    css: {
        starLayers: [
            { count: 4000, size: '1px', duration: '100s' },
            { count: 3000, size: '2px', duration: '125s' },
            { count: 2000, size: '3px', duration: '175s' },
            { count: 1500, size: '1px', duration: '150s' }
        ],
        shootingStarCount: 12 // 流星數量
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
    
    // 創建星星層
    CONFIG.css.starLayers.forEach((layer, i) => {
        const div = document.createElement('div');
        div.className = `stars-layer stars${i === 0 ? '' : i}`;
        sky.appendChild(div);
    });
    
    container.appendChild(sky);
    document.body.insertBefore(container, document.body.firstChild);
    
    // 創建流星 - 直接添加到 body，不受容器 z-index 限制
    // 為每個流星設置完全隨機的起始位置和延遲時間
    for (let i = 0; i < CONFIG.css.shootingStarCount; i++) {
        const div = document.createElement('div');
        div.className = 'shooting-stars';
        
        // 完全隨機的起始位置（0% 到 100%），不限制重複
        const randomRight = Math.random() * 100;
        
        // 隨機延遲時間（0 到 25 秒），讓流星更隨機出現
        const randomDelay = Math.random() * 25;
        
        // 隨機動畫持續時間（6 到 18 秒），讓速度更隨機
        const randomDuration = Math.random() * 12 + 6;
        
        // 隨機起始角度（-30度到-60度），讓流星軌跡更多樣
        const randomAngle = Math.random() * 30 - 60;
        
        // 設置樣式
        div.style.right = `${randomRight}%`;
        div.style.animationDelay = `${randomDelay}s`;
        div.style.animationDuration = `${randomDuration}s`;
        div.style.setProperty('--shooting-angle', `${randomAngle}deg`);
        
        document.body.appendChild(div);
    }
    
    // 生成星星位置 - 確保覆蓋整個頁面
    setTimeout(() => {
        const layers = sky.querySelectorAll('.stars-layer');
        const w = Math.max(window.innerWidth, 2560);
        const h = Math.max(document.documentElement.scrollHeight, window.innerHeight, 5000);
        
        // 更新容器高度以覆蓋整個頁面
        container.style.height = `${Math.max(document.documentElement.scrollHeight, window.innerHeight)}px`;
        sky.style.height = `${Math.max(document.documentElement.scrollHeight, window.innerHeight)}px`;
        
        layers.forEach((layer, i) => {
            const config = CONFIG.css.starLayers[i];
            layer.style.boxShadow = generateStarsShadow(config.count, w, h);
        });
    }, 100);
    
    // 監聽滾動，動態更新高度
    window.addEventListener('scroll', () => {
        const newHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
        container.style.height = `${newHeight}px`;
        sky.style.height = `${newHeight}px`;
    });
}

// 生成星星 box-shadow
function generateStarsShadow(count, maxX, maxY) {
    const shadows = [];
    for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);
        // 增加亮度範圍：0.7 到 1.0，讓星星更明顯
        const brightness = Math.random() * 0.3 + 0.7;
        // 增加光暈大小：2px 到 5px，讓星星更明顯
        const size = Math.random() * 3 + 2;
        // 使用更亮的白色和藍色星星混合
        const colorType = Math.random();
        let color;
        if (colorType < 0.7) {
            // 70% 是純白色星星
            color = `rgba(255, 255, 255, ${brightness})`;
        } else if (colorType < 0.9) {
            // 20% 是藍白色星星
            color = `rgba(200, 230, 255, ${brightness})`;
        } else {
            // 10% 是藍色星星
            color = `rgba(169, 214, 255, ${brightness})`;
        }
        shadows.push(`${x}px ${y}px ${size}px ${color}, ${x}px ${y}px ${size * 2}px ${color.replace(/[\d\.]+\)$/, '0.3)')}`);
    }
    return shadows.join(', ');
}

// 統一初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStarryBackground);
} else {
    initStarryBackground();
}

