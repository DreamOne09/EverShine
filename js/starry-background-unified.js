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
            // 靜態小星星層 - 增加數量確保滿天星效果
            // 使用純白色 #FFF，格式：xpx ypx #FFF
            staticStars: [
                { count: 200, size: '1px', animationDuration: '100s' },  // 第一層：200顆
                { count: 180, size: '1px', animationDuration: '125s' },  // 第二層：180顆（:after 會再增加）
                { count: 160, size: '1px', animationDuration: '175s' },  // 第三層：160顆
                { count: 140, size: '1px', animationDuration: '200s' },  // 第四層：140顆（:after 會再增加）
            ],
            // 移動的星星層（增加數量）
            movingStars: [
                { count: 120, size: '2px', duration: '125s' },   // stars1: 2px, 125s, 120顆
                { count: 100, size: '3px', duration: '175s' },   // stars2: 3px, 175s, 100顆
            ],
            // 流星配置（減少數量，間隔更長）
            shootingStars: {
                minCount: 2,     // 減少為 2-3 顆流星
                maxCount: 3,
                minSpeed: 10,    // 增加速度（讓流星快一點消失）
                maxSpeed: 18,
                minTailLength: 85,
                maxTailLength: 150,
                glowIntensity: 1.0,
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
// 流星類別（參考代碼風格）
// ============================================
class ShootingStar {
    constructor(config, viewportWidth, viewportHeight) {
        this.config = config;
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        
        // 參考代碼風格：簡單的配置
        const shootingStarsConfig = config.css?.shootingStars || {
            minSpeed: 8,
            maxSpeed: 15
        };
        
        // 每顆流星不同的動畫時長和延遲，創造自然效果
        this.duration = shootingStarsConfig.minSpeed + Math.random() * (shootingStarsConfig.maxSpeed - shootingStarsConfig.minSpeed);
        this.delay = Math.random() * this.duration; // 隨機延遲，避免同時出現
        
        this.createElement();
    }
    
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'shooting-star';
        
        // 流星從視窗外下方開始，隨機水平位置
        this.element.style.bottom = '-200px';
        this.element.style.right = `${Math.random() * 100}%`;
        this.element.style.animationDelay = `${this.delay}s`;
        this.element.style.animationDuration = `${this.duration}s`;
        
        // 參考代碼：使用 linear-gradient 創建尾巴
        this.element.style.background = 'linear-gradient(to top, rgba(255, 255, 255, 0), white)';
        
        // 添加到 body（讓流星保持在固定的 z-index 層級）
        document.body.appendChild(this.element);
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
        
        // 創建容器 - 確保在最底層
        const container = document.createElement('div');
        container.className = 'starry-background-container';
        container.style.cssText = 'position:fixed!important;top:0!important;left:0!important;width:100%!important;height:100%!important;min-height:100vh!important;z-index:-10!important;pointer-events:none!important;overflow:visible!important;background:transparent!important;';
        
        const sky = document.createElement('div');
        sky.className = 'starry-sky';
        sky.style.cssText = 'position:absolute!important;top:0!important;left:0!important;width:100%!important;height:100%!important;min-height:100vh!important;z-index:-2!important;';
        
        // 創建靜態星星層
        this.config.css.staticStars.forEach((layer, i) => {
            const div = document.createElement('div');
            div.className = `static-stars-layer static-stars${i}`;
            div.style.cssText = `position:absolute!important;top:0!important;left:0!important;width:1px!important;height:1px!important;border-radius:50%!important;background:transparent!important;z-index:-2!important;opacity:1!important;visibility:visible!important;display:block!important;overflow:visible!important;pointer-events:none!important;filter:brightness(1.5) contrast(1.3)!important;`;
            sky.appendChild(div);
        });
        
        // 創建移動星星層
        this.config.css.movingStars.forEach((layer, i) => {
            const div = document.createElement('div');
            div.className = `moving-stars-layer moving-stars${i}`;
            div.style.cssText = `position:absolute!important;top:0!important;left:0!important;width:${layer.size}!important;height:${layer.size}!important;border-radius:50%!important;background:transparent!important;z-index:-2!important;opacity:1!important;visibility:visible!important;display:block!important;overflow:visible!important;pointer-events:none!important;filter:brightness(1.5) contrast(1.3)!important;`;
            sky.appendChild(div);
        });
        
        container.appendChild(sky);
        document.body.insertBefore(container, document.body.firstChild);
        
        console.log('✅ 星空容器已創建，準備生成星星...');
        
        // 確保DOM已插入後再生成星星 - 使用多重延遲確保DOM完全準備好
        setTimeout(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.generateAllStars(sky, container);
                });
            });
        }, 100);
        
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
                const shadowAfter = this.generateStaticStarsShadow(this.config.css.staticStars[i].count, w, h);
                if (shadow && shadow.length > 0) {
                    // 參考代碼：直接設置 box-shadow
                    // 注意：星星層本身是 2px，box-shadow 會自動擴展到整個容器範圍
                    layer.style.boxShadow = shadow;
                    // 參考代碼：使用 :after 偽元素增加星星數量
                    // 通過 CSS 變數傳遞給 :after
                    layer.style.setProperty('--shadow-after', shadowAfter);
                    // 確保可見（星星層本身是 1px，box-shadow 會顯示星星）
                    layer.style.opacity = '1';
                    layer.style.visibility = 'visible';
                    layer.style.display = 'block';
                    layer.style.width = '1px';
                    layer.style.height = '1px';
                    layer.style.borderRadius = '50%';
                    layer.style.background = 'transparent';
                    console.log(`靜態星星層 ${i}: box-shadow 已設置，長度 ${shadow.length} 字符，前50字符: ${shadow.substring(0, 50)}`);
                } else {
                    console.error(`靜態星星層 ${i}: 無法生成 box-shadow，shadow: ${shadow}`);
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
                const shadowAfter = this.generateMovingStarsShadow(this.config.css.movingStars[i].count, w, h);
                if (shadow && shadow.length > 0) {
                    // 參考代碼：直接設置 box-shadow
                    // 注意：星星層本身是 2px/3px，box-shadow 會自動擴展到整個容器範圍
                    layer.style.boxShadow = shadow;
                    // 參考代碼：使用 :after 偽元素增加星星數量
                    // 通過 CSS 變數傳遞給 :after
                    layer.style.setProperty('--shadow-after', shadowAfter);
                    // 確保可見（星星層本身保持 2px/3px，box-shadow 會顯示星星）
                    layer.style.opacity = '1';
                    layer.style.visibility = 'visible';
                    layer.style.display = 'block';
                    console.log(`移動星星層 ${i}: box-shadow 已設置，長度 ${shadow.length} 字符，前50字符: ${shadow.substring(0, 50)}`);
                } else {
                    console.error(`移動星星層 ${i}: 無法生成 box-shadow，shadow: ${shadow}`);
                }
            }
        });
        
        console.log('星空背景：已生成', staticLayers.length, '層靜態星星和', movingLayers.length, '層移動星星');
    }
    
    generateStaticStarsShadow(count, maxX, maxY) {
        const shadows = [];
        const actualCount = count;
        
        for (let i = 0; i < actualCount; i++) {
            const x = Math.floor(Math.random() * maxX);
            const y = Math.floor(Math.random() * maxY);
            // 使用純白色星星，加大發光效果確保可見
            shadows.push(`${x}px ${y}px 0 2px rgba(255, 255, 255, 1), ${x}px ${y}px 0 4px rgba(255, 255, 255, 0.5)`);
        }
        
        const result = shadows.join(' , ');
        console.log(`生成 ${actualCount} 顆靜態星星，box-shadow 長度: ${result.length} 字符`);
        return result;
    }
    
    generateMovingStarsShadow(count, maxX, maxY) {
        const shadows = [];
        const actualCount = count;
        
        for (let i = 0; i < actualCount; i++) {
            const x = Math.floor(Math.random() * maxX);
            const y = Math.floor(Math.random() * maxY);
            // 使用純白色星星，加大發光效果確保可見
            shadows.push(`${x}px ${y}px 0 3px rgba(255, 255, 255, 1), ${x}px ${y}px 0 6px rgba(255, 255, 255, 0.4)`);
        }
        
        const result = shadows.join(' , ');
        console.log(`生成 ${actualCount} 顆移動星星，box-shadow 長度: ${result.length} 字符`);
        return result;
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
