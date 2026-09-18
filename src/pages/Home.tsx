import React from 'react';
import { motion } from 'framer-motion';
import PageHero from '../components/common/PageHero';
import About from '../components/home/About';
import Results from '../components/home/Results';
import MemberWall from '../components/home/MemberWall';
import FAQ from '../components/home/FAQ';
import Contact from '../components/home/Contact';
import VisitSteps from '../components/home/VisitSteps';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { siteConfig } from '../config/site.config';

const Home: React.FC = () => {
    return (
        <div className="overflow-hidden">
            <SEO
                description="BNI 長輝白金分會 EverShine 是全台少數 100% 線上與會的白金級分會。每週三 06:30–08:30 舉行結構化例會，用引薦把專業變成生意。"
                keywords="長輝白金分會, EverShine, BNI長輝, 線上BNI, 每週三例會, 商務引薦, 線上商會, BNI台灣, 白金分會, Givers Gain"
                structuredData={{
                    '@type': 'WebPage',
                    name: '長輝白金分會 EverShine — 每週三線上例會',
                    description: 'BNI 長輝白金分會 100% 支援線上與會，每週三早晨把專業變成引薦。',
                    url: 'https://evershine.tw/',
                    isPartOf: { '@id': 'https://evershine.tw/#website' },
                    about: { '@id': 'https://evershine.tw/#organization' },
                    inLanguage: 'zh-TW'
                }}
            />
            <PageHero
                badge={`${siteConfig.branchName} · ${siteConfig.meeting.dayZh} ${siteConfig.meeting.startTime}–${siteConfig.meeting.endTime}`}
                title="連結能創造價值的人"
                subtitle={
                    <>
                        線上開會的 BNI 白金分會<br />
                        用每週例會，把專業變成引薦
                    </>
                }
                showScrollIndicator
            >
                <div className="mt-8 flex flex-col items-center justify-center gap-3 px-4 sm:flex-row sm:gap-4">
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                        <Link
                            to="/members"
                            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-dark px-8 py-3.5 text-center text-base font-bold text-bg-dark shadow-[0_0_30px_rgba(76,168,223,0.4)] sm:w-auto"
                        >
                            瀏覽會員
                        </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                        <Link
                            to="/bni"
                            className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-center text-base font-bold text-white backdrop-blur-md hover:border-primary/50 sm:w-auto"
                        >
                            了解例會
                        </Link>
                    </motion.div>
                    <motion.a
                        href="#contact"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="inline-flex w-full items-center justify-center rounded-full border border-platinum/40 bg-platinum/10 px-8 py-3.5 text-center text-base font-bold text-platinum-soft hover:bg-platinum/20 sm:w-auto"
                    >
                        我要來訪
                    </motion.a>
                </div>
            </PageHero>

            <VisitSteps />

            <About />

            <MemberWall />

            {/* Results Section */}
            <Results />

            {/* What is BNI Link Section */}
            <section className="min-h-screen flex flex-col justify-center py-20 relative z-10 px-4 overflow-hidden">
                {/* Background Floating Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 left-10 w-32 h-32 bg-[#cf2030]/10 rounded-full blur-[40px]"
                    />
                    <motion.div
                        animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-1/4 right-10 w-48 h-48 bg-primary/10 rounded-full blur-[50px]"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] -z-10"
                    />
                </div>

                <div className="container mx-auto max-w-6xl relative perspective-1000">
                    <motion.div
                        initial={{ opacity: 0, rotateX: 10, y: 50 }}
                        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-16 border border-white/20 flex flex-col lg:flex-row items-center justify-between gap-12 group shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden"
                    >
                        {/* Decorative glow inside card */}
                        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#cf2030]/30 blur-[100px] rounded-full mix-blend-screen animate-pulse"></div>
                        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/30 blur-[100px] rounded-full mix-blend-screen animate-pulse"></div>

                        {/* Floating Badge */}
                        <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-mono text-primary-light tracking-widest uppercase hidden md:block">
                            EST. 1985
                        </div>

                        {/* Logo Column */}
                        <div className="w-full lg:w-1/3 flex justify-center lg:justify-start relative">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-48 h-48 md:w-64 md:h-64 bg-white rounded-full flex items-center justify-center p-8 shadow-[0_0_50px_rgba(76,168,223,0.3)] relative z-10 border-4 border-white/10"
                            >
                                <img src="/images/assets/logo/bni-logo-new.png" alt="BNI 全球商會暨商務引薦組織 — 台灣商會首選" className="w-full h-auto object-contain transform hover:scale-105 transition-transform duration-500" />
                            </motion.div>

                            {/* Orbiting Decor */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 z-0 border border-dashed border-white/20 rounded-full scale-150"
                            />
                        </div>

                        {/* Content Column */}
                        <div className="w-full lg:w-2/3 text-center lg:text-left relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                                什麼是 <span className="text-[#cf2030]">BNI</span>？
                            </h2>
                            <h3 className="text-xl md:text-2xl text-primary-light font-medium mb-6">
                                全球最大商務引薦組織 · 長輝用線上例會把它落地
                            </h3>
                            <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                                BNI（Business Network International）成立於 1985 年，是全球最大的商會暨商務引薦組織，在台灣擁有 245 個分會、近萬名企業主會員。長輝白金分會是全台少數 100% 支援線上與會的商會，我們的核心價值是「付出者收穫」(Givers Gain®)，透過結構化的線上商務引薦系統，協助台灣企業主不受地點限制，與優質商務人士建立長期信任的合作關係。
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="bg-black/20 backdrop-blur-sm border border-white/5 rounded-2xl p-4 text-center hover:bg-white/5 transition-all"
                                >
                                    <div className="text-3xl font-bold text-white mb-1">76+</div>
                                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">國家/地區</div>
                                </motion.div>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="bg-black/20 backdrop-blur-sm border border-white/5 rounded-2xl p-4 text-center hover:bg-white/5 transition-all"
                                >
                                    <div className="text-3xl font-bold text-white mb-1">33萬+</div>
                                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">全球會員</div>
                                </motion.div>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="bg-black/20 backdrop-blur-sm border border-white/5 rounded-2xl p-4 text-center hover:bg-white/5 transition-all"
                                >
                                    <div className="text-3xl font-bold text-white mb-1">百億+</div>
                                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">引薦商機</div>
                                </motion.div>
                            </div>

                            <Link to="/bni">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-4 bg-white text-bg-dark font-bold text-lg rounded-full hover:bg-gray-100 transition-all shadow-lg flex items-center gap-2 mx-auto lg:mx-0"
                                >
                                    深入了解 BNI
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <FAQ />

            <Contact />

        </div>
    );
};

export default Home;
