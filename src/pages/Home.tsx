import React from 'react';
import { motion } from 'framer-motion';
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
            <section className="min-h-screen flex flex-col justify-center items-center text-center relative z-10 pt-0">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="mt-[-5vh]"
                >
                    <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight font-sans px-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#f0e6d2] via-[#c5a47e] to-[#8a6e4b] drop-shadow-2xl">
                            長輝白金分會
                        </span>
                    </h1>
                    <p className="text-xl md:text-3xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed font-light px-4">
                        我們一起，打造你的夢幻 Team<br />
                        <span className="text-[#c5a47e] font-sans font-medium mt-4 block text-2xl tracking-wide opacity-90">Stand by we! We are one team.</span>
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center px-4">
                        <motion.a
                            href="#contact"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-4 bg-gradient-to-r from-[#c5a47e] to-[#b08d55] text-[#06203a] font-bold text-lg rounded-full shadow-[0_0_30px_rgba(197,164,126,0.4)] hover:shadow-[0_0_50px_rgba(197,164,126,0.6)] transition-all duration-300 transform border border-[#f0e6d2]/30 w-full md:w-auto"
                        >
                            加入我們
                        </motion.a>
                        <Link to="/bni">
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-4 bg-transparent border-2 border-[#c5a47e] text-[#c5a47e] font-bold text-lg rounded-full hover:bg-[#c5a47e]/10 transition-all duration-300 backdrop-blur-sm w-full md:w-auto"
                            >
                                什麼是 BNI ?
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400"
                >
                    <div className="w-6 h-10 border-2 border-gray-400/50 rounded-full flex justify-center p-1 backdrop-blur-sm">
                        <div className="w-1 h-2 bg-[#c5a47e] rounded-full animate-bounce"></div>
                    </div>
                </motion.div>
            </section>

            {/* What is BNI Link Section */}
            <section className="py-12 relative z-10 px-4">
                <div className="container mx-auto max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-white/10 transition-colors group shadow-2xl relative overflow-hidden"
                    >
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#cf2030]/10 blur-[80px] rounded-full -z-10"></div>

                        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                            <div className="w-24 h-24 bg-white/95 rounded-full flex items-center justify-center p-4 shadow-xl group-hover:scale-110 transition-transform duration-300 shrink-0">
                                <img src="/images/assets/logo/bni-logo-new.png" alt="BNI" className="w-full h-auto object-contain" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-3">什麼是 BNI?</h2>
                                <p className="text-gray-300 text-lg max-w-lg leading-relaxed">了解全球最大商務引薦平台，成立40年，遍及76+國家，34萬+會員</p>
                            </div>
                        </div>
                        <Link to="/bni" className="shrink-0 w-full md:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full md:w-auto px-8 py-3 bg-[#cf2030] text-white font-bold rounded-full shadow-lg hover:bg-[#a01825] transition-colors whitespace-nowrap text-lg"
                            >
                                深入了解 BNI
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            <About />

            <MemberWall />

            <Results />

            <FAQ />

            <Contact />

        </div>
    );
};

export default Home;
