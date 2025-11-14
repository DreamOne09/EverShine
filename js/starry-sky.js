// ============================================
// 星空背景渲染器 - 參考深空宇宙風格
// ============================================
class StarrySky {
    constructor(canvasId = 'starrySkyCanvas') {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            this.createCanvas();
        }
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.nebulas = [];
        this.animationId = null;
        
        this.init();
    }
    
    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'starrySkyCanvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);
        this.canvas = canvas;
    }
    
    init() {
        this.resize();
        this.createStars();
        this.createNebulas();
        this.animate();
        
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
        const starCount = Math.floor((this.canvas.width * this.canvas.height) / 3000); // 更密集的星空
        
        for (let i = 0; i < starCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 2 + 0.5;
            const opacity = Math.random() * 0.5 + 0.5;
            const twinkleSpeed = Math.random() * 0.02 + 0.01;
            const twinklePhase = Math.random() * Math.PI * 2;
            
            // 星星顏色 - 白色、藍白色、淡藍色
            const colorType = Math.random();
            let color;
            if (colorType < 0.6) {
                color = `rgba(255, 255, 255, ${opacity})`;
            } else if (colorType < 0.85) {
                color = `rgba(200, 230, 255, ${opacity})`;
            } else {
                color = `rgba(169, 214, 255, ${opacity})`;
            }
            
            this.stars.push({
                x,
                y,
                size,
                color,
                opacity,
                twinkleSpeed,
                twinklePhase,
                baseOpacity: opacity
            });
        }
    }
    
    createNebulas() {
        this.nebulas = [];
        const nebulaCount = 8;
        
        for (let i = 0; i < nebulaCount; i++) {
            this.nebulas.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radiusX: Math.random() * 800 + 400,
                radiusY: Math.random() * 600 + 300,
                color: this.getRandomNebulaColor(),
                opacity: Math.random() * 0.15 + 0.05,
                driftSpeedX: (Math.random() - 0.5) * 0.1,
                driftSpeedY: (Math.random() - 0.5) * 0.1
            });
        }
    }
    
    getRandomNebulaColor() {
        const colors = [
            [76, 168, 223],   // 青色
            [110, 84, 255],   // 紫色
            [35, 150, 255],   // 藍色
            [120, 87, 255],   // 紫藍色
            [135, 206, 250],  // 天藍色
            [255, 120, 196]   // 粉紅色
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    drawStars() {
        this.stars.forEach(star => {
            // 閃爍效果
            star.twinklePhase += star.twinkleSpeed;
            const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
            star.opacity = star.baseOpacity * twinkle;
            
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = star.color.replace(/[\d\.]+\)$/, `${star.opacity})`);
            this.ctx.fill();
            
            // 光暈效果
            if (star.size > 1) {
                const gradient = this.ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, star.size * 3
                );
                gradient.addColorStop(0, star.color.replace(/[\d\.]+\)$/, `${star.opacity})`));
                gradient.addColorStop(1, star.color.replace(/[\d\.]+\)$/, '0)'));
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            }
        });
    }
    
    drawNebulas() {
        this.nebulas.forEach(nebula => {
            // 緩慢漂移
            nebula.x += nebula.driftSpeedX;
            nebula.y += nebula.driftSpeedY;
            
            // 邊界檢查
            if (nebula.x < -nebula.radiusX) nebula.x = this.canvas.width + nebula.radiusX;
            if (nebula.x > this.canvas.width + nebula.radiusX) nebula.x = -nebula.radiusX;
            if (nebula.y < -nebula.radiusY) nebula.y = this.canvas.height + nebula.radiusY;
            if (nebula.y > this.canvas.height + nebula.radiusY) nebula.y = -nebula.radiusY;
            
            const gradient = this.ctx.createRadialGradient(
                nebula.x, nebula.y, 0,
                nebula.x, nebula.y, Math.max(nebula.radiusX, nebula.radiusY)
            );
            gradient.addColorStop(0, `rgba(${nebula.color[0]}, ${nebula.color[1]}, ${nebula.color[2]}, ${nebula.opacity})`);
            gradient.addColorStop(0.5, `rgba(${nebula.color[0]}, ${nebula.color[1]}, ${nebula.color[2]}, ${nebula.opacity * 0.5})`);
            gradient.addColorStop(1, `rgba(${nebula.color[0]}, ${nebula.color[1]}, ${nebula.color[2]}, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.ellipse(
                nebula.x, nebula.y,
                nebula.radiusX, nebula.radiusY,
                0, 0, Math.PI * 2
            );
            this.ctx.fill();
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 繪製星雲（在星星下方）
        this.drawNebulas();
        
        // 繪製星星
        this.drawStars();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// 初始化星空背景
let starrySkyInstance = null;

function initStarrySky() {
    if (starrySkyInstance) {
        starrySkyInstance.destroy();
    }
    starrySkyInstance = new StarrySky();
}

// 頁面載入時初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStarrySky);
} else {
    initStarrySky();
}

