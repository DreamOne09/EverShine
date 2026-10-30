import React from 'react';
import { Target, Compass, Flag, Heart } from 'lucide-react';
import clsx from 'clsx';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import SectionLabel from '../common/SectionLabel';

const AboutCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    delay?: number;
    fullWidth?: boolean;
}> = ({ icon, title, children, delay = 0, fullWidth }) => {
    return (
        <Effect inView fade blur={{ initialBlur: 4 }} slide={{ offset: 16 }} delay={delay} className="h-full">
            <div
                className={clsx(
                    'glass-panel group flex h-full flex-col items-center rounded-2xl p-8 text-center transition-transform duration-300 ease-out hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
                    fullWidth ? 'md:col-span-3' : ''
                )}
            >
                <div className="mb-6 rounded-full border border-white/10 bg-white/[0.04] p-4 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                    {icon}
                </div>
                <h3 className="mb-4 font-serif text-2xl font-bold tracking-wide text-white">{title}</h3>
                <div className="text-gray-300 leading-relaxed text-lg font-light">{children}</div>
            </div>
        </Effect>
    );
};

const About: React.FC = () => {
    return (
        <section className="min-h-screen flex flex-col justify-center py-24 relative z-10" id="about">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <Effect inView fade blur={{ initialBlur: 2 }} slide={{ offset: 14 }}>
                        <div>
                            <SectionLabel>About EverShine</SectionLabel>
                            <h2 className="text-4xl md:text-5xl font-black mb-4 text-primary">關於長輝白金分會</h2>
                            <p className="mx-auto mb-2 max-w-3xl text-lg text-gray-400">
                                我們是全程在 Zoom 上開會的 BNI 白金分會。每週三早上六點半見面，一業一代表，不拚應酬、只看誰能幫夥伴把生意做成。
                            </p>
                        </div>
                    </Effect>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto px-4">
                    <div className="h-full">
                        <AboutCard icon={<Target size={32} />} title="我們在做的事" delay={0}>
                            <p>
                                把自己的本業做深<br />
                                也幫分會夥伴把生意做大
                            </p>
                        </AboutCard>
                    </div>
                    <div className="h-full">
                        <AboutCard icon={<Compass size={32} />} title="合作方式" delay={80}>
                            <p>
                                不同產業聯手接案<br />
                                熟了才敢放心轉介紹<br />
                                讓引薦變成穩定的案源
                            </p>
                        </AboutCard>
                    </div>
                    <div className="h-full">
                        <AboutCard icon={<Flag size={32} />} title="共同目標" delay={160}>
                            <p>
                                遇到客戶需求時<br />
                                第一個就能想到分會裡的自己人
                            </p>
                        </AboutCard>
                    </div>

                    <div className="md:col-span-3 h-full">
                        <AboutCard icon={<Heart size={32} />} title="我們的默契" delay={240} fullWidth>
                            <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-xl font-bold text-primary">
                                <span>專業</span>
                                <span className="h-3 w-px bg-platinum/40" aria-hidden />
                                <span>誠信</span>
                                <span className="h-3 w-px bg-platinum/40" aria-hidden />
                                <span>熱情</span>
                                <span className="h-3 w-px bg-platinum/40" aria-hidden />
                                <span>說到做到</span>
                            </div>
                            <p>敢把自己的客戶交給夥伴，前提是大家本事夠、講信用，而且接了案子一定盯到底。</p>
                        </AboutCard>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
