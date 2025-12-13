import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import { FileText, TrendingUp, Users } from 'lucide-react';


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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
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
                        <h3 className="text-2xl font-bold text-white mb-4">邀請來賓參與</h3>
                        <p className="text-gray-400 mb-8 leading-relaxed">我們誠摯邀請對商務引薦平台有興趣的企業家、業務與經理人，前來體驗我們的聚會活動。</p>
                        <a href="#contact" className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors shadow-md">
                            聯繫我們成為來賓
                        </a>
                    </div>
                </div>

                {/* Success Stories */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">會員成功案例</h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Story 1: Xu Yating */}
                    <div className="bg-bg-dark/80 backdrop-blur-md border border-primary/20 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 group">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50 group-hover:border-primary transition-colors">
                                {/* Placeholder image if no specific image found, or try to find member image */}
                                <img
                                    src="/images/members/許雅婷.jpg"
                                    alt="許雅婷"
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.currentTarget.src = '/images/assets/logo/白色正方形logo.png'}
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">許雅婷</h3>
                                <p className="text-gray-400 text-sm">創業家</p>
                            </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed italic">
                            "許雅婷在創業初期加入BNI，透過會員引薦快速打開市場知名度，第一年就達成業績目標的150%。"
                        </p>
                    </div>

                    {/* Story 2: Li Mengyi */}
                    <div className="bg-bg-dark/80 backdrop-blur-md border border-primary/20 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 group">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50 group-hover:border-primary transition-colors">
                                <img
                                    src="/images/members/李孟亦.jpg"
                                    alt="李孟亦"
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.currentTarget.src = '/images/assets/logo/白色正方形logo.png'}
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">李孟亦</h3>
                                <p className="text-gray-400 text-sm">資深會員</p>
                            </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed italic">
                            "善用BNI系統進行精準引薦，不僅拓展了業務版圖，更協助分會夥伴對接關鍵資源，體現付出者收穫的精神。"
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Results;
