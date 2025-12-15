import React from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';
import PageHero from '../components/common/PageHero';

const StatCard: React.FC<{ value: number, label: React.ReactNode, subtext?: string, isLarge?: boolean }> = ({ value, label, subtext, isLarge }) => {
    const { count, elementRef } = useCountUp(value, 2000);

    return (
        <div ref={elementRef} className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center ${isLarge ? 'md:col-span-2 md:row-span-2 flex flex-col justify-center items-center bg-primary/10 border-primary/30 shadow-[0_0_30px_rgba(76,168,223,0.1)]' : 'hover:bg-white/10 transition-colors'}`}>
            <div className={`font-bold text-white mb-2 font-mono ${isLarge ? 'text-6xl md:text-7xl text-primary' : 'text-4xl md:text-5xl'}`}>
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
        <div className="min-h-screen pt-0">
            <PageHero
                title="關於 BNI"
                subtitle={
                    <>
                        全球最大商務引薦平台<br />
                        成立40年，遍及76+國家，11,300+分會，34萬+會員
                    </>
                }
            />

            {/* Data Notice */}
            <div className="bg-primary/10 border-y border-primary/20 py-3 text-center text-sm text-primary font-mono tracking-wide">
                <strong>資料截止日期：2025年10月25日</strong>
                <span className="mx-2 opacity-50">|</span>
                實際數據可能因時間推移而有所變化
            </div>

            {/* Global Stats */}
            <section className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">全球影響力數據</h2>
                    <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
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
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono">245</div>
                            <div className="text-gray-300 font-medium">分會</div>
                        </div>
                        <div className="p-4 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono">9,932</div>
                            <div className="text-gray-300 font-medium">會員</div>
                        </div>
                        <div className="p-4 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono">72萬+</div>
                            <div className="text-gray-300 font-medium">引薦單數<br /><span className="text-xs text-gray-500 font-normal">(過去12個月)</span></div>
                        </div>
                        <div className="p-4 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono">253</div>
                            <div className="text-gray-300 font-medium">成交金額<br /><span className="text-xs text-gray-500 font-normal">(億新台幣)</span></div>
                        </div>
                        <div className="p-4 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono">73</div>
                            <div className="text-gray-300 font-medium">平均每位會員<br /><span className="text-xs text-gray-500 font-normal">每年引薦數</span></div>
                        </div>
                        <div className="p-4 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono">255</div>
                            <div className="text-gray-300 font-medium">平均每位會員<br /><span className="text-xs text-gray-500 font-normal">每年成交價值 (萬)</span></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7 Core Values */}
            <section className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">BNI 七大核心價值</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">這些核心價值是我們文化與成功的基石</p>
                    <div className="w-16 h-1 bg-primary mx-auto rounded-full mt-4"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {[
                        { title: "Givers Gain® 付出者收穫", desc: "這是 BNI 的哲學。我們相信透過幫助他人，自己也將受益。當您願意為他人引薦業務時，他人也會樂意為您引薦。" },
                        { title: "Building Relationships 建立關係", desc: "我們不僅僅是交換名片，而是建立長期、信任的商務關係。良好的人脈建立在信任之上。" },
                        { title: "Lifelong Learning 終身學習", desc: "我們相信持續學習是個人與企業成長的關鍵。BNI 提供豐富的培訓資源幫助會員提升。" },
                        { title: "Traditions + Innovation 傳統 + 創新", desc: "我們尊重經過驗證的系統與傳統，同時也擁抱創新，隨著時代進步不斷優化。" },
                        { title: "Positive Attitude 正面積極", desc: "積極的態度具有感染力。我們致力於營造一個互相支持、充滿正能量的商務環境。" },
                        { title: "Accountability 當責", desc: "即使是志工性質的商務組織，我們也強調責任感。信守承諾是建立信任的基礎。" },
                        { title: "Recognition 認可與表揚", desc: "我們樂於表揚會員的付出與成就。認可是推動團隊前進的重要動力。" }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all hover:border-primary/50 group"
                        >
                            <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-white transition-colors">{item.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Meeting Agenda */}
            <section className="py-20 bg-white/5 border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">標準會議流程</h2>
                        <p className="text-gray-400">高效、結構化的 90 分鐘會議，極大化商務效益</p>
                        <div className="w-16 h-1 bg-white/20 mx-auto rounded-full mt-4"></div>
                    </div>

                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        {[
                            "01. 自由聯誼 (Open Networking)",
                            "02. 歡迎會員與來賓",
                            "03. 目的與概況介紹",
                            "04. 人脈教育培訓 (Networking Education)",
                            "05. 認可與表揚 (Recognition)",
                            "06. 會員 60 秒專業簡報 (Weekly Presentations)",
                            "07. 歡迎新會員",
                            "08. 來賓自我介紹",
                            "09. 副主席報告 (Vice President's Report)",
                            "10. 會員委員會報告 (Membership Committee Report)",
                            "11. 秘書/財務報告",
                            "12. 10分鐘主題簡報 (Feature Presentation)",
                            "13. 引薦與見證 (Referrals & Testimonials)",
                            "14. 引薦真實驗證 (Referral Reality Check)",
                            "15. 再次報告 (Secretary/Treasurer's Report)",
                            "16. 主席結語 (President's Closing)",
                            "17. 本週金句",
                            "18. 會議結束與商務交流"
                        ].map((step, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 border-b border-white/5 hover:bg-white/5 transition-colors rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                                <span className="text-gray-300 font-mono text-sm md:text-base">{step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Join */}
            <section className="py-20 container mx-auto px-4">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary/10 to-bg-dark border border-primary/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                    <h2 className="text-3xl font-bold text-white mb-6 relative z-10">為什麼加入 BNI？</h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed relative z-10">
                        BNI 提供了一個正向、支持及結構化的環境，透過人脈引薦來發展您的業務。
                        我們的會員享有獨家權利，每個分會中每個行業類別只允許一位代表加入，
                        這意味著您將獨佔該分會的所有該行業引薦資源。
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                        <div className="p-4">
                            <div className="text-4xl mb-3">🤝</div>
                            <h3 className="font-bold text-white mb-2">獨家席位</h3>
                            <p className="text-sm text-gray-400">鎖定您的行業類別，阻擋競爭對手。</p>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl mb-3">📈</div>
                            <h3 className="font-bold text-white mb-2">持續引薦</h3>
                            <p className="text-sm text-gray-400">獲得經過預先篩選的高質量業務引薦。</p>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl mb-3">🌍</div>
                            <h3 className="font-bold text-white mb-2">全球資源</h3>
                            <p className="text-sm text-gray-400">連結全球 76+ 國家、30 萬+ 企業主的商務網絡。</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BNIPage;

                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-2 relative z-10">Givers Gain</h3>
                    <p className="text-xl text-[#cf2030] font-bold mb-8 tracking-[0.5em] uppercase relative z-10">付出者收穫</p>
                    <p className="text-gray-300 leading-relaxed text-lg max-w-2xl mx-auto relative z-10">
                        BNI 的核心價值觀，透過無私的付出與分享，建立互信互惠的商業關係，最終獲得更大的收穫與成長。
                    </p>
                </div >
            </section >

    {/* Three Results */ }
    < section className = "py-20 pb-40 container mx-auto px-4" >
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
            </section >
        </div >
    );
};

export default BNIPage;
