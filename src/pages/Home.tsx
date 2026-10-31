import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@animate-ui/react/primitives/buttons/button';
import { CountingNumber } from '@animate-ui/react/primitives/texts/counting-number';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import { useShouldReduceMotion } from '@animate-ui/react/utils/motion';
import PageHero from '../components/common/PageHero';
import About from '../components/home/About';
import Results from '../components/home/Results';
import MemberWall from '../components/home/MemberWall';
import FAQ from '../components/home/FAQ';
import Contact from '../components/home/Contact';
import VisitSteps from '../components/home/VisitSteps';
import ConstellationMapSection from '../components/home/ConstellationMapSection';
import MorningOrbitTimeline from '../components/home/MorningOrbitTimeline';
import { Link } from 'react-router-dom';
import { Users, Compass, Sparkles, ArrowRight } from 'lucide-react';
import SEO from '../components/common/SEO';
import { siteConfig } from '../config/site.config';

const Home: React.FC = () => {
    const reduce = useShouldReduceMotion();

    return (
        <div className="overflow-hidden">
            <SEO
                description="BNI 長輝白金分會（EverShine）每週三早上 06:30–08:30 全程在 Zoom 線上開會。將近 60 位不同專業的企業主，八大產業一業一代表，累計超過 2.6 萬張實名引薦單、6.29 億成交額。"
                keywords="長輝白金分會, EverShine, BNI長輝, 線上BNI, 每週三例會, 商務引薦, 線上商會, BNI台灣, 白金分會, Givers Gain, 台北商會"
                structuredData={{
                    '@type': 'WebPage',
                    name: 'BNI 長輝白金分會 EverShine — 每週三 06:30 線上例會・把專業變成引薦',
                    description:
                        'BNI 長輝白金分會全程在 Zoom 線上開會。將近 60 位不同產業的台灣企業主，一業一代表，每週三早晨用固定議程幫彼此對接生意。',
                    url: 'https://evershine.tw/',
                    isPartOf: { '@id': 'https://evershine.tw/#website' },
                    about: { '@id': 'https://evershine.tw/#organization' },
                    inLanguage: 'zh-TW',
                }}
            />

            {/* 首屏：品牌定位與核心實績摘要 */}
            <PageHero
                badge={`${siteConfig.branchName} · ${siteConfig.meeting.dayZh} ${siteConfig.meeting.startTime}–${siteConfig.meeting.endTime} 線上例會`}
                tone="earth"
                title="BNI 長輝白金分會"
                heroTagline="一業一代表，把各行各業連成長期合作的團隊"
                subtitle={
                    <>
                        全程在 Zoom 上開會的 BNI 白金分會<br />
                        每週三早上六點半，近 60 位不同產業的企業主在線上為彼此找生意
                    </>
                }
                showScrollIndicator
            >
                <div className="mt-8 flex flex-col items-center justify-center gap-3 px-4 sm:flex-row sm:gap-3.5">
                    <Button asChild className="w-full sm:w-auto">
                        <a
                            href="#constellation"
                            className="btn-lux btn-primary-lux inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-bold transition-colors sm:w-auto"
                        >
                            <Compass size={17} strokeWidth={2.2} />
                            看八大產業分工
                        </a>
                    </Button>
                    <Button asChild className="w-full sm:w-auto">
                        <Link
                            to="/members"
                            className="btn-lux btn-ghost-lux inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-bold transition-colors sm:w-auto"
                        >
                            <Users size={17} strokeWidth={2.2} />
                            瀏覽 59 位會員
                        </Link>
                    </Button>
                    <Button asChild className="w-full sm:w-auto">
                        <a
                            href="#contact"
                            className="btn-lux btn-platinum-lux inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-bold transition-colors sm:w-auto"
                        >
                            <Sparkles size={17} strokeWidth={2.2} />
                            預約來賓參觀
                        </a>
                    </Button>
                </div>

                {/* 分會核心數據一覽 */}
                <div className="mx-auto mt-10 max-w-4xl px-2">
                    <div className="glass-panel grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 rounded-2xl border border-white/15 bg-[#041122]/75 py-3.5 px-2 backdrop-blur-xl">
                        <div className="px-3 py-1.5 text-center">
                            <div className="text-[11px] font-medium tracking-wider text-platinum-light/90">
                                在籍會員
                            </div>
                            <div className="mt-0.5 font-mono text-xl sm:text-2xl font-bold tabular-nums text-white">
                                59 <span className="text-xs font-sans font-normal text-gray-300">位專業代表</span>
                            </div>
                        </div>
                        <div className="px-3 py-1.5 text-center">
                            <div className="text-[11px] font-medium tracking-wider text-platinum-light/90">
                                產業分類
                            </div>
                            <div className="mt-0.5 font-mono text-xl sm:text-2xl font-bold tabular-nums text-white">
                                8 <span className="text-xs font-sans font-normal text-gray-300">大產業領域</span>
                            </div>
                        </div>
                        <div className="px-3 py-1.5 text-center">
                            <div className="text-[11px] font-medium tracking-wider text-platinum-light/90">
                                累計引薦
                            </div>
                            <div className="mt-0.5 font-mono text-xl sm:text-2xl font-bold tabular-nums text-white">
                                26,459 <span className="text-xs font-sans font-normal text-gray-300">張引薦單</span>
                            </div>
                        </div>
                        <div className="px-3 py-1.5 text-center">
                            <div className="text-[11px] font-medium tracking-wider text-platinum-light/90">
                                累計成交
                            </div>
                            <div className="mt-0.5 font-mono text-xl sm:text-2xl font-bold tabular-nums text-platinum-light">
                                6.3 億+ <span className="text-xs font-sans font-normal text-gray-300">新台幣</span>
                            </div>
                        </div>
                    </div>
                </div>
            </PageHero>

            {/* 八大產業分工與跨業合作鏈 */}
            <ConstellationMapSection />

            {/* 週三 06:20–08:30 例會流程時間軸 */}
            <MorningOrbitTimeline />

            {/* 長輝運作原則 */}
            <About />

            {/* 59 位在籍會員牆 */}
            <MemberWall />

            {/* 引薦成果統計與近 12 個月趨勢圖 */}
            <Results />

            {/* 來賓參觀三步驟 */}
            <VisitSteps />

            {/* 認識全球 BNI 組織 */}
            <section className="flex flex-col justify-center py-20 relative z-10 px-4 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden>
                    <div className="absolute top-1/4 left-10 w-32 h-32 bg-[#cf2030]/10 rounded-full blur-[40px]" />
                    <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-primary/10 rounded-full blur-[50px]" />
                </div>

                <div className="container mx-auto max-w-6xl relative">
                    <Effect inView fade blur={{ initialBlur: 4 }} slide={{ offset: 16 }}>
                        <div className="glass-panel relative flex flex-col items-center justify-between gap-12 overflow-hidden rounded-3xl p-8 group md:p-16 lg:flex-row">
                            <div
                                className="absolute -top-40 -right-40 w-96 h-96 bg-[#cf2030]/25 blur-[100px] rounded-full mix-blend-screen pointer-events-none"
                                aria-hidden
                            />
                            <div
                                className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/25 blur-[100px] rounded-full mix-blend-screen pointer-events-none"
                                aria-hidden
                            />

                            <div className="absolute top-6 right-6 hidden items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 py-1.5 font-mono text-xs tracking-widest text-primary-light uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] md:flex">
                                EST. 1985
                            </div>

                            {/* Logo Column */}
                            <div className="w-full lg:w-1/3 flex justify-center lg:justify-start relative">
                                <motion.div
                                    animate={
                                        reduce
                                            ? undefined
                                            : { transform: ['translateY(0px)', 'translateY(-8px)', 'translateY(0px)'] }
                                    }
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    className="w-48 h-48 md:w-64 md:h-64 bg-white rounded-full flex items-center justify-center p-8 shadow-[0_0_50px_rgba(76,168,223,0.3)] relative z-10 border-4 border-white/10"
                                >
                                    <img
                                        src="/images/assets/logo/bni-logo-new.png"
                                        alt="BNI 全球商務引薦組織標誌"
                                        width={200}
                                        height={80}
                                        loading="lazy"
                                        className="w-full h-auto object-contain"
                                    />
                                </motion.div>

                                <motion.div
                                    animate={
                                        reduce
                                            ? undefined
                                            : { transform: ['scale(1.5) rotate(0deg)', 'scale(1.5) rotate(360deg)'] }
                                    }
                                    transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                                    style={{ transform: 'scale(1.5)' }}
                                    className="absolute inset-0 z-0 border border-dashed border-white/20 rounded-full pointer-events-none"
                                    aria-hidden
                                />
                            </div>

                            {/* Content Column */}
                            <div className="w-full lg:w-2/3 text-center lg:text-left relative z-10">
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                                    什麼是 <span className="text-[#cf2030]">BNI</span>？
                                </h2>
                                <h3 className="text-xl md:text-2xl text-primary-light font-medium mb-6">
                                    不靠應酬喝酒，用 40 年驗證的制度幫彼此介紹客戶
                                </h3>
                                <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                                    BNI（Business Network International）從 1985 年創立至今，在台灣有 245 個分會、將近一萬名企業主。規則很單純：同一個分會裡，每個專業只收一位代表。你先幫夥伴留意生意、介紹客戶，別人自然也會把案子帶給你，這就是「付出者收穫」（Givers Gain®）。長輝把這套制度完整搬上 Zoom，讓你不受縣市與出差限制，穩定與全台企業主合作。
                                </p>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                                    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center transition-colors hover:bg-white/5">
                                        <div className="text-3xl font-bold font-mono tabular-nums text-white mb-1">
                                            <CountingNumber number={76} fromNumber={50} inView />+
                                        </div>
                                        <div className="text-xs text-gray-300 font-medium tracking-wider">遍及國家與地區</div>
                                    </div>
                                    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center transition-colors hover:bg-white/5">
                                        <div className="text-3xl font-bold font-mono tabular-nums text-white mb-1">
                                            <CountingNumber number={34} fromNumber={20} inView />萬+
                                        </div>
                                        <div className="text-xs text-gray-300 font-medium tracking-wider">全球會員</div>
                                    </div>
                                    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center transition-colors hover:bg-white/5">
                                        <div className="text-3xl font-bold font-mono tabular-nums text-white mb-1">
                                            <CountingNumber number={253} fromNumber={180} inView />億+
                                        </div>
                                        <div className="text-xs text-gray-300 font-medium tracking-wider">台灣年成交額（TWD）</div>
                                    </div>
                                </div>

                                <Button asChild>
                                    <Link
                                        to="/bni"
                                        className="px-9 py-4 bg-white text-bg-dark font-bold text-lg rounded-full hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center gap-2 mx-auto lg:mx-0"
                                    >
                                        了解 BNI 20 項例會議程
                                        <ArrowRight size={20} />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </Effect>
                </div>
            </section>

            {/* 常見問題 */}
            <FAQ />

            {/* 預約參觀與聯繫幹部 */}
            <Contact />
        </div>
    );
};

export default Home;
