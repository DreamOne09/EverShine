import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const LoadingScreen: React.FC = () => {
    const { loading: authLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const loadStartTime = useRef(performance.now());
    const [shouldShow, setShouldShow] = useState(false);

    useEffect(() => {
        // 策略 1: 只在首次訪問時顯示（使用 sessionStorage）
        const hasVisited = sessionStorage.getItem('evershine_visited');
        const isFirstVisit = !hasVisited;
        
        // 策略 2: 等待 Auth 載入完成
        if (!authLoading) {
            const loadTime = performance.now() - loadStartTime.current;
            const isSlowLoad = loadTime > 500; // 超過 500ms 才顯示
            
            // 只在首次訪問或載入較慢時顯示
            if (isFirstVisit || isSlowLoad) {
                setShouldShow(true);
                
                // 確保至少顯示 1 秒（讓動畫完整播放）
                const minDisplayDuration = 1000;
                const remaining = Math.max(0, minDisplayDuration - loadTime);
                
                const timer = setTimeout(() => {
                    setIsLoading(false);
                    if (isFirstVisit) {
                        sessionStorage.setItem('evershine_visited', 'true');
                    }
                }, remaining);
                
                return () => clearTimeout(timer);
            } else {
                // 載入很快且不是首次訪問，直接隱藏
                setIsLoading(false);
            }
        }
    }, [authLoading]);

    // 如果不需要顯示，直接返回 null
    if (!shouldShow || !isLoading) {
        return null;
    }

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg-dark"
                >
                    {/* Animated background gradient */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'radial-gradient(ellipse at center, #1B2735 0%, var(--color-bg-dark) 100%)'
                        }}
                    />

                    {/* Subtle star particles */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    opacity: [0.2, 0.8, 0.2],
                                    scale: [1, 1.5, 1],
                                }}
                                transition={{
                                    duration: 2 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2,
                                }}
                            />
                        ))}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center gap-8">
                        {/* Logo */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative"
                        >
                            <img
                                src="/images/assets/logo/白色正方形logo.png"
                                alt="EverShine Logo"
                                className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl"
                            />

                            {/* Glow effect */}
                            <motion.div
                                className="absolute inset-0 bg-primary rounded-full blur-3xl opacity-20"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.2, 0.3, 0.2],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                            />
                        </motion.div>

                        {/* Welcome text */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-center"
                        >
                            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 tracking-wide">
                                歡迎來到
                            </h1>
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wider">
                                長輝白金分會
                            </h2>
                        </motion.div>

                        {/* Loading indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex gap-2"
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 bg-primary rounded-full"
                                    animate={{
                                        y: [-8, 0, -8],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                />
                            ))}
                        </motion.div>
                    </div>

                    {/* Bottom decoration */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ delay: 0.8 }}
                        className="absolute bottom-8 text-primary/50 text-sm tracking-widest"
                    >
                        BNI EVERSHINE
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
