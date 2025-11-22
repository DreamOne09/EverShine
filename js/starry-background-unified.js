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
            starDensity: 2500, // 減少星星數量 (Higher value = fewer stars)
            maxStars: 400, // 限制最大數量
            nebulaCount: 3 // 減少星雲數量
        };

        this.css = {
            // 靜態小星星層 - 減少數量但增加清晰度
            staticStars: [
                { count: 150, size: '1.5px', animationDuration: '100s' },
                { count: 100, size: '2px', animationDuration: '125s' },
            ],
            // 移動的星星層
            movingStars: [
                { count: 50, size: '2px', duration: '150s' },
                { count: 30, size: '3px', duration: '200s' },
            ],
            // 流星配置 - 減少數量，全螢幕
            shootingStars: {
                minCount: 1,
                maxCount: 1, // 一次最多一顆
                minSpeed: 15,
                maxSpeed: 30,
                minTailLength: 100,
                maxTailLength: 200,
                glowIntensity: 1.5,
                tailFadeSteps: 20,
                spawnInterval: 5000  // 降低頻率 (5s)
            }
        };

        // 色彩配置 - Premium Gold & Deep Blue
        this.colors = {
            stars: {
                primary: 'rgba(255, 255, 255',
                secondary: 'rgba(200, 230, 255', // Brighter Blue tint
                tertiary: 'rgba(180, 220, 255', // Lighter Blue tint
            },
            shootingStars: {
                core: 'rgba(255, 255, 255',
                glow: 'rgba(76, 168, 223', // Blue glow
                tail: 'rgba(76, 168, 223'
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
        this.delay = Math.random() * 2; // 短暫隨機延遲

        this.createElement();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'shooting-star';

        // 流星從視窗外隨機位置開始 (全螢幕範圍)
        // 從各個角度出現，但主要保持從上到下的趨勢
        const startX = Math.random() * 120 - 10; // -10% to 110%
        const startY = Math.random() * 50 - 20; // -20% to 30%

        this.element.style.left = `${startX}%`;
        this.element.style.top = `${startY}%`;
        this.element.style.bottom = 'auto';
        this.element.style.right = 'auto';
        this.element.style.animationDelay = `${this.delay}s`;
        this.element.style.animationDuration = `${this.duration}s`;
        this.element.style.setProperty('--duration', `${this.duration}s`);

        // 精簡但漂亮的流星效果：使用漸變創建尾巴
        const config = this.config.css?.shootingStars || {};
        const tailLength = config.minTailLength + Math.random() * (config.maxTailLength - config.minTailLength);

        this.element.style.width = '2px';
        this.element.style.height = `${tailLength}px`;
        this.element.style.background = 'linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(135, 206, 250, 0.8), rgba(255, 255, 255, 0))';
        this.element.style.transform = 'rotate(-45deg)';
        this.element.style.transformOrigin = 'top center';
        this.element.style.borderRadius = '50%';
        this.element.style.boxShadow = '0 0 15px rgba(255, 255, 255, 1), 0 0 30px rgba(135, 206, 250, 0.6)';

        // 添加到 body（讓流星保持在固定的 z-index 層級）
        document.body.appendChild(this.element);

        // 動畫結束後自動移除
        this.element.addEventListener('animationend', () => {
            this.destroy();
        });
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
            canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;min-height:100vh;z-index:-5;pointer-events:none;background:transparent;display:block;';
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

        // 創建容器 - 確保在最底層（與CSS一致）
        const container = document.createElement('div');
        container.className = 'starry-background-container';
        container.style.cssText = 'position:fixed!important;top:0!important;left:0!important;width:100%!important;height:100%!important;min-height:100vh!important;z-index:-5!important;pointer-events:none!important;overflow:visible!important;background:transparent!important;';

        const sky = document.createElement('div');
        sky.className = 'starry-sky';
        sky.style.cssText = 'position:absolute!important;top:0!important;left:0!important;width:100%!important;height:100%!important;min-height:100vh!important;z-index:-4!important;';

        // 創建靜態星星層（背景必須透明，星星通過box-shadow顯示）
        this.config.css.staticStars.forEach((layer, i) => {
            const div = document.createElement('div');
            div.className = `static-stars-layer static-stars${i}`;
            div.style.cssText = `position:absolute!important;top:0!important;left:0!important;width:1px!important;height:1px!important;border-radius:50%!important;background:transparent!important;z-index:-2!important;opacity:1!important;visibility:visible!important;display:block!important;overflow:visible!important;pointer-events:none!important;`;
            sky.appendChild(div);
        });

        // 創建移動星星層（背景必須透明，星星通過box-shadow顯示）
        this.config.css.movingStars.forEach((layer, i) => {
            const div = document.createElement('div');
            div.className = `moving-stars-layer moving-stars${i}`;
            div.style.cssText = `position:absolute!important;top:0!important;left:0!important;width:${layer.size}!important;height:${layer.size}!important;border-radius:50%!important;background:transparent!important;z-index:-2!important;opacity:1!important;visibility:visible!important;display:block!important;overflow:visible!important;pointer-events:none!important;`;
            sky.appendChild(div);
            console.log(`✅ 創建移動星星層 ${i}`);
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

        // 只在頁面高度變化時更新容器高度，不重新生成星星
        let lastHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
        window.addEventListener('scroll', () => {
            const currentHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
            if (Math.abs(currentHeight - lastHeight) > 100) { // 只有高度變化超過100px才更新
                updateHeight();
                lastHeight = currentHeight;
            }
        });

        // 視窗大小改變時才重新生成星星
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

        // 檢查是否已經生成過星星（避免重複生成）
        if (sky.dataset.starsGenerated === 'true') {
            // 只更新高度，不重新生成星星
            const h = Math.max(document.documentElement.scrollHeight, window.innerHeight, 5000);
            container.style.height = `${h}px`;
            sky.style.height = `${h}px`;
            return;
        }

        const w = Math.max(window.innerWidth, 2560);
        const h = Math.max(document.documentElement.scrollHeight, window.innerHeight, 5000);

        container.style.height = `${h}px`;
        sky.style.height = `${h}px`;

        // 標記已生成星星
        sky.dataset.starsGenerated = 'true';

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
            // 正確格式：需要加上spread radius才能顯示，格式為 xpx ypx 0 spread color
            shadows.push(`${x}px ${y}px 0 1px white`);
        }

        const result = shadows.join(', ');
        console.log(`✅ 生成 ${actualCount} 顆靜態星星，box-shadow 長度: ${result.length} 字符`);
        return result;
    }

    generateMovingStarsShadow(count, maxX, maxY) {
        const shadows = [];
        const actualCount = count;

        for (let i = 0; i < actualCount; i++) {
            const x = Math.floor(Math.random() * maxX);
            const y = Math.floor(Math.random() * maxY);
            // 正確格式：需要加上spread radius才能顯示，格式為 xpx ypx 0 spread color
            shadows.push(`${x}px ${y}px 0 2px white`);
        }

        const result = shadows.join(', ');
        console.log(`✅ 生成 ${actualCount} 顆移動星星，box-shadow 長度: ${result.length} 字符`);
        return result;
    }

    createShootingStars() {
        // 清除舊的流星
        this.shootingStars.forEach(star => star.destroy());
        this.shootingStars = [];

        // 清除舊的定時器
        if (this.shootingStarInterval) {
            clearInterval(this.shootingStarInterval);
        }

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const config = this.config.css.shootingStars;

        // 立即生成第一顆流星
        const initialCount = config.minCount +
            Math.floor(Math.random() * (config.maxCount - config.minCount + 1));

        for (let i = 0; i < initialCount; i++) {
            const star = new ShootingStar(this.config, viewportWidth, viewportHeight);
            this.shootingStars.push(star);
        }

        // 定期生成新流星（精簡但漂亮的流星效果）
        const spawnInterval = config.spawnInterval || 3000;
        this.shootingStarInterval = setInterval(() => {
            // 移除已完成的流星（動畫結束後）
            this.shootingStars = this.shootingStars.filter(star => {
                if (star.element && star.element.parentNode) {
                    return true;
                }
                return false;
            });

            // 生成新流星
            const count = config.minCount +
                Math.floor(Math.random() * (config.maxCount - config.minCount + 1));

            for (let i = 0; i < count; i++) {
                const star = new ShootingStar(this.config, viewportWidth, viewportHeight);
                this.shootingStars.push(star);
            }
        }, spawnInterval);
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

// 確保在DOM準備好後立即初始化
function initStarrySky() {
    if (document.body) {
        starrySkyManager.init();
    } else {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                starrySkyManager.init();
            });
        } else {
            // DOM已經準備好
            setTimeout(() => {
                starrySkyManager.init();
            }, 0);
        }
    }
}

