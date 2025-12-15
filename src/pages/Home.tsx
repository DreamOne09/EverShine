import React from 'react';
import { motion } from 'framer-motion';
import PageHero from '../components/common/PageHero';
import About from '../components/home/About';
import Results from '../components/home/Results';
import MemberWall from '../components/home/MemberWall';
import FAQ from '../components/home/FAQ';
import Contact from '../components/home/Contact';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="overflow-hidden">
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

                <div className="container mx-auto max-w-6xl relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 md:p-16 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-12 group shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden"
                    >
                        {/* Decorative glow inside card */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#cf2030]/20 blur-[80px] rounded-full"></div>
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/20 blur-[80px] rounded-full"></div>

                        {/* Logo Column */}
                        <div className="w-full lg:w-1/3 flex justify-center lg:justify-start">
                            <motion.div
                                whileHover={{ rotate: [0, -5, 5, 0] }}
                                transition={{ duration: 0.5 }}
                                className="w-48 h-48 md:w-64 md:h-64 bg-white/95 rounded-full flex items-center justify-center p-8 shadow-[0_0_30px_rgba(255,255,255,0.1)] relative z-10"
                            >
                                <img src="/images/assets/logo/bni-logo-new.png" alt="BNI" className="w-full h-auto object-contain" />
                            </motion.div>
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
                            <div className="grid grid-cols-3 gap-4 mb-10 border-t border-b border-white/10 py-6">
                                <div>
                                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">76+</div>
                                    <div className="text-xs md:text-sm text-gray-400">國家/地區</div>
                                </div>
                                <div>
                                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">33萬+</div>
                                    <div className="text-xs md:text-sm text-gray-400">全球會員</div>
                                </div>
                                <div>
                                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">百億+</div>
                                    <div className="text-xs md:text-sm text-gray-400">引薦商機</div>
                                </div>
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
