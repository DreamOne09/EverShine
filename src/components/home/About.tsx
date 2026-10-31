import React from 'react';
import clsx from 'clsx';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import SectionLabel from '../common/SectionLabel';
import {
    EmblemExclusiveOrbit,
    EmblemConstellationMesh,
    EmblemDawnCompass,
    EmblemVerifiedLedger,
} from './StarshipEmblems';

const AboutCard: React.FC<{
    icon: React.ReactNode;
    code: string;
    title: string;
    children: React.ReactNode;
    delay?: number;
    fullWidth?: boolean;
}> = ({ icon, code, title, children, delay = 0, fullWidth }) => {
    return (
        <Effect inView fade blur={{ initialBlur: 4 }} slide={{ offset: 16 }} delay={delay} className="h-full">
            <div
                className={clsx(
                    'glass-panel group flex h-full flex-col items-center rounded-2xl p-8 text-center transition-transform duration-300 ease-out hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
                    fullWidth ? 'md:col-span-3' : ''
                )}
            >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-[#06182c]/80 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_0_24px_rgba(76,168,223,0.16)]">
                    {icon}
                </div>
                <span className="mb-1.5 font-mono text-[11px] tracking-[0.22em] text-platinum-light/85 uppercase">
                    {code}
                </span>
                <h3 className="mb-3 text-2xl font-bold tracking-wide text-white">{title}</h3>
                <div className="text-gray-300 leading-relaxed text-base sm:text-lg font-normal">{children}</div>
            </div>
        </Effect>
    );
};

const About: React.FC = () => {
    return (
        <section className="flex flex-col justify-center py-24 relative z-10" id="about">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <Effect inView fade blur={{ initialBlur: 2 }} slide={{ offset: 14 }}>
                        <div>
                            <SectionLabel>Laws of Gravity · 長輝運作法則</SectionLabel>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-white">
                                為什麼 <span className="text-primary">長輝白金分會</span> 能讓引薦自然發生？
                            </h2>
                            <p className="mx-auto mb-2 max-w-3xl text-base sm:text-lg text-gray-300 leading-relaxed">
                                外面的社交場合常換了一疊名片卻沒下文。在長輝，我們用四條清楚的軌道規則，把將近 60 位不同產業的老闆連成同一個合作團隊。
                            </p>
                        </div>
                    </Effect>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto px-4">
                    <div className="h-full">
                        <AboutCard
                            icon={<EmblemExclusiveOrbit size={38} />}
                            code="ORBIT LAW 01"
                            title="一業一代表，同分會不搶單"
                            delay={0}
                        >
                            <p>
                                每個專業在分會裡只收一位代表。只要會內夥伴或他們的客戶有這項需求，第一個對接的就是你，沒有同行削價競爭。
                            </p>
                        </AboutCard>
                    </div>
                    <div className="h-full">
                        <AboutCard
                            icon={<EmblemConstellationMesh size={38} />}
                            code="ORBIT LAW 02"
                            title="上下游結盟，小公司也能接大案"
                            delay={80}
                        >
                            <p>
                                室內設計聯手空調與水電、品牌顧問串聯團服與網站。平常透過一對一摸熟彼此工法與報價，客戶一開口就能整組團隊進場。
                            </p>
                        </AboutCard>
                    </div>
                    <div className="h-full">
                        <AboutCard
                            icon={<EmblemDawnCompass size={38} />}
                            code="ORBIT LAW 03"
                            title="全程 Zoom 晨會，把通勤變產值"
                            delay={160}
                        >
                            <p>
                                每週三早上 06:30 上線、08:30 準時結束。不管你在台北、中南部還是出國出差，打開筆電就能跟全體夥伴對接本週案源。
                            </p>
                        </AboutCard>
                    </div>

                    <div className="md:col-span-3 h-full">
                        <AboutCard
                            icon={<EmblemVerifiedLedger size={38} />}
                            code="CORE COVENANT · 付出者收穫"
                            title="我們的底線：敢把自己的重要客戶放心交給夥伴"
                            delay={240}
                            fullWidth
                        >
                            <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-lg sm:text-xl font-bold text-platinum-soft">
                                <span>本業夠硬</span>
                                <span className="h-3 w-px bg-platinum/40" aria-hidden />
                                <span>報價透明</span>
                                <span className="h-3 w-px bg-platinum/40" aria-hidden />
                                <span>主動回報</span>
                                <span className="h-3 w-px bg-platinum/40" aria-hidden />
                                <span>盯案到底</span>
                            </div>
                            <p className="max-w-3xl mx-auto">
                                介紹客戶等於把自己的招牌押上去。所以在長輝，接了引薦單就一定按時聯繫、回報進度、把服務做好；你先幫夥伴把客戶照顧好，整座星系的生意自然會往你這裡匯聚。
                            </p>
                        </AboutCard>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
