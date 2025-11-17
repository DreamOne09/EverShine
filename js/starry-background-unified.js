// ============================================
// 統一星空背景系統 - 類別化設計，符合物理定律
// ============================================

// ============================================
// 配置類別
// ============================================
class StarrySkyConfig {
    constructor() {
        this.canvas = {
            starDensity: 2000,
            maxStars: 1500,
            nebulaCount: 8
        };
        
        this.css = {
            // 靜態小星星層（會閃爍）- 滿天星點
            staticStars: [
                { count: 3000, size: '1px', twinkleSpeed: '3s' },
                { count: 2500, size: '1px', twinkleSpeed: '4s' },
                { count: 2000, size: '1px', twinkleSpeed: '5s' },
                { count: 1500, size: '1px', twinkleSpeed: '6s' }
            ],
            // 移動的星星層
            movingStars: [
                { count: 600, size: '2px', duration: '100s' },
                { count: 400, size: '3px', duration: '125s' }
            ],
            // 流星配置
            shootingStars: {
                minCount: 5,
                maxCount: 10,
                minSpeed: 3,  // 秒
                maxSpeed: 12, // 秒
                minTailLength: 80,  // px
                maxTailLength: 150, // px
                glowIntensity: 0.9, // 光暈強度
                tailFadeSteps: 20   // 尾巴衰減階數
            }
        };
        
        // 色彩配置 - 冷色調
        this.colors = {
            stars: {
                primary: 'rgba(255, 255, 255',      // 冷白 (70%)
                secondary: 'rgba(200, 230, 255',     // 淺藍 (20%)
                tertiary: 'rgba(169, 214, 255',      // 冷藍 (10%)
            },
            shootingStars: {
                core: 'rgba(255, 255, 255',          // 核心白色
                glow: 'rgba(135, 206, 250',         // 天藍光暈
                tail: 'rgba(176, 224, 230'          // 淺藍尾巴
            }
        };
    }
}

// ============================================
// 流星類別 - 符合物理定律
// ============================================
class ShootingStar {
    constructor(config, viewportWidth, viewportHeight) {
        this.config = config;
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        
        // 隨機角度 (0-360度)
        this.angle = Math.random() * 360;
        this.rad = (this.angle * Math.PI) / 180;
        
        // 隨機速度 (秒)
        this.duration = config.shootingStars.minSpeed + 
                       Math.random() * (config.shootingStars.maxSpeed - config.shootingStars.minSpeed);
        
        // 計算移動距離（確保穿過整個畫面）
        const diagonal = Math.sqrt(viewportWidth * viewportWidth + viewportHeight * viewportHeight);
        this.distance = diagonal * 1.3;
        
        // 速度向量
        this.velocityX = Math.cos(this.rad) * this.distance;
        this.velocityY = Math.sin(this.rad) * this.distance;
        
        // 速度大小（用於計算尾巴長度）
        this.speed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
        
        // 尾巴長度與速度成正比
        const speedRatio = this.speed / (diagonal * 1.3);
        this.tailLength = config.shootingStars.minTailLength + 
                         speedRatio * (config.shootingStars.maxTailLength - config.shootingStars.minTailLength);
        
        // 起始位置（從畫面外開始）
        this.setStartPosition();
        
        // 隨機延遲
        this.delay = Math.random() * 40;
        
        // 創建DOM元素
        this.createElement();
    }
    
    setStartPosition() {
        // 根據角度選擇起始邊緣
        if (this.angle >= 0 && this.angle < 45) {
            // 從左邊外開始
            this.startX = -150;
            this.startY = this.viewportHeight * Math.random();
        } else if (this.angle >= 45 && this.angle < 135) {
            // 從下邊外開始
            this.startX = this.viewportWidth * Math.random();
            this.startY = this.viewportHeight + 150;
        } else if (this.angle >= 135 && this.angle < 225) {
            // 從右邊外開始
            this.startX = this.viewportWidth + 150;
            this.startY = this.viewportHeight * Math.random();
        } else if (this.angle >= 225 && this.angle < 315) {
            // 從上邊外開始
            this.startX = this.viewportWidth * Math.random();
            this.startY = -150;
        } else {
            // 從左上角外開始
            this.startX = -150;
            this.startY = -150;
        }
    }
    
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'shooting-star';
        
        // 設置位置
        this.element.style.left = `${this.startX}px`;
        this.element.style.top = `${this.startY}px`;
        
        // 設置動畫屬性
        this.element.style.animationDelay = `${this.delay}s`;
        this.element.style.animationDuration = `${this.duration}s`;
        
        // 設置CSS變數
        this.element.style.setProperty('--move-x', `${this.velocityX}px`);
        this.element.style.setProperty('--move-y', `${this.velocityY}px`);
        this.element.style.setProperty('--angle', `${this.angle}deg`);
        this.element.style.setProperty('--tail-length', `${this.tailLength}px`);
        this.element.style.setProperty('--speed', `${this.speed}`);
        
        // 創建尾巴元素（使用CSS漸變模擬）
        this.createTail();
        
