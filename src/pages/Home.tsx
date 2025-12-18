import React from 'react';
import { motion } from 'framer-motion';
import PageHero from '../components/common/PageHero';
import About from '../components/home/About';
import Results from '../components/home/Results';
import MemberWall from '../components/home/MemberWall';
import FAQ from '../components/home/FAQ';
import Contact from '../components/home/Contact';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const Home: React.FC = () => {
    return (
        <div className="overflow-hidden">
            <SEO
                description="BNI長輝白金分會提供專業的商務對接與引薦服務，協助企業主擴展人脈，精準媒合商務資源，實現業務共贏。"
                keywords="BNI長輝, 商務引薦, 台北業務合作, 企業家人脈, 白金分會"
            />
            {/* Hero Section */}
            <PageHero
                title="BNI長輝白金分會"
                subtitle={
                    <>
                        我們一起，打造你的夢幻 Team<br />
                        <span className="text-[#38bdf8] font-sans font-medium mt-4 block text-2xl tracking-wide opacity-90">Stand by we! We are one team.</span>
                    </>
                }
                showScrollIndicator
            >
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-8 px-4">
                    <motion.a
                        href="#contact"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-4 bg-gradient-to-r from-primary to-primary-dark text-bg-dark font-bold text-lg rounded-full shadow-[0_0_30px_rgba(76,168,223,0.4)] hover:shadow-[0_0_50px_rgba(76,168,223,0.6)] transition-all duration-300 transform border border-primary-light/30 w-full md:w-auto"
                    >
                        加入我們
                    </motion.a>
                </div>
            </PageHero>

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
                                <img src="/images/assets/logo/bni-logo-new.png" alt="BNI" className="w-full h-auto object-contain transform hover:scale-105 transition-transform duration-500" />
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
                            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                                什麼是 <span className="text-[#cf2030]">BNI</span>？
                            </h3>
                            <h4 className="text-xl md:text-2xl text-primary-light font-medium mb-6">
                                全球最大的商務引薦機構
                            </h4>
                            <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                                BNI 成立於 1985 年，擁有超過 38 年的歷史。我們的核心價值是「付出者收穫」(Givers Gain®)，透過有組織、正向且專業的引薦計畫，協助會員與優質的商務人士建立長期、信任的合作關係，進而壯大彼此的事業。
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
