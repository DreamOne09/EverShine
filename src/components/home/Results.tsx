import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import { FileText, TrendingUp, Users } from 'lucide-react';


const MetricCard: React.FC<{ icon: React.ReactNode, value: number, suffix: string, label: string, subtext?: string, isCurrency?: boolean }> = ({ icon, value, suffix, label, subtext, isCurrency }) => {
    const { count, elementRef } = useCountUp(value);

    return (
        <div ref={elementRef} className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center hover:-translate-y-2 transition-transform duration-300">
            <div className="text-primary mb-6 p-4 bg-primary/10 rounded-full">
                {icon}
            </div>
            <div className="text-4xl lg:text-5xl font-bold text-bg-dark mb-2 font-mono tabular-nums">
                {isCurrency ? (count / 100).toFixed(1) : count.toLocaleString()}
                <span className="text-2xl ml-1 text-gray-500 font-sans">{suffix}</span>
            </div>
            <div className="text-gray-600 font-medium text-lg uppercase tracking-wide mt-2">{label}</div>
            {subtext && <div className="text-sm text-gray-400 mt-2">{subtext}</div>}
        </div>
    );
};

const Results: React.FC = () => {
    return (
        <section className="py-24 relative z-10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">成果會說話，而非空談</h2>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">長輝創會至今 (截至 2025/11/28)，我們透過系統化的商務引薦，持續為會員創造實際的商業價值。</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                    <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center hover:-translate-y-2 transition-transform duration-300 text-center">
                        <div className="text-primary mb-6 p-4 bg-primary/10 rounded-full">
                            <Users size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-bg-dark mb-4">邀請來賓參與</h3>
                        <p className="text-gray-600 mb-8 leading-relaxed">我們誠摯邀請對商務引薦平台有興趣的企業家、業務與經理人，前來體驗我們的聚會活動。</p>
                        <a href="#contact" className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors shadow-md">
                            聯繫我們成為來賓
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Results;
