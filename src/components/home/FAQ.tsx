import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Plus } from 'lucide-react';

const FAQItem: React.FC<{ question: string, answer: React.ReactNode }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                aria-expanded={isOpen}
            >
                <div className="flex items-start gap-4 pr-6">
                    <span className="text-[#c5a47e] font-bold text-lg pt-0.5 font-serif">Q</span>
                    <h3 className="text-white font-medium text-lg leading-relaxed">{question}</h3>
                </div>
                <Plus
                    className={clsx("text-[#c5a47e] transition-transform duration-300 flex-shrink-0", isOpen ? "rotate-45" : "")}
                    size={24}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 pl-16 pr-10 text-gray-300 leading-relaxed border-t border-white/5 mt-2">
                            <div className="mb-2 font-bold text-white font-serif text-[#c5a47e]">A</div>
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ: React.FC = () => {
    return (
        <section className="py-24 relative z-10">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#c5a47e]">您可能會有的顧慮</h2>
                    <div className="w-16 h-1 bg-[#c5a47e] mx-auto rounded-full"></div>
                </div>

                <div className="space-y-4">
                    <FAQItem
                        question="我很忙，每週都要參加會不會太花時間？"
                        answer={
                            <>
                                <p className="mb-3 text-[#c5a47e] font-bold">我們的會員平均每投入1小時，獲得8小時的業務成果</p>
                                <p className="mb-4">線上會議讓您在家或辦公室就能參與，省下通勤時間。每週三早上6:30-8:30，正好在開始一天工作前完成。</p>
                                <div className="p-4 bg-[#c5a47e]/10 rounded-lg border border-[#c5a47e]/20 text-sm">
                                    <strong className="text-[#c5a47e]">實際案例：</strong>劉弼凱（水電工程）即使在忙碌的工程期間也能持續參與，這一年來工程案量增加了180%。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        question="我的產業比較特殊，BNI真的適合我嗎？"
                        answer={
                            <>
                                <p className="mb-3 text-[#c5a47e] font-bold">我們有60+產業，涵蓋各種專業領域</p>
                                <p className="mb-4">包括：法律服務、建築工程、保險理財、醫療健康、科技服務、行銷顧問、餐飲美食等。</p>
                                <div className="p-4 bg-[#c5a47e]/10 rounded-lg border border-[#c5a47e]/20 text-sm">
                                    <strong className="text-[#c5a47e]">實際案例：</strong>何昇軒律師原本也擔心法律服務太專業，現在80%的企業客戶都來自會員引薦，業務量成長250%。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        question="會費值得嗎？投資報酬率如何？"
                        answer={
                            <>
                                <p className="mb-3 text-[#c5a47e] font-bold">平均每位會員每月獲得NT$ 21.2萬引薦金額</p>
                                <ul className="list-disc list-inside mb-4 space-y-1 ml-2">
                                    <li>上月引薦單數：470張</li>
                                    <li>上月引薦金額：NT$ 1,273萬</li>
                                    <li>平均成交率：68%</li>
                                </ul>
                                <div className="p-4 bg-[#c5a47e]/10 rounded-lg border border-[#c5a47e]/20 text-sm">
                                    <strong className="text-[#c5a47e]">重點：</strong>會費僅佔引薦金額的2.8%，投資報酬率達35倍以上。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        question="如果我的行業已經有會員了怎麼辦？"
                        answer={
                            <>
                                <p className="mb-3 text-[#c5a47e] font-bold">這正是BNI的獨特優勢！</p>
                                <p className="mb-4">BNI採用「一個行業一個會員」的原則，確保您在分會內沒有直接競爭者。所有會員都會全力為您引薦客戶，而不是競爭對手。</p>
                                <p className="mb-2">如果您的行業已有會員，我們可以：</p>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li>協助您了解其他BNI分會的機會</li>
                                    <li>將您列入候補名單（通常3-6個月內會有機會）</li>
                                    <li>評估您的專業領域是否可以細分（例如：商業律師 vs 家事律師）</li>
                                </ul>
                            </>
                        }
                    />
                    <FAQItem
                        question="我不擅長社交，會不會很尷尬？"
                        answer={
                            <>
                                <p className="mb-3 text-[#c5a47e] font-bold">BNI有結構化的流程，不需要擔心社交技巧</p>
                                <p className="mb-4">每次例會都有固定流程：25秒專業介紹、5分鐘深度主講、分組交流。</p>
                                <div className="p-4 bg-[#c5a47e]/10 rounded-lg border border-[#c5a47e]/20 text-sm">
                                    <strong className="text-[#c5a47e]">實際經驗：</strong>許多內向型會員反而在BNI找到舒適的交流方式，因為有明確的架構和目標。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        question="線上會議效果會不會比實體差？"
                        answer={
                            <>
                                <p className="mb-3 text-[#c5a47e] font-bold">長輝白金分會專注於線上會議優化，效果不輸實體</p>
                                <ul className="list-disc list-inside mb-4 space-y-1 ml-2">
                                    <li>全台少數100%支援線上與會的分會</li>
                                    <li>專業的線上會議流程設計</li>
                                    <li>分組討論室功能，保持深度交流</li>
                                </ul>
                                <div className="p-4 bg-[#c5a47e]/10 rounded-lg border border-[#c5a47e]/20 text-sm">
                                    <strong className="text-[#c5a47e]">關鍵優勢：</strong>線上會議讓您即使出差也能照常與會、照常曝光、照常經營商務合作。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        question="我需要準備什麼資料才能加入？"
                        answer={
                            <>
                                <p className="mb-3 text-[#c5a47e] font-bold">加入流程簡單明確，無需複雜資料</p>
                                <p className="mb-2">您只需要準備：</p>
                                <ul className="list-disc list-inside mb-4 space-y-1 ml-2">
                                    <li>個人或公司基本資料（名稱、聯絡方式、服務項目）</li>
                                    <li>簡短的自我介紹（30秒即可）</li>
                                    <li>對引薦行銷的熱情與承諾</li>
                                </ul>
                                <div className="p-4 bg-[#c5a47e]/10 rounded-lg border border-[#c5a47e]/20 text-sm">
                                    <strong className="text-[#c5a47e]">貼心提醒：</strong>加入後我們會提供完整的MSP培訓，教您如何有效介紹自己的服務並進行引薦。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        question="如果我暫時無法參加例會怎麼辦？"
                        answer={
                            <>
                                <p className="mb-3 text-[#c5a47e] font-bold">BNI提供彈性的代理人制度</p>
                                <p className="mb-2">如果您因故無法參加例會，可以：</p>
                                <ul className="list-disc list-inside mb-4 space-y-1 ml-2">
                                    <li>安排代理人代表您出席（同事、合作夥伴或家人）</li>
                                    <li>提前提供您的引薦單給代理人分享</li>
                                    <li>透過線上會議錄影了解當週內容</li>
                                </ul>
                                <div className="p-4 bg-[#c5a47e]/10 rounded-lg border border-[#c5a47e]/20 text-sm">
                                    <strong className="text-[#c5a47e]">重要提醒：</strong>為了維護會員權益，每位會員的出席率需維持在60%以上。線上會議的便利性讓這個目標非常容易達成。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        question="新創公司或個人工作者適合加入嗎？"
                        answer={
                            <>
                                <p className="mb-3 text-[#c5a47e] font-bold">BNI特別適合新創與個人工作者快速建立人脈</p>
                                <p className="mb-2">許多成功的新創企業都從BNI起步，因為：</p>
                                <ul className="list-disc list-inside mb-4 space-y-1 ml-2">
                                    <li>快速建立第一批客戶群</li>
                                    <li>獲得各領域專業人士的建議與支援</li>
                                    <li>以合理成本接觸大量潛在客戶</li>
                                </ul>
                                <div className="p-4 bg-[#c5a47e]/10 rounded-lg border border-[#c5a47e]/20 text-sm">
                                    <strong className="text-[#c5a47e]">成功案例：</strong>許雅婷在創業初期加入BNI，透過會員引薦快速打開市場知名度，第一年就達成業績目標的150%。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        question="長輝白金分會與其他BNI分會有什麼不同？"
                        answer={
                            <>
                                <p className="mb-3 text-[#c5a47e] font-bold">我們是全台少數100%支援線上與會的分會</p>
                                <p className="mb-2">長輝白金分會的獨特優勢：</p>
                                <ul className="list-disc list-inside mb-4 space-y-1 ml-2">
                                    <li><strong>完整線上支援：</strong>所有會員都能全程線上參與，無需到場</li>
                                    <li><strong>早晨時段：</strong>每週三早上6:30-8:30，不影響正常工作</li>
                                    <li><strong>產業多元：</strong>60+個不同產業，資源整合能力強</li>
                                </ul>
                                <div className="p-4 bg-[#c5a47e]/10 rounded-lg border border-[#c5a47e]/20 text-sm">
                                    <strong className="text-[#c5a47e]">特別適合：</strong>經常出差、時間彈性需求高、或偏好線上協作的專業人士。
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
