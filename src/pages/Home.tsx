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

            {/* <Results /> - Removed per user request */}
            {/* <Results /> */}

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
                                <h3 className="text-2xl font-bold text-white mb-2">什麼是 BNI？</h3>
                                <p className="text-gray-300 text-lg">全球最大的商務引薦機構，協助您拓展人脈與業務。</p>
                            </div>
                        </div>

                        <Link to="/bni">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3 bg-white text-bg-dark font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                了解更多
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            <FAQ />

            <Contact />

        </div>
    );
};

export default Home;
