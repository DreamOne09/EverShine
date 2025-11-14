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
            { count: 150, size: '1px', duration: '100s' },
            { count: 120, size: '2px', duration: '125s' },
            { count: 80, size: '3px', duration: '175s' }
        ],
        shootingStarCount: 5 // 增加流星數量
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
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;min-height:100vh;z-index:-3;pointer-events:none;background:transparent;';
        document.body.appendChild(canvas);
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
    
    // 創建流星
    for (let i = 0; i < CONFIG.css.shootingStarCount; i++) {
        const div = document.createElement('div');
        div.className = 'shooting-stars';
        sky.appendChild(div);
    }
    
    container.appendChild(sky);
    document.body.insertBefore(container, document.body.firstChild);
    
    // 生成星星位置
    setTimeout(() => {
        const layers = sky.querySelectorAll('.stars-layer');
        const w = Math.max(window.innerWidth, 2560);
        const h = Math.max(document.documentElement.scrollHeight, window.innerHeight);
        
        layers.forEach((layer, i) => {
            const config = CONFIG.css.starLayers[i];
            layer.style.boxShadow = generateStarsShadow(config.count, w, h);
        });
    }, 100);
}

// 生成星星 box-shadow
function generateStarsShadow(count, maxX, maxY) {
    const shadows = [];
    for (let i = 0; i < count; i++) {
        shadows.push(`${Math.floor(Math.random() * maxX)}px ${Math.floor(Math.random() * maxY)}px #FFF`);
    }
    return shadows.join(', ');
}

// 統一初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStarryBackground);
} else {
    initStarryBackground();
}