// 立即嘗試初始化
initStarrySky();

// 如果還沒初始化，在window.load時再試一次
window.addEventListener('load', () => {
    if (!starrySkyManager.isInitialized) {
        starrySkyManager.init();
    }
    initMetricAnimations();
});

// ============================================
// 數字動畫邏輯 (Metrics Animation)
// ============================================
function initMetricAnimations() {
    const metrics = document.querySelectorAll('.metric-value');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetValue = target.getAttribute('data-target');

                if (targetValue) {
                    animateValue(target, 0, parseInt(targetValue.replace(/,/g, '')), 2000);
                    observer.unobserve(target);
                }
            }
        });
    }, { threshold: 0.5 });

    metrics.forEach(metric => observer.observe(metric));
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        const current = Math.floor(progress * (end - start) + start);

        // Format number with commas if needed
        if (end > 1000) {
            obj.innerHTML = current.toLocaleString() + (obj.innerHTML.includes('+') ? '+' : '');
        } else {
            obj.innerHTML = current + (obj.innerHTML.includes('+') ? '+' : '');
        }

        // Keep original suffix if present (like '億')
        if (obj.getAttribute('data-target') && obj.getAttribute('data-target').includes('億')) {
            obj.innerHTML = (current / 10000).toFixed(1) + '億+';
        }

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // Final set to ensure accuracy
            // Restore original text format from HTML if needed, or just leave the number
        }
    };
    window.requestAnimationFrame(step);
}
