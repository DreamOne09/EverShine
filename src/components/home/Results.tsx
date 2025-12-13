import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import { FileText, TrendingUp, Users, Quote } from 'lucide-react';


const MetricCard: React.FC<{ icon: React.ReactNode, value: number, suffix: string, label: string, subtext?: string, isCurrency?: boolean }> = ({ icon, value, suffix, label, subtext, isCurrency }) => {
    const { count, elementRef } = useCountUp(value);

    return (
        <div ref={elementRef} className="bg-bg-dark/60 backdrop-blur-md border border-primary/20 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center hover:-translate-y-2 transition-transform duration-300">
            <div className="text-primary mb-6 p-4 bg-primary/10 rounded-full">
                {icon}
            </div>
            <div className="text-4xl lg:text-5xl font-bold text-white mb-2 font-mono tabular-nums">
                {isCurrency ? (count / 100).toFixed(1) : count.toLocaleString()}
                <span className="text-2xl ml-1 text-gray-400 font-sans">{suffix}</span>
            </div>
            <div className="text-gray-300 font-medium text-lg uppercase tracking-wide mt-2">{label}</div>
            {subtext && <div className="text-sm text-gray-500 mt-2">{subtext}</div>}
        </div>
    );
};

import ResultsChart from './ResultsChart';

const Results: React.FC = () => {
    return (
        <section className="py-20 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">成果會說話</h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                </div>

                <div className="mb-20">
                    <ResultsChart />
                </div>

                <div className="mb-20">
                    <ResultsChart />
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    <MetricCard
                        icon={<FileText size={40} />}
                        value={25876}
                        suffix="張"
                        label="總引薦單數"
                    />
                    <MetricCard
                        icon={<TrendingUp size={40} />}
                        value={580} // 5.8億
                        suffix="億+"
                        label="總交易價值 (TWD)"
                        subtext="NT$ 588,681,..."
                        isCurrency
                    />
                    <div className="bg-bg-dark/60 backdrop-blur-md border border-primary/20 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center hover:-translate-y-2 transition-transform duration-300 text-center">
                        <div className="text-primary mb-6 p-4 bg-primary/10 rounded-full">
                            <Users size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">邀請來賓參與</h3>
                        <p className="text-gray-400 mb-6 text-sm">誠摯邀請您前來體驗我們的聚會。</p>
                        <a href="#contact" className="inline-block px-6 py-2 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors shadow-md text-sm">
                            聯繫我們
                        </a>
                    </div>
                </div>

                {/* Success Stories */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">會員成功案例</h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Story 1: Xu Yating */}
                    <div className="bg-bg-dark/80 backdrop-blur-md border border-primary/20 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 group flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/50 group-hover:border-primary transition-colors shrink-0">
                                <img
                                    src="/images/members/許雅婷.jpg"
                                    alt="許雅婷"
                                    className="w-full h-full object-cover object-[center_top]"
                                    onError={(e) => e.currentTarget.src = '/images/assets/logo/白色正方形logo.png'}
                                />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">許雅婷</h3>
                                <div className="text-primary text-sm font-medium mb-1">健康美麗產業 / 創業家</div>
                                <p className="text-gray-400 text-xs">加入時間：2023年</p>
                            </div>
                        </div>
                        <div className="relative pl-6 border-l-2 border-primary/30">
                            <Quote className="absolute -left-2.5 -top-2 bg-bg-dark text-primary" size={20} />
                            <p className="text-gray-300 leading-relaxed italic mb-4">
                                "創業初期，我面臨著開拓市場的巨大壓力，人脈資源也相對匱乏。加入長輝白金分會後，一切開始有了轉機。"
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                透過 BNI 系統化的商務培訓與每週的例會，我學會了如何精準地介紹自己的業務，更重要的是，我獲得了一群願意無私為我引薦生意的夥伴。在他們的協助下，我的品牌知名度在短短一年內大幅提升，首年業績更達到了預期目標的 150%。這裡不只是一個商務平台，更是一個溫暖的大家庭。
                            </p>
                        </div>
                    </div>

                    {/* Story 2: Li Mengyi */}
                    <div className="bg-bg-dark/80 backdrop-blur-md border border-primary/20 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 group flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/50 group-hover:border-primary transition-colors shrink-0">
                                <img
                                    src="/images/members/李孟一.jpg"
                                    alt="李孟一"
                                    className="w-full h-full object-cover object-[center_top]"
                                    onError={(e) => e.currentTarget.src = '/images/assets/logo/白色正方形logo.png'}
                                />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">李孟一</h3>
                                <div className="text-primary text-sm font-medium mb-1">休閒教育產業 / 夢想一號</div>
                                <p className="text-gray-400 text-xs">加入時間：2020年</p>
                            </div>
                        </div>
                        <div className="relative pl-6 border-l-2 border-primary/30">
                            <Quote className="absolute -left-2.5 -top-2 bg-bg-dark text-primary" size={20} />
                            <p className="text-gray-300 leading-relaxed italic mb-4">
                                "BNI 的核心價值『付出者收穫』深深影響了我。在這裡，我們不只是交換名片，更是交換信任與承諾。"
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                身為資深會員，我見證了分會的成長，也透過這個平台將魔術方塊教育推廣到全台灣。善用 BNI 的 Power Team 系統，我與教育界的夥伴們進行了深度資源整合，不僅成功拓展了個人的業務版圖，更協助許多夥伴對接了關鍵的企業資源。在長輝，一個人走得快，但一群人走得更遠。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Results;
