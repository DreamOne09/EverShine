import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import { useShouldReduceMotion } from '@animate-ui/react/utils/motion';
import { siteConfig } from '../../config/site.config';

export type PageHeroTone = 'earth' | 'meeting';

interface PageHeroProps {
    /** 金色徽章（主標上方） */
    badge?: React.ReactNode;
    /** 大標（僅一行主標題，語意為頁面唯一 h1） */
    title: React.ReactNode;
    /** 小標（大標下方、獨立段落，字級較小，與大標分開渲染） */
    heroTagline?: React.ReactNode;
    subtitle?: React.ReactNode;
    /** 套用在 subtitle 外層的額外 class（例如會員頁放大說明層級） */
    subtitleClassName?: string;
    /** 為 true 時在區塊底部顯示向下捲動提示（首頁用） */
    showScrollIndicator?: boolean;
    /** 列表頁用較矮的標題區，避免與下方篩選／內容重疊 */
    compact?: boolean;
    /** earth：首頁地球底圖；meeting：真實會員組成的線上例會 Gallery */
    tone?: PageHeroTone;
    /** 覆寫底圖路徑（預設依 tone） */
    backgroundImage?: string;
    backgroundPosition?: string;
    children?: React.ReactNode;
}

const EARTH_BG = siteConfig.backgrounds.earth;
const MEETING_BG = siteConfig.backgrounds.meeting;

const PageHero: React.FC<PageHeroProps> = ({
    badge,
    title,
    heroTagline,
    subtitle,
    subtitleClassName,
    showScrollIndicator,
    compact,
    tone = 'earth',
    backgroundImage,
    backgroundPosition = 'center center',
    children,
}) => {
    const isMeeting = tone === 'meeting';
    const src = backgroundImage || (isMeeting ? MEETING_BG : EARTH_BG);
    const reduce = useShouldReduceMotion();

    return (
        <section
            className={
                compact
                    ? 'relative z-10 flex flex-col items-center justify-center text-center pt-24 pb-10 md:pt-28 md:pb-12 overflow-hidden'
                    : 'min-h-screen flex flex-col justify-center items-center text-center relative z-10 pt-20 overflow-hidden'
            }
            aria-label="BNI 長輝白金分會頁面標題"
        >
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${src})`,
                    backgroundSize: 'cover',
                    backgroundPosition,
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: isMeeting ? 'scroll' : 'fixed',
                    willChange: 'transform',
                    imageRendering: '-webkit-optimize-contrast',
                    mixBlendMode: isMeeting ? 'normal' : 'screen',
                    maskImage: 'linear-gradient(to bottom, black 62%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 62%, transparent 100%)',
                }}
            />
            {isMeeting && (
                <div
                    className="absolute inset-0 z-[1] pointer-events-none"
                    style={{
                        background:
                            'linear-gradient(180deg, rgba(2,8,18,0.22) 0%, rgba(2,10,22,0.4) 52%, rgba(3,7,18,0.9) 100%)',
                    }}
                    aria-hidden
                />
            )}

            <div className={compact ? 'relative z-10 px-4' : 'relative z-10 px-4 mt-[-5vh] md:mt-[-10vh]'}>
                {badge && (
                    <Effect fade blur={{ initialBlur: 2 }} slide={{ offset: 12 }}>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-platinum/40 bg-black/25 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-platinum-soft shadow-[inset_0_1px_0_rgba(255,243,200,0.2)] backdrop-blur-md sm:text-xs">
                            <span className="h-1.5 w-1.5 rounded-full bg-platinum-light shadow-[0_0_8px_rgba(232,197,71,0.8)]" aria-hidden />
                            {badge}
                        </div>
                    </Effect>
                )}
                {/* 主標題在首次繪製即清晰呈現，不延遲隱藏 */}
                <h1
                    className={`font-black tracking-tight font-sans text-glow ${heroTagline ? 'mb-0' : 'mb-6'} ${
                        compact
                            ? 'text-2xl sm:text-4xl md:text-5xl'
                            : 'text-3xl sm:text-5xl md:text-7xl lg:text-8xl'
                    }`}
                >
                    <span className="block bg-clip-text text-transparent bg-gradient-to-b from-[#F8FBFF] via-[#9AD8F8] to-[#2B8FCB] drop-shadow-[0_0_18px_rgba(14,165,233,0.45)] px-2">
                        {title}
                    </span>
                </h1>
                {heroTagline && (
                    <Effect fade blur={{ initialBlur: 2 }} slide={{ offset: 14 }} delay={80}>
                        <p className="mt-3 md:mt-5 mb-6 text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-[#bae6fd] to-[#38bdf8] drop-shadow-[0_0_12px_rgba(56,189,248,0.45)] max-w-[95vw] leading-tight px-2 mx-auto">
                            {heroTagline}
                        </p>
                    </Effect>
                )}
                {subtitle && (
                    <Effect fade blur={{ initialBlur: 2 }} slide={{ offset: 14 }} delay={120}>
                        <div
                            className={`mx-auto max-w-3xl leading-relaxed tracking-[0.04em] text-slate-200/90 ${
                                compact ? 'mt-3 mb-0 text-sm md:text-lg font-light' : 'text-base font-light md:text-xl'
                            } ${subtitleClassName || ''}`}
                        >
                            {subtitle}
                        </div>
                    </Effect>
                )}
                {children && (
                    <Effect fade blur={{ initialBlur: 2 }} slide={{ offset: 16 }} delay={200}>
                        <div>{children}</div>
                    </Effect>
                )}
                {showScrollIndicator && (
                    <motion.div
                        className="mt-10 flex justify-center"
                        initial={{ opacity: 0, transform: 'translateY(0px)' }}
                        animate={
                            reduce
                                ? { opacity: 1, transform: 'translateY(0px)' }
                                : { opacity: 1, transform: ['translateY(0px)', 'translateY(6px)', 'translateY(0px)'] }
                        }
                        transition={{ opacity: { delay: 0.6, duration: 0.3 }, transform: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } }}
                        aria-hidden
                    >
                        <ChevronDown className="w-8 h-8 text-primary/80" strokeWidth={2} />
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default PageHero;
