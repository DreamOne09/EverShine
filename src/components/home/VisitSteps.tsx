import React from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Laptop, Handshake } from 'lucide-react';
import { siteConfig } from '../../config/site.config';
import SectionLabel from '../common/SectionLabel';

const STEPS = [
    {
        icon: <CalendarCheck size={26} />,
        title: '聯繫三長，預約來訪',
        desc: '告訴我們你的產業與方便時段，我們會協助安排第一次參觀。',
    },
    {
        icon: <Laptop size={26} />,
        title: `${siteConfig.meeting.dayZh} ${siteConfig.meeting.onlineTime} 上線`,
        desc: '用同一條 Zoom 進入線上會場，先熟悉節奏、與會員打招呼。',
    },
    {
        icon: <Handshake size={26} />,
        title: `${siteConfig.meeting.startTime} 早鳥 · ${siteConfig.meeting.formalStartTime} 例會`,
        desc: '早鳥交流後進入結構化例會，看一次真實的引薦如何發生。',
    },
] as const;

const VisitSteps: React.FC = () => {
    return (
        <section className="relative z-10 px-4 py-16 md:py-20" aria-labelledby="visit-steps-heading">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-10 text-center">
                    <SectionLabel>來訪三步驟</SectionLabel>
                    <h2 id="visit-steps-heading" className="text-3xl font-black tracking-tight text-white md:text-4xl">
                        第一次來，這樣走就好
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-gray-400">
                        來賓免費參觀。不需要準備簡報，帶著自己的專業與好奇即可。
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {STEPS.map((step, index) => (
                        <motion.article
                            key={step.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ delay: index * 0.08, duration: 0.45 }}
                            className="glass-panel rounded-2xl p-6 text-center md:p-8"
                        >
                            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-platinum/30 bg-platinum/10 text-platinum-light">
                                {step.icon}
                            </div>
                            <p className="mb-2 text-xs font-mono tracking-[0.2em] text-primary-light">0{index + 1}</p>
                            <h3 className="mb-3 text-lg font-bold text-white">{step.title}</h3>
                            <p className="text-sm leading-relaxed text-gray-400">{step.desc}</p>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VisitSteps;
