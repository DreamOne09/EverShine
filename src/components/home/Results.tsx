import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import { FileText, TrendingUp, Users, Quote } from 'lucide-react';
import { motion } from 'framer-motion';


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
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-4"></div>
                    <p className="text-gray-300 text-base">
                        創會以來 - 資料更新時間：2025/12/13
                    </p>
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
                        subtext="NT$ 588,681,643"
                        isCurrency
                    />
                    <div className="bg-bg-dark/60 backdrop-blur-md border border-primary/20 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center hover:-translate-y-2 transition-transform duration-300 text-center">
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

                {/* Success Stories */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">會員成功案例</h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Success Story 1 - 許雅婷 (Startup) */}
                    <motion.div
                        className="bg-bg-dark/40 backdrop-blur border border-white/5 rounded-2xl p-8 hover:bg-white/5 transition-all group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors">
                                <img
                                    src="/images/members/許雅婷.jpg"
                                    alt="許雅婷"
                                    className="w-full h-full object-cover object-top"
                                    onError={(e) => e.currentTarget.src = '/images/assets/logo/白色正方形logo.png'}
                                />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">許雅婷</h4>
                                <p className="text-base text-gray-300">Worky 人力媒合平台 | 行銷副總</p>
                            </div>
                        </div>

                        <div className="relative">
                            <Quote className="absolute -top-2 -left-2 text-primary/20 w-8 h-8 transform -scale-x-100" />
                            <p className="text-gray-200 leading-relaxed pl-4 border-l-2 border-primary/30 py-1 text-base md:text-lg">
                                半年前加入 BNI 對我來說是大突破。在忙著送小孩上學的早晨還要更早起，不斷走出舒適圈介紹業務。雖然辛苦，但我認識了很多好夥伴。我們互助合作，不只是做生意，更像一群專業顧問一起幫客戶解題。尤其長輝是線上分會，這份情感很難得。透過 BNI 全球系統，我有機會跟外分會連結，將生意延伸到更多產業與地方。
                            </p>
                        </div>
                    </motion.div>

                    {/* Success Story 2 - 李孟一 (Industry Cooperation) */}
                    <motion.div
                        className="bg-bg-dark/40 backdrop-blur border border-white/5 rounded-2xl p-8 hover:bg-white/5 transition-all group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors">
                                <img
                                    src="/images/members/李孟一.jpg"
                                    alt="李孟一"
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.currentTarget.src = '/images/assets/logo/白色正方形logo.png'}
                                />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">李孟一</h4>
                                <p className="text-base text-gray-300">教育培訓 | 2022年加入</p>
                            </div>
                        </div>

                        <div className="relative">
                            <Quote className="absolute -top-2 -left-2 text-primary/20 w-8 h-8 transform -scale-x-100" />
                            <p className="text-gray-200 leading-relaxed pl-4 border-l-2 border-primary/30 py-1 text-base md:text-lg">
                                過去我單打獨鬥推廣課程，資源相當有限。加入 BNI 後，我與分會中的企業顧問、行銷專家組成了「教育產業鏈」。透過跨產業的資源整合，我們共同開發了多個大型企業培訓案，這是我以前一個人完全無法接觸到的市場規模。
                            </p>
                        </div>
                    </motion.div>

                    {/* Success Story 3 - 王年煜 (Leadership) */}
                    <motion.div
                        className="bg-bg-dark/40 backdrop-blur border border-white/5 rounded-2xl p-8 hover:bg-white/5 transition-all group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors">
                                <img
                                    src="/images/members/王年煜.jpg"
                                    alt="王年煜"
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.currentTarget.src = '/images/assets/logo/白色正方形logo.png'}
                                />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">王年煜</h4>
                                <p className="text-base text-gray-300">AI程式交易 | 現任主席</p>
                            </div>
                        </div>

                        <div className="relative">
                            <Quote className="absolute -top-2 -left-2 text-primary/20 w-8 h-8 transform -scale-x-100" />
                            <p className="text-gray-200 leading-relaxed pl-4 border-l-2 border-primary/30 py-1 text-base md:text-lg">
                                擔任主席期間，我見證了無數會員透過 BNI 系統實現夢想。這裡不只是交換名片的地方，更是一個能夠激發彼此潛能、共同面對商業挑戰的大家庭。長輝分會的獨特文化，讓我們在競爭激烈的市場中，依然保有溫暖與互助。
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Results;
