import React from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';

const StatCard: React.FC<{ value: number, label: React.ReactNode, subtext?: string, isLarge?: boolean }> = ({ value, label, subtext, isLarge }) => {
    const { count, elementRef } = useCountUp(value, 2000);

    return (
        <div ref={elementRef} className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center ${isLarge ? 'md:col-span-2 md:row-span-2 flex flex-col justify-center items-center bg-[#cf2030]/10 border-[#cf2030]/30 shadow-[0_0_30px_rgba(207,32,48,0.1)]' : 'hover:bg-white/10 transition-colors'}`}>
            <div className={`font-bold text-white mb-2 font-mono ${isLarge ? 'text-6xl md:text-7xl text-[#cf2030]' : 'text-4xl md:text-5xl'}`}>
                {value >= 10000 ? (count / 10000).toFixed(0) + '萬' : count.toLocaleString()}
                <span className="text-2xl ml-1 align-top">+</span>
            </div>
            <div className={`text-gray-300 ${isLarge ? 'text-xl font-bold' : 'text-sm'}`}>
                {label}
            </div>
            {subtext && <div className="text-gray-500 text-xs mt-1">{subtext}</div>}
        </div>
    );
};

const BNIPage: React.FC = () => {
    return (
        <div className="min-h-screen pt-0 bg-[#050505]">
            {/* Hero */}
            <section className="relative min-h-[50vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden pt-20">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06203a]/50 to-[#050505] z-0 pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-4xl mx-auto"
                >
                    <div className="mb-6 flex justify-center">
                        <img src="/images/assets/logo/BNI紅色商標.png" alt="BNI" className="h-24 md:h-32 object-contain filter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">全球最大商務引薦平台</h1>
                    <p className="text-xl md:text-2xl text-gray-300">成立40年，遍及76+國家，11,300+分會，34萬+會員</p>
                </motion.div>
            </section>

            {/* Data Notice */}
            <div className="bg-[#cf2030]/10 border-y border-[#cf2030]/20 py-3 text-center text-sm text-[#cf2030] font-mono tracking-wide">
                <strong>資料截止日期：2025年10月25日</strong>
                <span className="mx-2 opacity-50">|</span>
                實際數據可能因時間推移而有所變化
            </div>

            {/* Global Stats */}
            <section className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">全球影響力數據</h2>
                    <div className="w-16 h-1 bg-[#cf2030] mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
                    <StatCard isLarge value={7500} label={<>全球引薦金額<br />(億新台幣)</>} subtext="最近12個月" />
                    <StatCard value={76} label="全球國家" />
                    <StatCard value={11300} label="全球分會" />
                    <StatCard value={340000} label="全球會員" />
                    <StatCard value={16800000} label={<>全球引薦單<br />(最近12個月)</>} />
                </div>
            </section>

            {/* Taiwan Stats */}
            <section className="py-20 bg-white/5 relative border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">台灣 BNI 卓越表現</h2>
                        <div className="w-16 h-1 bg-white/20 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
                        <div className="p-4 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="text-4xl md:text-5xl font-bold text-[#cf2030] mb-2 font-mono">245</div>
                            <div className="text-gray-300 font-medium">分會</div>
                        </div>
                        <div className="p-4 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="text-4xl md:text-5xl font-bold text-[#cf2030] mb-2 font-mono">9,932</div>
                            <div className="text-gray-300 font-medium">會員</div>
                        </div>
                        <div className="p-4 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="text-4xl md:text-5xl font-bold text-[#cf2030] mb-2 font-mono">72萬+</div>
                            <div className="text-gray-300 font-medium">引薦單數<br /><span className="text-xs text-gray-500 font-normal">(過去12個月)</span></div>
                        </div>
                        <div className="p-4 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="text-4xl md:text-5xl font-bold text-[#cf2030] mb-2 font-mono">253</div>
                            <div className="text-gray-300 font-medium">成交金額<br /><span className="text-xs text-gray-500 font-normal">(億新台幣)</span></div>
                        </div>
                        <div className="p-4 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="text-4xl md:text-5xl font-bold text-[#cf2030] mb-2 font-mono">73</div>
                            <div className="text-gray-300 font-medium">平均每位會員<br /><span className="text-xs text-gray-500 font-normal">每年引薦數</span></div>
                        </div>
                        <div className="p-4 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="text-4xl md:text-5xl font-bold text-[#cf2030] mb-2 font-mono">255</div>
                            <div className="text-gray-300 font-medium">平均每位會員<br /><span className="text-xs text-gray-500 font-normal">每年成交價值 (萬)</span></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Culture */}
            <section className="py-24 container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#cf2030]/20 to-[#06203a] border border-[#cf2030]/30 rounded-3xl p-8 md:p-12 text-center shadow-[0_0_50px_rgba(207,32,48,0.2)] relative overflow-hidden group">
                    {/* Decorative background circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#cf2030]/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#cf2030]/20 transition-colors duration-500"></div>

                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-2 relative z-10">Givers Gain</h3>
                    <p className="text-xl text-[#cf2030] font-bold mb-8 tracking-[0.5em] uppercase relative z-10">付出者收穫</p>
                    <p className="text-gray-300 leading-relaxed text-lg max-w-2xl mx-auto relative z-10">
                        BNI 的核心價值觀，透過無私的付出與分享，建立互信互惠的商業關係，最終獲得更大的收穫與成長。
                    </p>
                </div>
            </section>

            {/* Three Results */}
            <section className="py-20 pb-40 container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-white">BNI 創造三個結果</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        { title: "事業成長 200%~300%", desc: "透過 BNI 的引薦機制，會員事業獲得顯著成長，平均成長幅度達到 200% 至 300%。", icon: "📈", color: "from-green-500/20 to-green-900/20" },
                        { title: "服務、產品 → 創新", desc: "與各領域專業人士交流，激發創新思維，持續優化服務與產品品質。", icon: "💡", color: "from-yellow-500/20 to-yellow-900/20" },
                        { title: "事業在地全球化", desc: "透過 BNI 全球網絡，將本地事業擴展至國際市場，實現事業的全球化發展。", icon: "🌏", color: "from-blue-500/20 to-blue-900/20" }
                    ].map((item, i) => (
                        <div key={i} className={`bg-gradient-to-br ${item.color} backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-white/30 transition-all hover:-translate-y-2 duration-300 flex flex-col h-full`}>
                            <div className="text-5xl mb-6 bg-white/10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg">{item.icon}</div>
                            <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                            <p className="text-gray-300 leading-relaxed flex-grow">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default BNIPage;
