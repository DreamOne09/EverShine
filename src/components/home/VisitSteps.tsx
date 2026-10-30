import React from 'react';
import { CalendarCheck, Laptop, Handshake } from 'lucide-react';
import { Effects } from '@animate-ui/react/primitives/effects/effect';
import { siteConfig } from '../../config/site.config';
import SectionLabel from '../common/SectionLabel';

const STEPS = [
    {
        icon: <CalendarCheck size={22} />,
        title: '私訊幹部，留個名額',
        desc: '跟我們說你做哪一行、哪一週方便來，我們先幫你確認分會裡有沒有撞業，並安排接待的夥伴。',
    },
    {
        icon: <Laptop size={22} />,
        title: `${siteConfig.meeting.dayZh} ${siteConfig.meeting.onlineTime} 開 Zoom 進場`,
        desc: '不用早起趕車，在家或辦公室打開連結就能進會場。前十分鐘大家會先開麥打招呼、互相認識。',
    },
    {
        icon: <Handshake size={22} />,
        title: `${siteConfig.meeting.startTime} 早鳥交流 · ${siteConfig.meeting.formalStartTime} 正式開會`,
        desc: '聽一輪各行各業怎麼在 30 秒內講清楚自己的生意，你也有機會向全場自我介紹，八點半準時收工。',
    },
] as const;

const VisitSteps: React.FC = () => {
    return (
        <section className="relative z-10 px-4 py-16 md:py-20" aria-labelledby="visit-steps-heading">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-12 text-center">
                    <SectionLabel>來訪三步驟</SectionLabel>
                    <h2 id="visit-steps-heading" className="text-3xl font-black tracking-tight text-white md:text-4xl">
                        第一次來，照這三步走
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-gray-400">
                        來賓參觀不收費，也不用做投影片。準備好 30 秒介紹你自己在做什麼就夠了。
                    </p>
                </div>

                <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
                    <div
                        className="pointer-events-none absolute top-[2.25rem] right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-platinum/40 to-transparent md:block"
                        aria-hidden
                    />
                    <Effects inView fade blur={{ initialBlur: 4 }} slide={{ offset: 16 }} holdDelay={90} asChild>
                        {STEPS.map((step, index) => (
                            <article key={step.title} className="relative pt-8">
                                <div className="absolute top-0 left-1/2 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-platinum/45 bg-[#071525] text-platinum-light shadow-[0_0_0_6px_rgba(7,21,37,0.85),0_0_24px_rgba(212,160,23,0.18)]">
                                    {step.icon}
                                </div>
                                <div className="glass-panel h-full rounded-2xl px-6 pt-12 pb-7 text-center md:px-7">
                                    <p className="mb-2 font-mono text-[11px] tracking-[0.28em] text-platinum-light/80">
                                        0{index + 1}
                                    </p>
                                    <h3 className="mb-3 text-lg font-bold tracking-wide text-white">{step.title}</h3>
                                    <p className="text-sm leading-relaxed text-gray-400">{step.desc}</p>
                                </div>
                            </article>
                        ))}
                    </Effects>
                </div>
            </div>
        </section>
    );
};

export default VisitSteps;
