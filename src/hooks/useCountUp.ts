import { useState, useEffect, useRef } from 'react';

export const useCountUp = (end: number, duration: number = 2000, start: number = 0) => {
    const [count, setCount] = useState(start);
    const [hasStarted, setHasStarted] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasStarted) {
                    setHasStarted(true);
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [hasStarted]);

    useEffect(() => {
        if (!hasStarted) return;

        let startTime: number | null = null;
        let animationFrameId: number;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);

            setCount(Math.floor(easeOutQuart(progress) * (end - start) + start));

            if (progress < 1) {
                animationFrameId = window.requestAnimationFrame(step);
            }
        };

        animationFrameId = window.requestAnimationFrame(step);

        return () => cancelAnimationFrame(animationFrameId);
    }, [hasStarted, end, duration, start]);

    return { count, elementRef };
};
