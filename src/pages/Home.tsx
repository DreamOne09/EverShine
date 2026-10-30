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
import { Link } from 'react-router-dom';
import { Users, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import SEO from '../components/common/SEO';
import { siteConfig } from '../config/site.config';

const Home: React.FC = () => {
    const reduce = useShouldReduceMotion();

    return (
        <div className="overflow-hidden">
            <SEO
                description="BNI 長輝白金分會（EverShine）每週三早上 06:30–08:30 全程在 Zoom 線上開會。將近 60 位不同專業的企業主，一業一代表，把每週認識的夥伴變成真正的生意合作。"
                keywords="長輝白金分會, EverShine, BNI長輝, 線上BNI, 每週三例會, 商務引薦, 線上商會, BNI台灣, 白金分會, Givers Gain"
                structuredData={{
                    '@type': 'WebPage',
                    name: '長輝白金分會 EverShine — 每週三線上例會',
                    description: 'BNI 長輝白金分會全程線上與會，每週三早上用固定例會把專業變成生意引薦。',
                    url: 'https://evershine.tw/',
                    isPartOf: { '@id': 'https://evershine.tw/#website' },
                    about: { '@id': 'https://evershine.tw/#organization' },
                    inLanguage: 'zh-TW',
                }}
            />
            <PageHero
                badge={`${siteConfig.branchName} · ${siteConfig.meeting.dayZh} ${siteConfig.meeting.startTime}–${siteConfig.meeting.endTime}`}
                tone="earth"
                title="把專業變成引薦"
                subtitle={
                    <>
                        全程在 Zoom 上開會的 BNI 白金分會<br />
                        每週三早上六點半，近 60 位不同產業的老闆在線上為彼此找生意
                    </>
                }
                showScrollIndicator
            >
                <div className="mt-9 flex flex-col items-center justify-center gap-3 px-4 sm:flex-row sm:gap-3.5">
                    <Button asChild className="w-full sm:w-auto">
                        <Link
                            to="/members"
                            className="btn-lux btn-primary-lux inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-bold transition-colors sm:w-auto"
                        >
                            <Users size={17} strokeWidth={2.2} />
                            認識會員
                        </Link>
                    </Button>
                    <Button asChild className="w-full sm:w-auto">
                        <Link
                            to="/bni"
                            className="btn-lux btn-ghost-lux inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-bold transition-colors sm:w-auto"
                        >
                            <BookOpen size={17} strokeWidth={2.2} />
                            例會怎麼開
                        </Link>
                    </Button>
                    <Button asChild className="w-full sm:w-auto">
                        <a
                            href="#contact"
                            className="btn-lux btn-platinum-lux inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-bold transition-colors sm:w-auto"
                        >
                            <Sparkles size={17} strokeWidth={2.2} />
                            報名來訪
                        </a>
                    </Button>
                </div>
            </PageHero>

            <VisitSteps />

            <About />

            <MemberWall />

            <Results />

            {/* What is BNI Link Section */}
            <section className="min-h-screen flex flex-col justify-center py-20 relative z-10 px-4 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden>
                    <div className="absolute top-1/4 left-10 w-32 h-32 bg-[#cf2030]/10 rounded-full blur-[40px]" />
                    <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-primary/10 rounded-full blur-[50px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] -z-10" />
                </div>

                <div className="container mx-auto max-w-6xl relative">
                    <Effect inView fade blur={{ initialBlur: 4 }} slide={{ offset: 16 }}>
                        <div className="glass-panel relative flex flex-col items-center justify-between gap-12 overflow-hidden rounded-3xl p-8 group md:p-16 lg:flex-row">
                            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#cf2030]/25 blur-[100px] rounded-full mix-blend-screen pointer-events-none" aria-hidden />
                            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/25 blur-[100px] rounded-full mix-blend-screen pointer-events-none" aria-hidden />

                            <div className="absolute top-6 right-6 hidden items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 py-1.5 font-mono text-xs tracking-widest text-primary-light uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] md:flex">
                                EST. 1985
                            </div>

                            {/* Logo Column */}
                            <div className="w-full lg:w-1/3 flex justify-center lg:justify-start relative">
                                <motion.div
                                    animate={reduce ? undefined : { transform: ['translateY(0px)', 'translateY(-8px)', 'translateY(0px)'] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    className="w-48 h-48 md:w-64 md:h-64 bg-white rounded-full flex items-center justify-center p-8 shadow-[0_0_50px_rgba(76,168,223,0.3)] relative z-10 border-4 border-white/10"
                                >
                                    <img
                                        src="/images/assets/logo/bni-logo-new.png"
                                        alt="BNI 全球商務引薦組織標誌"
                                        className="w-full h-auto object-contain"
                                    />
                                </motion.div>

                                <motion.div
                                    animate={reduce ? undefined : { transform: ['scale(1.5) rotate(0deg)', 'scale(1.5) rotate(360deg)'] }}
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
                                    不靠應酬喝酒，用制度幫彼此介紹客戶的商會
                                </h3>
                                <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                                    BNI（Business Network International）從 1985 年創立至今，在台灣有 245 個分會、將近一萬名企業主。規定很單純：同一個分會裡，每個專業只收一位代表。先幫夥伴留意生意、介紹客戶，別人自然也會把案子帶給你——這就是我們說的「付出者收穫」（Givers Gain®）。長輝把這套做法搬上 Zoom，不管你在台北、外縣市還是出差中，打開電腦就能跟大家一起開會。
                                </p>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                                    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center transition-colors hover:bg-white/5">
                                        <div className="text-3xl font-bold font-mono tabular-nums text-white mb-1">
                                            <CountingNumber number={76} fromNumber={50} inView />+
                                        </div>
                                        <div className="text-xs text-gray-400 font-medium tracking-wider">遍及國家與地區</div>
                                    </div>
                                    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center transition-colors hover:bg-white/5">
                                        <div className="text-3xl font-bold font-mono tabular-nums text-white mb-1">
                                            <CountingNumber number={34} fromNumber={20} inView />萬+
                                        </div>
                                        <div className="text-xs text-gray-400 font-medium tracking-wider">全球會員</div>
                                    </div>
                                    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center transition-colors hover:bg-white/5">
                                        <div className="text-3xl font-bold font-mono tabular-nums text-white mb-1">
                                            <CountingNumber number={253} fromNumber={180} inView />億+
                                        </div>
                                        <div className="text-xs text-gray-400 font-medium tracking-wider">台灣年成交額（TWD）</div>
                                    </div>
                                </div>

                                <Button asChild>
                                    <Link
                                        to="/bni"
                                        className="px-9 py-4 bg-white text-bg-dark font-bold text-lg rounded-full hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center gap-2 mx-auto lg:mx-0"
                                    >
                                        看 BNI 怎麼運作
                                        <ArrowRight size={20} />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </Effect>
                </div>
            </section>

            <FAQ />

            <Contact />
        </div>
    );
};

export default Home;
