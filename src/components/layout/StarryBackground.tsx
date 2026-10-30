import React, { useEffect, useRef } from 'react';
import { useShouldReduceMotion } from '@animate-ui/react/utils/motion';

const StarryBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const reduce = useShouldReduceMotion();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId = 0;
        let running = false;
        let particles: Particle[] = [];

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            brightness: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.size = Math.random() * 2 + 0.1;
                this.speedX = (Math.random() - 0.5) * 0.2;
                this.speedY = (Math.random() - 0.5) * 0.2;
                this.brightness = Math.random();
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0) this.x = canvas!.width;
                if (this.x > canvas!.width) this.x = 0;
                if (this.y < 0) this.y = canvas!.height;
                if (this.y > canvas!.height) this.y = 0;

                this.brightness += (Math.random() - 0.5) * 0.05;
                if (this.brightness > 1) this.brightness = 1;
                if (this.brightness < 0.2) this.brightness = 0.2;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const numberOfParticles = Math.min(window.innerWidth * 0.15, 150);
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        };

        const renderFrame = (shouldUpdate: boolean) => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                if (shouldUpdate) p.update();
                p.draw();
            });

            particles.forEach((a, index) => {
                particles.slice(index + 1).forEach((b) => {
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - distance / 100) * 0.15})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                });
            });
        };

        const loop = () => {
            if (!running) return;
            renderFrame(true);
            animationFrameId = requestAnimationFrame(loop);
        };

        const startLoop = () => {
            if (running || reduce || document.visibilityState === 'hidden') return;
            running = true;
            animationFrameId = requestAnimationFrame(loop);
        };

        const stopLoop = () => {
            running = false;
            cancelAnimationFrame(animationFrameId);
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
            renderFrame(false);
        };

        const onVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                stopLoop();
            } else {
                startLoop();
            }
        };

        window.addEventListener('resize', resize);
        document.addEventListener('visibilitychange', onVisibilityChange);
        resize();
        startLoop();

        return () => {
            stopLoop();
            window.removeEventListener('resize', resize);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, [reduce]);

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-[#090A0F]">
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)',
                }}
            />
            <canvas ref={canvasRef} className="absolute inset-0 block" />
        </div>
    );
};

export default StarryBackground;
