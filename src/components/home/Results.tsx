```javascript
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
        <section className="py-24 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">成果會說話</h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-4"></div>
                    <p className="text-gray-300 text-base">
                        創會以來 - 資料更新時間：2025/12/13
                    </p>
                </div>

                <div className="mb-20">
                    <ResultsChart />
                </div>

                {/* Mobile Swipe Hint */}
                <div className="md:hidden text-center text-gray-500 text-sm mb-2 animate-pulse">
                    ← 左右滑動查看更多 →
                </div>

                {/* Metrics Grid */}
                <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-4 md:gap-6 pb-4 md:pb-0 px-4 -mx-4 md:mx-0 no-scrollbar items-stretch mask-linear-gradient md:mask-none">
                    <div className="snap-center shrink-0 w-[85vw] md:w-auto">
                        <MetricCard
                            icon={<FileText size={40} />}
                            value={25876}
                            suffix="張"
                            label="總引薦單數"
                        />
                    </div>
                    <div className="snap-center shrink-0 w-[85vw] md:w-auto">
                        <MetricCard
                            icon={<TrendingUp size={40} />}
                            value={580} // 5.8億
                            suffix="億+"
                            label="總交易價值 (TWD)"
                            subtext="NT$ 588,681,643"
                            isCurrency
                        />
                    </div>
                    <div className="snap-center shrink-0 w-[85vw] md:w-auto h-full">
                        <div className="bg-bg-dark/60 backdrop-blur-md border border-primary/20 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center hover:-translate-y-2 transition-transform duration-300 text-center h-full">
                            <div className="text-primary mb-6 p-4 bg-primary/10 rounded-full">
                                <Users size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">邀請來賓參與</h3>
                            <p className="text-gray-400 mb-6 text-base">誠摯邀請您前來體驗我們的聚會。</p>
                            <a href="#contact" className="inline-block px-6 py-2 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors shadow-md text-sm">
                                聯繫我們
                            </a>
                        </div>
                    </div>
                </div>


            </div>
        </section>
    );
};

export default Results;