        document.body.appendChild(this.element);
    }
    
    createTail() {
        // 使用線性漸變創建符合物理的尾巴
        // 尾巴方向與速度向量一致
        const tailGradient = this.generateTailGradient();
        this.element.style.background = tailGradient;
    }
    
    generateTailGradient() {
        // 計算尾巴方向（與速度向量相反，因為是拖尾）
        const tailAngle = this.angle + 180; // 尾巴在流星後方
        const tailRad = (tailAngle * Math.PI) / 180;
        
        // 使用CSS線性漸變創建衰減效果
        const steps = this.config.shootingStars.tailFadeSteps;
        const colors = [];
        
        // 從核心到尾巴末端，亮度逐漸衰減
        for (let i = 0; i <= steps; i++) {
            const ratio = i / steps;
            // 使用指數衰減模擬自然衰減
            const opacity = Math.pow(1 - ratio, 2) * this.config.shootingStars.glowIntensity;
            const alpha = Math.max(0, opacity);
            
            if (i === 0) {
                // 核心：最亮
                colors.push(`${this.config.colors.shootingStars.core}, ${alpha})`);
            } else if (i < steps * 0.3) {
                // 前30%：光暈區域
                colors.push(`${this.config.colors.shootingStars.glow}, ${alpha * 0.8})`);
            } else {
                // 後70%：尾巴區域，逐漸變淡
                colors.push(`${this.config.colors.shootingStars.tail}, ${alpha * 0.5})`);
            }
        }
        
        // 計算漸變方向（與速度向量一致）
        const x1 = 50 + Math.cos(tailRad) * 50;
        const y1 = 50 + Math.sin(tailRad) * 50;
        const x2 = 50 - Math.cos(tailRad) * 50;
        const y2 = 50 - Math.sin(tailRad) * 50;
        
        // 創建線性漸變字符串
        const colorStops = colors.map((color, i) => {
            const percent = (i / steps) * 100;
            return `${color} ${percent}%`;
        }).join(', ');
        
        return `linear-gradient(${tailAngle}deg, ${colorStops})`;
    }
    
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// ============================================
// 星空管理器類別
// ============================================
class StarrySkyManager {
    constructor() {
        this.config = new StarrySkyConfig();
        this.shootingStars = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
    }
    
    // 初始化Canvas星空（Hero section）
    initCanvasSky() {
        let canvas = document.getElementById('starrySkyCanvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'starrySkyCanvas';
            canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;min-height:100vh;z-index:-3;pointer-events:none;background:transparent;display:block;';
            document.body.insertBefore(canvas, document.body.firstChild);
        }
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.nebulas = [];
        
        this.resize();
        this.createStars();
        this.createNebulas();
        this.draw();
        
        window.addEventListener('resize', () => {
            this.resize();
            this.createStars();
            this.createNebulas();
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    }
    
    createStars() {
        this.stars = [];
        const count = Math.min(
            Math.floor((this.canvas.width * this.canvas.height) / this.config.canvas.starDensity),
            this.config.canvas.maxStars
        );
        
        for (let i = 0; i < count; i++) {
            const colorRand = Math.random();
            const color = colorRand < 0.7 ? this.config.colors.stars.primary :
                          colorRand < 0.9 ? this.config.colors.stars.secondary :
                          this.config.colors.stars.tertiary;
            
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.5,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2,
                color: color
            });
        }
    }
    
    createNebulas() {
        this.nebulas = [];
        const colors = [[76, 168, 223], [110, 84, 255], [35, 150, 255], [120, 87, 255], [135, 206, 250]];
        
        for (let i = 0; i < this.config.canvas.nebulaCount; i++) {
            this.nebulas.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radiusX: Math.random() * 800 + 400,
                radiusY: Math.random() * 600 + 300,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: Math.random() * 0.15 + 0.05,
                driftSpeedX: (Math.random() - 0.5) * 0.1,
                driftSpeedY: (Math.random() - 0.5) * 0.1
            });
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 繪製星雲
        this.nebulas.forEach(n => {
            n.x += n.driftSpeedX;
            n.y += n.driftSpeedY;
            if (n.x < -n.radiusX) n.x = this.canvas.width + n.radiusX;
            if (n.x > this.canvas.width + n.radiusX) n.x = -n.radiusX;
            if (n.y < -n.radiusY) n.y = this.canvas.height + n.radiusY;
            if (n.y > this.canvas.height + n.radiusY) n.y = -n.radiusY;
            
            const g = this.ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, Math.max(n.radiusX, n.radiusY));
            g.addColorStop(0, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${n.opacity})`);
            g.addColorStop(1, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, 0)`);
            this.ctx.fillStyle = g;
            this.ctx.beginPath();
            this.ctx.ellipse(n.x, n.y, n.radiusX, n.radiusY, 0, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // 繪製星星（帶光暈效果）
        this.stars.forEach(s => {
            s.twinklePhase += s.twinkleSpeed;
            const opacity = s.opacity * (Math.sin(s.twinklePhase) * 0.3 + 0.7);
            
            // 繪製光暈
            const glowSize = s.size * 3;
            const glowGradient = this.ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowSize);
            glowGradient.addColorStop(0, `${s.color}, ${opacity * 0.8})`);
            glowGradient.addColorStop(0.5, `${s.color}, ${opacity * 0.4})`);
            glowGradient.addColorStop(1, `${s.color}, 0)`);
            
            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(s.x, s.y, glowSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 繪製核心
            this.ctx.beginPath();
            this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `${s.color}, ${opacity})`;
            this.ctx.fill();
        });
        
        this.animationId = requestAnimationFrame(() => this.draw());
    }
    
