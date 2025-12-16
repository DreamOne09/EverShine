import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQItem: React.FC<{ question: string, answer: React.ReactNode, isOpen: boolean, toggle: () => void, index: number }> = ({ question, answer, isOpen, toggle, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="border-b border-white/10 last:border-0"
        >
            <button
                onClick={toggle}
                className="w-full py-6 flex items-center justify-between text-left group focus:outline-none"
            >
                <span className={`text-xl md:text-2xl font-medium transition-colors duration-300 pr-8 ${isOpen ? 'text-primary' : 'text-white group-hover:text-primary'}`}>
                    {question}
                </span>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${isOpen ? 'bg-primary border-primary text-bg-dark' : 'border-white/20 text-gray-400 group-hover:border-primary group-hover:text-primary'}`}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="text-gray-400 leading-relaxed pb-8 text-lg md:text-xl">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="min-h-screen flex flex-col justify-center py-20 relative overflow-hidden" id="faq">
            <div className="container mx-auto px-4 z-10 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-black mb-4 text-white">常見問題</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        關於加入 BNI 的長輝白金分會，我們整理了大家最關心的問題
                    </p>
                </motion.div>

                <div className="max-w-3xl mx-auto space-y-4">
                    <FAQItem
                        index={0}
                        isOpen={openIndex === 0}
                        toggle={() => toggle(0)}
                        question="加入 BNI 需要什麼資格？"
                        answer={
                            <>
                                <p className="mb-3 text-primary font-bold">我們尋找遵守 321A 原則的優質夥伴：</p>
                                <ul className="list-disc list-inside mb-4 space-y-2 text-gray-300">
                                    <li><strong className="text-white">3</strong>：三年以上行業經驗</li>
                                    <li><strong className="text-white">2</strong>：公司成立兩年以上</li>
                                    <li><strong className="text-white">1</strong>：專注於一項主要專業 (單一產業別)</li>
                                    <li><strong className="text-white">A</strong>：Attitude 態度良好，願意付出與學習</li>
                                </ul>
                                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                                    <strong className="text-primary">核心精神：</strong>確保每位會員都是該領域的專家，且在分會中尚無重複代表。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        index={1}
                        isOpen={openIndex === 1}
                        toggle={() => toggle(1)}
                        question="我不擅長社交，會不會很尷尬？"
                        answer={
                            <>
                                <p className="mb-3 text-primary font-bold">BNI有結構化的流程，不需要擔心社交技巧</p>
                                <p className="mb-4">每次例會都有固定流程：25秒專業介紹、5分鐘深度主講、分組交流。</p>
                                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                                    <strong className="text-primary">實際經驗：</strong>許多內向型會員反而在BNI找到舒適的交流方式，因為有明確的架構和目標。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        index={2}
                        isOpen={openIndex === 2}
                        toggle={() => toggle(2)}
                        question="線上會議效果會不會比實體差？"
                        answer={
                            <>
                                <p className="mb-3 text-primary font-bold">長輝白金分會專注於線上會議優化，效果不輸實體</p>
                                <ul className="list-disc list-inside mb-4 space-y-1 ml-2">
                                    <li>全台少數100%支援線上與會的分會</li>
                                    <li>專業的線上會議流程設計</li>
                                    <li>分組討論室功能，保持深度交流</li>

                                </ul>
                                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                                    <strong className="text-primary">關鍵優勢：</strong>線上會議讓您即使出差也能照常與會、照常曝光、照常經營商務合作。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        index={3}
                        isOpen={openIndex === 3}
                        toggle={() => toggle(3)}
                        question="我需要準備什麼資料才能當來賓？"
                        answer={
                            <>
                                <p className="mb-3 text-primary font-bold">當來賓免費，流程簡單明確，無需複雜資料</p>
                                <p className="mb-2">您只需要準備：</p>
                                <ul className="list-disc list-inside mb-4 space-y-1 ml-2">
                                    <li>個人或公司基本資料（名稱、聯絡方式、服務項目）</li>
                                    <li>簡短的自我介紹（30秒即可）</li>
                                    <li>對引薦行銷的熱情與承諾</li>
                                </ul>
                                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                                    <strong className="text-primary">貼心提醒：</strong>如果您確定要入會，我們將會進行資格審查，不保證一定能加入長輝
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        index={4}
                        isOpen={openIndex === 4}
                        toggle={() => toggle(4)}
                        question="如果我暫時無法參加例會怎麼辦？"
                        answer={
                            <>
                                <p className="mb-3 text-primary font-bold">BNI提供彈性的代理人制度</p>
                                <p className="mb-2">如果您因故無法參加例會，可以：</p>
                                <ul className="list-disc list-inside mb-4 space-y-1 ml-2">
                                    <li>安排代理人代表您出席（同事、合作夥伴或家人）</li>
                                    <li>提前提供您的自我介紹與引薦報告給代理人分享</li>
                                    <li>無論再忙，盡可能每週早起商務不中斷</li>
                                </ul>
                                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                                    <strong className="text-primary">重要提醒：</strong>為了維護會員權益，每位會員半年內缺席超過三次將可能被踢出，這是我們對夥伴彼此間的基本承諾。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        index={5}
                        isOpen={openIndex === 5}
                        toggle={() => toggle(5)}
                        question="新創公司或個人工作者適合加入嗎？"
                        answer={
                            <>
                                <p className="mb-3 text-primary font-bold">BNI特別適合新創與個人工作者快速建立人脈</p>
                                <p className="mb-2">許多成功的新創企業都從BNI起步，因為：</p>
                                <ul className="list-disc list-inside mb-4 space-y-1 ml-2">
                                    <li>快速建立早期客戶群</li>
                                    <li>獲得各領域專業人士的建議與支援</li>
                                    <li>以合理成本接觸大量潛在客戶</li>
                                </ul>
                                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                                    <strong className="text-primary">成功案例：</strong>李孟一在創業初期加入BNI，透過一對一快速鏈結教育產業鏈，並做為公司擴張基礎。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        index={6}
                        isOpen={openIndex === 6}
                        toggle={() => toggle(6)}
                        question="長輝白金分會與其他BNI分會有什麼不同？"
                        answer={
                            <>
                                <p className="mb-3 text-primary font-bold">我們是全台少數100%支援線上與會的分會</p>
                                <p className="mb-2">長輝白金分會的獨特優勢：</p>
                                <ul className="list-disc list-inside mb-4 space-y-1 ml-2">
                                    <li><strong>完整線上支援：</strong>所有會員都能全程線上參與，無需到場</li>
                                    <li><strong>早晨時段：</strong>每週三中原時區早上6:30-8:30，不影響正常工作</li>
                                    <li><strong>產業多元：</strong>60+個不同產業，資源整合能力強</li>
                                </ul>
                                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                                    <strong className="text-primary">特別適合：</strong>經常出差、時間彈性需求高、或偏好線上協作的專業人士。
                                </div>
                            </>
                        }
                    />
                </div>
            </div>
        </section>
    );
};

export default FAQ;
