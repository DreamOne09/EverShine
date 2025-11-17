// ============================================
// 統一星空背景系統 - 重構版本（遵循DRY和KISS原則）
// ============================================

/**
 * 星空背景系統架構說明：
 * 
 * 1. Canvas星空（Hero section）：
 *    - 使用Canvas API繪製星星和星雲
 *    - 星星帶有光暈效果和閃爍動畫
 *    - 星雲有飄移動畫
 * 
 * 2. CSS星空（其他sections）：
 *    - 使用box-shadow生成大量星星（性能優化）
 *    - 靜態星星層：會閃爍的小星星
 *    - 移動星星層：緩慢移動的星星
 *    - 流星：符合物理定律的拖曳尾巴
 * 
 * 3. 設計原則：
 *    - DRY (Don't Repeat Yourself)：配置集中管理
 *    - KISS (Keep It Simple, Stupid)：簡單清晰的實現
 */

// ============================================
// 配置類別 - 集中管理所有配置
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
                minSpeed: 3,
                maxSpeed: 12,
                minTailLength: 80,
                maxTailLength: 150,
                glowIntensity: 0.9,
                tailFadeSteps: 20
            }
        };
        
        // 色彩配置 - 冷色調
        this.colors = {
            stars: {
                primary: 'rgba(255, 255, 255',
                secondary: 'rgba(200, 230, 255',
                tertiary: 'rgba(169, 214, 255',
            },
            shootingStars: {
                core: 'rgba(255, 255, 255',
                glow: 'rgba(135, 206, 250',
                tail: 'rgba(176, 224, 230'
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
        
        // 安全訪問配置
        const shootingStarsConfig = config.css?.shootingStars || {
            minSpeed: 3,
            maxSpeed: 12,
            minTailLength: 80,
            maxTailLength: 150,
            glowIntensity: 0.9,
            tailFadeSteps: 20
        };
        
        this.angle = Math.random() * 360;
        this.rad = (this.angle * Math.PI) / 180;
        
        this.duration = shootingStarsConfig.minSpeed + 
                       Math.random() * (shootingStarsConfig.maxSpeed - shootingStarsConfig.minSpeed);
        
        const diagonal = Math.sqrt(viewportWidth * viewportWidth + viewportHeight * viewportHeight);
        this.distance = diagonal * 1.3;
        
        this.velocityX = Math.cos(this.rad) * this.distance;
        this.velocityY = Math.sin(this.rad) * this.distance;
        this.speed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
        
        const speedRatio = this.speed / (diagonal * 1.3);
        this.tailLength = shootingStarsConfig.minTailLength + 
                         speedRatio * (shootingStarsConfig.maxTailLength - shootingStarsConfig.minTailLength);
        
        this.shootingStarsConfig = shootingStarsConfig;
        
        this.setStartPosition();
        this.delay = Math.random() * 40;
        this.createElement();
    }
    
    setStartPosition() {
        if (this.angle >= 0 && this.angle < 45) {
            this.startX = -150;
            this.startY = this.viewportHeight * Math.random();
        } else if (this.angle >= 45 && this.angle < 135) {
            this.startX = this.viewportWidth * Math.random();
            this.startY = this.viewportHeight + 150;
        } else if (this.angle >= 135 && this.angle < 225) {
            this.startX = this.viewportWidth + 150;
            this.startY = this.viewportHeight * Math.random();
        } else if (this.angle >= 225 && this.angle < 315) {
            this.startX = this.viewportWidth * Math.random();
            this.startY = -150;
        } else {
            this.startX = -150;
            this.startY = -150;
        }
    }
    
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'shooting-star';
        
        this.element.style.left = `${this.startX}px`;
        this.element.style.top = `${this.startY}px`;
        this.element.style.animationDelay = `${this.delay}s`;
        this.element.style.animationDuration = `${this.duration}s`;
        this.element.style.setProperty('--move-x', `${this.velocityX}px`);
        this.element.style.setProperty('--move-y', `${this.velocityY}px`);
        this.element.style.setProperty('--angle', `${this.angle}deg`);
        this.element.style.setProperty('--tail-length', `${this.tailLength}px`);
        this.element.style.setProperty('--duration', `${this.duration}s`);
        
        this.createTail();
        document.body.appendChild(this.element);
    }
    
    createTail() {
        const tailGradient = this.generateTailGradient();
        this.element.style.background = tailGradient;
    }
    
    generateTailGradient() {
        const tailAngle = this.angle + 180;
        const steps = this.shootingStarsConfig.tailFadeSteps || 20;
        const glowIntensity = this.shootingStarsConfig.glowIntensity || 0.9;
        const colors = [];
        
        // 安全訪問顏色配置
        const colorsConfig = this.config.colors?.shootingStars || {
            core: 'rgba(255, 255, 255',
            glow: 'rgba(135, 206, 250',
            tail: 'rgba(176, 224, 230'
        };
        
        for (let i = 0; i <= steps; i++) {
            const ratio = i / steps;
            const opacity = Math.pow(1 - ratio, 2) * glowIntensity;
            const alpha = Math.max(0, opacity);
            
            if (i === 0) {
                colors.push(`${colorsConfig.core}, ${alpha})`);
            } else if (i < steps * 0.3) {
                colors.push(`${colorsConfig.glow}, ${alpha * 0.8})`);
            } else {
                colors.push(`${colorsConfig.tail}, ${alpha * 0.5})`);
            }
        }
        
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
// 星空管理器類別 - 統一管理
// ============================================
class StarrySkyManager {
    constructor() {
        this.config = new StarrySkyConfig();
        this.shootingStars = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isInitialized = false;
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
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    }
    
    createStars() {
        if (!this.canvas) return;
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
        if (!this.canvas) return;
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
        if (!this.canvas || !this.ctx) return;
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
            
            const glowSize = s.size * 3;
            const glowGradient = this.ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowSize);
            glowGradient.addColorStop(0, `${s.color}, ${opacity * 0.8})`);
            glowGradient.addColorStop(0.5, `${s.color}, ${opacity * 0.4})`);
            glowGradient.addColorStop(1, `${s.color}, 0)`);
            
            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(s.x, s.y, glowSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `${s.color}, ${opacity})`;
            this.ctx.fill();
        });
        
        this.animationId = requestAnimationFrame(() => this.draw());
    }
    
    // 初始化CSS星空（其他section）- 重構版本
    initCSSSky() {
        // 清除舊的容器
        const existing = document.querySelector('.starry-background-container');
        if (existing) {
            existing.remove();
        }
        
        // 創建容器
        const container = document.createElement('div');
        container.className = 'starry-background-container';
        container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;min-height:100vh;z-index:-1;pointer-events:none;overflow:visible;background:transparent;';
        
        const sky = document.createElement('div');
        sky.className = 'starry-sky';
        sky.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;min-height:100vh;';
        
        // 創建靜態星星層
        this.config.css.staticStars.forEach((layer, i) => {
            const div = document.createElement('div');
            div.className = `static-stars-layer static-stars${i}`;
            div.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:transparent;z-index:1;';
            sky.appendChild(div);
        });
        
        // 創建移動星星層
        this.config.css.movingStars.forEach((layer, i) => {
            const div = document.createElement('div');
            div.className = `moving-stars-layer moving-stars${i}`;
            div.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:transparent;z-index:1;';
            sky.appendChild(div);
        });
        
        container.appendChild(sky);
        document.body.insertBefore(container, document.body.firstChild);
        
        // 確保DOM已插入後再生成星星 - 使用多重延遲確保DOM完全準備好
        setTimeout(() => {
            requestAnimationFrame(() => {
                this.generateAllStars(sky, container);
            });
        }, 200);
        
        // 創建流星
        this.createShootingStars();
        
        // 監聽滾動和視窗大小變化
        let resizeTimeout;
        const updateHeight = () => {
            const newHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
            container.style.height = `${newHeight}px`;
            sky.style.height = `${newHeight}px`;
        };
        
        window.addEventListener('scroll', updateHeight);
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateHeight();
                this.generateAllStars(sky, container);
                this.createShootingStars();
            }, 250);
        });
    }
    
    generateAllStars(sky, container) {
        if (!sky || !container) return;
        
        const w = Math.max(window.innerWidth, 2560);
        const h = Math.max(document.documentElement.scrollHeight, window.innerHeight, 5000);
        
        container.style.height = `${h}px`;
        sky.style.height = `${h}px`;
        
        // 生成靜態星星
        const staticLayers = sky.querySelectorAll('.static-stars-layer');
        if (staticLayers.length === 0) {
            console.warn('星空背景：找不到靜態星星層');
            return;
        }
        
        staticLayers.forEach((layer, i) => {
            if (this.config.css.staticStars[i]) {
                const shadow = this.generateStaticStarsShadow(this.config.css.staticStars[i].count, w, h);
                if (shadow) {
                    layer.style.boxShadow = shadow;
                    // 確保可見
                    layer.style.opacity = '1';
                    layer.style.visibility = 'visible';
                    layer.style.display = 'block';
                    layer.style.width = '100%';
                    layer.style.height = '100%';
                    console.log(`靜態星星層 ${i}: box-shadow 已設置，長度 ${shadow.length} 字符`);
                } else {
                    console.error(`靜態星星層 ${i}: 無法生成 box-shadow`);
                }
            }
        });
        
        // 生成移動星星
        const movingLayers = sky.querySelectorAll('.moving-stars-layer');
        if (movingLayers.length === 0) {
            console.warn('星空背景：找不到移動星星層');
            return;
        }
        
        movingLayers.forEach((layer, i) => {
            if (this.config.css.movingStars[i]) {
                const shadow = this.generateMovingStarsShadow(this.config.css.movingStars[i].count, w, h);
                if (shadow) {
                    layer.style.boxShadow = shadow;
                    // 確保可見
                    layer.style.opacity = '1';
                    layer.style.visibility = 'visible';
                    layer.style.display = 'block';
                    layer.style.width = '100%';
                    layer.style.height = '100%';
                    console.log(`移動星星層 ${i}: box-shadow 已設置`);
                } else {
                    console.error(`移動星星層 ${i}: 無法生成 box-shadow`);
                }
            }
        });
        
        console.log('星空背景：已生成', staticLayers.length, '層靜態星星和', movingLayers.length, '層移動星星');
    }
    
    generateStaticStarsShadow(count, maxX, maxY) {
        const shadows = [];
        // 限制數量以避免過長的字符串（瀏覽器限制）
        const actualCount = Math.min(count, 2000); // 每層最多2000顆，避免性能問題
        
        for (let i = 0; i < actualCount; i++) {
            const x = Math.floor(Math.random() * maxX);
            const y = Math.floor(Math.random() * maxY);
            const brightness = Math.random() * 0.2 + 0.8; // 0.8 到 1.0，更亮
            const glowSize = Math.random() * 8 + 4; // 4px 到 12px，更大的光暈
            
            // 主要使用白色，少數使用藍白色
            const colorRand = Math.random();
            const color = colorRand < 0.85 ? 'rgba(255, 255, 255' :  // 85% 純白色
                          colorRand < 0.95 ? 'rgba(200, 230, 255' :  // 10% 淺藍白
                          'rgba(169, 214, 255';  // 5% 冷藍
            
            // 三層光暈：核心點（較大）+ 中層光暈 + 外層光暈（更大）
            const coreSize = 2; // 核心點大小
            shadows.push(
                `${x}px ${y}px 0 ${coreSize}px ${color}, ${brightness})`,  // 核心點
                `${x}px ${y}px 0 ${coreSize + 2}px ${color}, ${brightness * 0.8})`,  // 中層
                `${x}px ${y}px ${glowSize}px ${color}, ${brightness * 0.5})`  // 外層光暈
            );
        }
        
        const result = shadows.join(', ');
        console.log(`生成 ${actualCount} 顆靜態星星（白色為主），box-shadow 長度: ${result.length} 字符`);
        return result;
    }
    
    generateMovingStarsShadow(count, maxX, maxY) {
        const shadows = [];
        const actualCount = Math.min(count, 500); // 每層最多500顆
        
        for (let i = 0; i < actualCount; i++) {
            const x = Math.floor(Math.random() * maxX);
            const y = Math.floor(Math.random() * maxY);
            const brightness = Math.random() * 0.2 + 0.8; // 0.8 到 1.0，更亮
            const glowSize = Math.random() * 6 + 3; // 3px 到 9px，更大的光暈
            
            // 主要使用白色
            const colorRand = Math.random();
            const color = colorRand < 0.85 ? 'rgba(255, 255, 255' :  // 85% 純白色
                          colorRand < 0.95 ? 'rgba(200, 230, 255' :  // 10% 淺藍白
                          'rgba(169, 214, 255';  // 5% 冷藍
            
            const coreSize = 2;
            shadows.push(
                `${x}px ${y}px 0 ${coreSize}px ${color}, ${brightness})`,
                `${x}px ${y}px 0 ${coreSize + 2}px ${color}, ${brightness * 0.8})`,
                `${x}px ${y}px ${glowSize}px ${color}, ${brightness * 0.5})`
            );
        }
        
        console.log(`生成 ${actualCount} 顆移動星星（白色為主）`);
        return shadows.join(', ');
    }
    
    createShootingStars() {
        this.shootingStars.forEach(star => star.destroy());
        this.shootingStars = [];
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        const count = this.config.css.shootingStars.minCount + 
                     Math.floor(Math.random() * (this.config.css.shootingStars.maxCount - this.config.css.shootingStars.minCount + 1));
        
        for (let i = 0; i < count; i++) {
            const star = new ShootingStar(this.config, viewportWidth, viewportHeight);
            this.shootingStars.push(star);
        }
    }
    
    // 統一初始化
    init() {
        if (this.isInitialized) {
            console.warn('星空背景：已經初始化，跳過重複初始化');
            return;
        }
        
        try {
            this.initCanvasSky();
            this.initCSSSky();
            this.isInitialized = true;
            console.log('星空背景：初始化完成');
        } catch (error) {
            console.error('星空背景：初始化失敗', error);
        }
    }
}

// ============================================
// 初始化
// ============================================
const starrySkyManager = new StarrySkyManager();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        starrySkyManager.init();
    });
} else {
    starrySkyManager.init();
}