    // 初始化CSS星空（其他section）
    initCSSSky() {
        const existing = document.querySelector('.starry-background-container');
        if (existing) existing.remove();
        
        const container = document.createElement('div');
        container.className = 'starry-background-container';
        
        const sky = document.createElement('div');
        sky.className = 'starry-sky';
        
        // 創建靜態星星層
        this.config.css.staticStars.forEach((layer, i) => {
            const div = document.createElement('div');
            div.className = `static-stars-layer static-stars${i}`;
            sky.appendChild(div);
        });
        
        // 創建移動星星層
        this.config.css.movingStars.forEach((layer, i) => {
            const div = document.createElement('div');
            div.className = `moving-stars-layer moving-stars${i}`;
            sky.appendChild(div);
        });
        
        container.appendChild(sky);
        document.body.insertBefore(container, document.body.firstChild);
        
        // 生成星星位置
        setTimeout(() => {
            this.generateAllStars(sky, container);
        }, 100);
        
        // 創建流星
        this.createShootingStars();
        
        // 監聽滾動
        window.addEventListener('scroll', () => {
            const newHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
            container.style.height = `${newHeight}px`;
            sky.style.height = `${newHeight}px`;
        });
    }
    
    generateAllStars(sky, container) {
        const w = Math.max(window.innerWidth, 2560);
        const h = Math.max(document.documentElement.scrollHeight, window.innerHeight, 5000);
        
        container.style.height = `${h}px`;
        sky.style.height = `${h}px`;
        
        // 生成靜態星星
        const staticLayers = sky.querySelectorAll('.static-stars-layer');
        staticLayers.forEach((layer, i) => {
            const config = this.config.css.staticStars[i];
            layer.style.boxShadow = this.generateStaticStarsShadow(config.count, w, h);
        });
        
        // 生成移動星星
        const movingLayers = sky.querySelectorAll('.moving-stars-layer');
        movingLayers.forEach((layer, i) => {
            const config = this.config.css.movingStars[i];
            layer.style.boxShadow = this.generateMovingStarsShadow(config.count, w, h);
        });
    }
    
    generateStaticStarsShadow(count, maxX, maxY) {
        const shadows = [];
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * maxX);
            const y = Math.floor(Math.random() * maxY);
            const brightness = Math.random() * 0.3 + 0.7; // 0.7 到 1.0，更亮
            const glowSize = Math.random() * 5 + 2; // 2px 到 7px 光暈，更明顯
            
            const colorRand = Math.random();
            const color = colorRand < 0.7 ? this.config.colors.stars.primary :
                          colorRand < 0.9 ? this.config.colors.stars.secondary :
                          this.config.colors.stars.tertiary;
            
            // 雙層光暈：核心 + 外層光暈
            shadows.push(
                `${x}px ${y}px 0 0 ${color}, ${brightness})`,
                `${x}px ${y}px ${glowSize}px ${color}, ${brightness * 0.6})`
            );
        }
        return shadows.join(', ');
    }
    
    generateMovingStarsShadow(count, maxX, maxY) {
        const shadows = [];
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * maxX);
            const y = Math.floor(Math.random() * maxY);
            const brightness = Math.random() * 0.3 + 0.7;
            const glowSize = Math.random() * 4 + 2;
            
            const colorRand = Math.random();
            const color = colorRand < 0.7 ? this.config.colors.stars.primary :
                          colorRand < 0.9 ? this.config.colors.stars.secondary :
                          this.config.colors.stars.tertiary;
            
            shadows.push(
                `${x}px ${y}px 0 0 ${color}, ${brightness})`,
                `${x}px ${y}px ${glowSize}px ${color}, ${brightness * 0.6})`
            );
        }
        return shadows.join(', ');
    }
    
    createShootingStars() {
        // 清除舊的流星
        this.shootingStars.forEach(star => star.destroy());
        this.shootingStars = [];
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // 隨機數量：5-10顆
        const count = this.config.css.shootingStars.minCount + 
                     Math.floor(Math.random() * (this.config.css.shootingStars.maxCount - this.config.css.shootingStars.minCount + 1));
        
        for (let i = 0; i < count; i++) {
            const star = new ShootingStar(this.config, viewportWidth, viewportHeight);
            this.shootingStars.push(star);
        }
    }
    
    // 統一初始化
    init() {
        this.initCanvasSky();
        this.initCSSSky();
        
        // 視窗大小改變時重新創建流星
        window.addEventListener('resize', () => {
            this.createShootingStars();
        });
    }
}

// ============================================
// 初始化
// ============================================
const starrySkyManager = new StarrySkyManager();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => starrySkyManager.init());
} else {
    starrySkyManager.init();
}
