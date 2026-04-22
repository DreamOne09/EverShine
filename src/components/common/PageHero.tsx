import React from 'react';
import { motion } from 'framer-motion';

interface PageHeroProps {
    /** 主標題（Hero 第一行） */
    title: React.ReactNode;
    /** 副標題（主標題下方、較小字級，仍屬標題區） */
    heroTagline?: React.ReactNode;
    subtitle?: React.ReactNode;
    showScrollIndicator?: boolean;
    children?: React.ReactNode;
}

const PageHero: React.FC<PageHeroProps> = ({ title, heroTagline, subtitle, showScrollIndicator = false, children }) => {
    return (
        <section className="min-h-screen flex flex-col justify-center items-center text-center relative z-10 pt-20 overflow-hidden" aria-label="BNI 長輝白金分會台灣商會頁面標題">
            {/* Hero Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url(/images/assets/background.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                    willChange: 'transform',
                    imageRendering: '-webkit-optimize-contrast',
                    mixBlendMode: 'screen',
                    maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative z-10 px-4 mt-[-5vh] md:mt-[-10vh]"
            >
                <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight font-sans flex flex-col items-center gap-2 md:gap-3">
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#E0F2FE] via-[#7DD3FC] to-[#0284C7] drop-shadow-[0_0_15px_rgba(14,165,233,0.6)]">
                        {title}
                    </span>
                    {heroTagline && (
                        <span className="block text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-[#bae6fd] to-[#38bdf8] drop-shadow-[0_0_12px_rgba(56,189,248,0.45)] max-w-[95vw] leading-tight px-2">
                            {heroTagline}
                        </span>
                    )}
                </h1>
                {subtitle && (
                    <div className="text-base md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light">
                        {subtitle}
                    </div>
                )}
                {children}
            </motion.div>
        </section>
    );
};

export default PageHero;
