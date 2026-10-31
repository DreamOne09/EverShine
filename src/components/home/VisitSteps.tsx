import React from 'react';
import { Effects } from '@animate-ui/react/primitives/effects/effect';
import { siteConfig } from '../../config/site.config';
import SectionLabel from '../common/SectionLabel';
import { EmblemBeaconLock, EmblemOrbitSync, EmblemBinaryBridge } from './StarshipEmblems';

const STEPS = [
    {
        emblem: <EmblemBeaconLock size={40} />,
        code: 'STEP 01 · BEACON LOCK',
        title: '私訊幹部，鎖定來訪名額',
        desc: '跟我們說你做哪一行、哪個週三方便上線。我們會先幫你確認分會裡有沒有撞業，並安排同產業鏈的夥伴在線上接待你。',
    },
    {
        emblem: <EmblemOrbitSync size={40} />,
        code: 'STEP 02 · ORBIT SYNC',
        title: `${siteConfig.meeting.dayZh} ${siteConfig.meeting.onlineTime} 開 Zoom 進場`,
        desc: '不用早起趕車去飯店。在家或辦公室點開同一條 Zoom 連結就能入座，前十分鐘大家會先開麥打招呼、帶你認識新朋友。',
    },
    {
        emblem: <EmblemBinaryBridge size={40} />,
        code: 'STEP 03 · GRAVITY LINK',
        title: `${siteConfig.meeting.startTime} 早鳥交流 · ${siteConfig.meeting.formalStartTime} 正式開會`,
        desc: '聽一輪近 60 位老闆怎麼在 30 秒內講清楚本週需求，你也有 30 秒向全場介紹自己的事業，八點半準時收工跑業務。',
    },
] as const;

const VisitSteps: React.FC = () => {
    return (
        <section className="relative z-10 px-4 py-16 md:py-24" aria-labelledby="visit-steps-heading">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-12 text-center">
                    <SectionLabel>Docking Protocol · 來訪三步驟</SectionLabel>
                    <h2 id="visit-steps-heading" className="text-3xl font-black tracking-tight text-white md:text-4xl">
                        第一次來參觀，照這三步登艙
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-gray-300">
                        來賓參觀完全免費，也不用做簡報投影片。準備好 30 秒介紹你平常幫客戶解決什麼問題就夠了。
                    </p>
                </div>

                <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
                    <div
                        className="pointer-events-none absolute top-[2.5rem] right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-platinum/45 to-transparent md:block"
                        aria-hidden
                    />
                    <Effects inView fade blur={{ initialBlur: 4 }} slide={{ offset: 16 }} holdDelay={90} asChild>
                        {STEPS.map((step) => (
                            <article key={step.title} className="relative pt-10">
                                <div className="absolute top-0 left-1/2 z-10 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-2xl border border-platinum/45 bg-[#071525] text-primary shadow-[0_0_0_6px_rgba(7,21,37,0.85),0_0_28px_rgba(76,168,223,0.22)]">
                                    {step.emblem}
                                </div>
                                <div className="glass-panel h-full rounded-2xl px-6 pt-12 pb-7 text-center md:px-7">
                                    <p className="mb-2 font-mono text-[11px] tracking-[0.22em] text-platinum-light/90">
                                        {step.code}
                                    </p>
                                    <h3 className="mb-3 text-lg font-bold tracking-wide text-white">{step.title}</h3>
                                    <p className="text-sm leading-relaxed text-gray-300">{step.desc}</p>
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
