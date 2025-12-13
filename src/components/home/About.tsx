import React from 'react';
import { Target, Compass, Flag, Heart } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const AboutCard: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode, delay: number, fullWidth?: boolean }> = ({ icon, title, children, delay, fullWidth }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={clsx(
                "bg-bg-dark/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center hover:bg-bg-dark/60 hover:border-primary/30 transition-all duration-300 group shadow-lg hover:shadow-xl hover:-translate-y-1",
                fullWidth ? "md:col-span-3" : ""
            )}
        >
            <div className="text-primary mb-6 p-4 bg-white/5 rounded-full group-hover:bg-primary group-hover:text-bg-dark transition-all duration-300 transform group-hover:scale-110">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 font-serif tracking-wide">{title}</h3>
            <div className="text-gray-300 leading-relaxed text-lg font-light">
                {children}
            </div>
        </motion.div>
    );
};

const About: React.FC = () => {
    return (
        <section className="min-h-screen flex flex-col justify-center py-24 relative z-10" id="about">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-6 text-primary">關於我們</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto rounded-full opacity-80"></div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <AboutCard icon={<Target size={32} />} title="Core Purpose" delay={0}>
                        <p>精進會員的個人成長<br />壯大夥伴彼此的事業</p>
                    </AboutCard>
                    <AboutCard icon={<Compass size={32} />} title="Mission" delay={0.1}>
                        <p>強化產業合作<br />發展強而有力的夥伴關係<br />創造持續不斷的引薦</p>
                    </AboutCard>
                    <AboutCard icon={<Flag size={32} />} title="Vision" delay={0.2}>
                        <p>成為企業家首選的<br />商務合作平台</p>
                    </AboutCard>

                    <AboutCard icon={<Heart size={32} />} title="核心價值" delay={0.3} fullWidth>
                        <div className="flex flex-wrap justify-center items-center gap-4 text-xl font-bold text-primary mb-4">
                            <span>專業</span>
                            <span className="text-gray-600/50">|</span>
                            <span>誠信</span>
                            <span className="text-gray-600/50">|</span>
                            <span>熱情</span>
                            <span className="text-gray-600/50">|</span>
                            <span>實踐</span>
                        </div>
                        <p>以專業態度與誠信為本，懷抱熱忱，將理念化為實際行動</p>
                    </AboutCard>
                </div>
            </div>
        </section>
    );
};

export default About;
