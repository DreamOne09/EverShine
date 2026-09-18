import React from 'react';
import { Target, Compass, Flag, Heart } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import SectionLabel from '../common/SectionLabel';

const AboutCard: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode, delay: number, fullWidth?: boolean }> = ({ icon, title, children, delay, fullWidth }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={clsx(
                "glass-panel group flex h-full flex-col items-center rounded-2xl p-8 text-center hover:-translate-y-1",
                fullWidth ? "md:col-span-3" : ""
            )}
        >
            <div className="mb-6 rounded-full border border-white/10 bg-white/[0.04] p-4 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                {icon}
            </div>
            <h3 className="mb-4 font-serif text-2xl font-bold tracking-wide text-white">{title}</h3>
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
                        <SectionLabel>About EverShine</SectionLabel>
                        <h2 className="text-4xl md:text-5xl font-black mb-4 text-primary">關於長輝白金分會</h2>
                        <p className="mx-auto mb-2 max-w-3xl text-lg text-gray-400">全台少數 100% 線上與會的 BNI 白金分會。每週三早晨，用結構化例會把專業變成引薦。</p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto px-4">
                    <div className="h-full">
                        <AboutCard icon={<Target size={32} />} title="核心目的" delay={0}>
                            <p>精進會員的個人成長<br />壯大夥伴彼此的事業</p>
                        </AboutCard>
                    </div>
                    <div className="h-full">
                        <AboutCard icon={<Compass size={32} />} title="使命" delay={0.1}>
                            <p>強化產業合作<br />發展強而有力的夥伴關係<br />創造持續不斷的引薦</p>
                        </AboutCard>
                    </div>
                    <div className="h-full">
                        <AboutCard icon={<Flag size={32} />} title="願景" delay={0.2}>
                            <p>成為企業家首選的<br />商務合作平台</p>
                        </AboutCard>
                    </div>

                    <div className="md:col-span-3 h-full">
                        <AboutCard icon={<Heart size={32} />} title="核心價值" delay={0.3} fullWidth>
                            <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-xl font-bold text-primary">
                                <span>專業</span>
                                <span className="h-3 w-px bg-platinum/40" aria-hidden />
                                <span>誠信</span>
                                <span className="h-3 w-px bg-platinum/40" aria-hidden />
                                <span>熱情</span>
                                <span className="h-3 w-px bg-platinum/40" aria-hidden />
                                <span>實踐</span>
                            </div>
                            <p>以專業態度與誠信為本，懷抱熱忱，將理念化為實際行動</p>
                        </AboutCard>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
