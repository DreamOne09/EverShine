import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import { blur, transition as motionTransition, useTempoTransition } from '@animate-ui/react/utils/motion';

const FAQItem: React.FC<{
    question: string;
    answer: React.ReactNode;
    isOpen: boolean;
    toggle: () => void;
    index: number;
}> = ({ question, answer, isOpen, toggle, index }) => {
    const disclosureTransition = useTempoTransition(motionTransition.disclosure);

    return (
        <Effect inView fade blur={{ initialBlur: 2 }} slide={{ offset: 10 }} delay={index * 50}>
            <div className="border-b border-white/10 last:border-0">
                <button
                    type="button"
                    onClick={toggle}
                    aria-expanded={isOpen}
                    className="w-full py-6 flex items-center justify-between text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-lg"
                >
                    <span
                        className={`text-xl md:text-2xl font-medium transition-colors duration-200 pr-8 ${
                            isOpen ? 'text-primary' : 'text-white group-hover:text-primary'
                        }`}
                    >
                        {question}
                    </span>
                    <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                            isOpen
                                ? 'border-primary bg-primary text-bg-dark shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]'
                                : 'border-white/20 text-gray-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] group-hover:border-primary group-hover:text-primary'
                        }`}
                    >
                        <Plus
                            size={18}
                            className={`transition-transform duration-350 ease-[cubic-bezier(0.215,0.61,0.355,1)] ${
                                isOpen ? 'rotate-45' : 'rotate-0'
                            }`}
                        />
                    </span>
                </button>
                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, filter: blur.disclosure }}
                            animate={{
                                height: 'auto',
                                opacity: 1,
                                filter: 'blur(0px)',
                                transitionEnd: { filter: 'none' },
                            }}
                            exit={{ height: 0, opacity: 0, filter: blur.disclosure, transition: disclosureTransition }}
                            transition={disclosureTransition}
                            style={{ overflow: 'hidden' }}
                        >
                            <div className="text-gray-400 leading-relaxed pb-8 text-lg md:text-xl">{answer}</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Effect>
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
                <Effect inView fade blur={{ initialBlur: 2 }} slide={{ offset: 14 }}>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-4 text-white">常見問題</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            第一次聽到 BNI 或想來參觀的企業主，最常問我們這幾題
                        </p>
                    </div>
                </Effect>

                <div className="max-w-3xl mx-auto space-y-2">
                    <FAQItem
                        index={0}
                        isOpen={openIndex === 0}
                        toggle={() => toggle(0)}
                        question="加入長輝需要什麼資格？"
                        answer={
                            <>
                                <p className="mb-3 text-primary font-bold">我們用「321A」四個標準審核每一位申請人：</p>
                                <ul className="list-disc list-inside mb-4 space-y-2 text-gray-300">
                                    <li><strong className="text-white">3</strong>：在這個行業累積三年以上實務經驗</li>
                                    <li><strong className="text-white">2</strong>：公司或工作室正式營運滿兩年</li>
                                    <li><strong className="text-white">1</strong>：在分會只登記一項主力專業（一業一代表，不跟同分會夥伴撞業）</li>
                                    <li><strong className="text-white">A</strong>：Attitude 態度正向，願意先幫別人、也願意配合分會紀律</li>
                                </ul>
                                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                                    <strong className="text-primary">為什麼這麼規定：</strong>因為要把自己的客戶放心交出去，必須確定對方在本業夠格，而且分會裡不會有兩個人搶同一張單。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        index={1}
                        isOpen={openIndex === 1}
                        toggle={() => toggle(1)}
                        question="我很慢熟、不愛應酬，去那裡會不會很乾？"
                        answer={
                            <>
                                <p className="mb-3 text-primary font-bold">不會。例會全程按時間表走，不用自己硬找話題破冰。</p>
                                <p className="mb-4">每個人輪流用 25～30 秒講清楚「我做什麼、這週想認識誰」，接著是專題簡報與分組交流，誰先講、講多久都有主持人控場。</p>
                                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                                    <strong className="text-primary">實際情況：</strong>分會裡很多技術底、工程底的夥伴平常也不跑飯局，但因為每次只要講清楚專業需求，反而比去外面換名片自在很多。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        index={2}
                        isOpen={openIndex === 2}
                        toggle={() => toggle(2)}
                        question="只在線上開會，大家真的會熟、會轉介紹嗎？"
                        answer={
                            <>
                                <p className="mb-3 text-primary font-bold">長輝從創會就把例會設計在線上，成交與引薦量一直是白金級分會。</p>
                                <ul className="list-disc list-inside mb-4 space-y-1 ml-2">
                                    <li>每週三早上固定見面，加上平時約「一對一」深聊各自客戶輪廓</li>
                                    <li>Zoom 分組討論室每次拆小組交流，不會只對著大畫面發呆</li>
                                    <li>省下雙北塞車跟找車位的時間，八點半開完會直接跑客戶</li>
                                </ul>
                                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                                    <strong className="text-primary">最大好處：</strong>就算人去外縣市或出國出差，開筆電照樣能出席、照樣接引薦。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        index={3}
                        isOpen={openIndex === 3}
                        toggle={() => toggle(3)}
                        question="來當一次來賓要費用嗎？要準備什麼？"
                        answer={
                            <>
                                <p className="mb-3 text-primary font-bold">來賓參觀完全免費，不用做簡報，準備 30 秒口頭自我介紹就好。</p>
                                <p className="mb-2">上線前只要準備三件事：</p>
                                <ul className="list-disc list-inside mb-4 space-y-1 ml-2">
                                    <li>你的姓名、公司名稱與聯絡方式</li>
                                    <li>30 秒講清楚你服務哪一類客戶、幫他們解決什麼問題</li>
                                    <li>找個安靜、能開鏡頭的環境上 Zoom</li>
                                </ul>
                                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                                    <strong className="text-primary">先說清楚：</strong>來參觀不代表一定要入會；反過來，如果想正式入會，會員委員會也會做資格面談與查核，不是繳費就能進。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        index={4}
                        isOpen={openIndex === 4}
                        toggle={() => toggle(4)}
                        question="如果某個週三早上剛好有事不能出席怎麼辦？"
                        answer={
                            <>
                                <p className="mb-3 text-primary font-bold">可以請「代理人」替你出席，不算缺席。</p>
                                <p className="mb-2">當週有急事或撞期時，你可以：</p>
                                <ul className="list-disc list-inside mb-4 space-y-1 ml-2">
                                    <li>請公司同事、合作夥伴或熟識你的朋友代為上線</li>
                                    <li>把你那週的 30 秒介紹稿交給代理人，照樣幫你在會場曝光</li>
                                    <li>因為是線上開會，多數夥伴就算在飯店或高鐵站也能直接上線</li>
                                </ul>
                                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                                    <strong className="text-primary">出席規定：</strong>半年內無故缺席超過三次，席位會被釋出給同產業其他人。這條規定雖然嚴，但也保護大家每週早起都能見到全體夥伴。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        index={5}
                        isOpen={openIndex === 5}
                        toggle={() => toggle(5)}
                        question="公司剛起步、或是幾個人的小團隊適合嗎？"
                        answer={
                            <>
                                <p className="mb-3 text-primary font-bold">只要滿兩年、專業口碑穩，小團隊在分會裡反而轉得特別快。</p>
                                <p className="mb-2">原因很務實：</p>
                                <ul className="list-disc list-inside mb-4 space-y-1 ml-2">
                                    <li>老闆自己來開會，現場就能拍板合作方式，不用層層簽核</li>
                                    <li>缺法務、會計、設計、工程班底時，分會裡直接有信得過的人能配合</li>
                                    <li>跟著同生態圈的前輩一起接案，很快能接到原本單打獨鬥碰不到的客戶</li>
                                </ul>
                                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                                    <strong className="text-primary">真實例子：</strong>分會裡做魔術方塊教育的李孟一，創業初期加入後透過一對一串起補教與親子活動夥伴，把外部合作變成主力成長來源。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        index={6}
                        isOpen={openIndex === 6}
                        toggle={() => toggle(6)}
                        question="長輝跟其他 BNI 實體分會差在哪裡？"
                        answer={
                            <>
                                <p className="mb-3 text-primary font-bold">最大差別在「全程線上」與「跨區連結」。</p>
                                <p className="mb-2">我們的三個特點：</p>
                                <ul className="list-disc list-inside mb-4 space-y-1 ml-2">
                                    <li><strong>全程 Zoom 例會：</strong>不用六點前出門趕飯店早餐會，省下通勤與場地餐費</li>
                                    <li><strong>早上 06:30–08:30：</strong>開完會剛好九點開始跑業務，完全不卡白天正事</li>
                                    <li><strong>將近 60 個不同行業：</strong>涵蓋工程、行銷、健康、法稅、科技等八大產業鏈</li>
                                </ul>
                                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                                    <strong className="text-primary">誰最合適：</strong>常跑外務或出差、跨縣市接案、習慣用數位工具協作的老闆與專業工作者。
                                </div>
                            </>
                        }
                    />
                    <FAQItem
                        index={7}
                        isOpen={openIndex === 7}
                        toggle={() => toggle(7)}
                        question="從參觀到正式入會，大概會經過哪些步驟？"
                        answer={
                            <>
                                <p className="mb-3 text-primary font-bold">先來聽一次例會，覺得頻率對了再填申請。</p>
                                <p className="mb-2">整個流程很透明：</p>
                                <ul className="list-disc list-inside mb-4 space-y-1 ml-2">
                                    <li><strong>步驟一：</strong>聯繫主席、副主席或秘財預約週三早上參觀</li>
                                    <li><strong>步驟二：</strong>週三 06:20 上 Zoom 體驗一場完整例會，會後跟接待小組聊聊</li>
                                    <li><strong>步驟三：</strong>確認你的專業在分會尚無代表後，送出申請並與會員委員會面談</li>
                                    <li><strong>步驟四：</strong>通過審核後宣誓入會，由導師帶著你跑完新人培訓與第一輪一對一</li>
                                </ul>
                                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                                    <strong className="text-primary">小建議：</strong>不用看網站猜半天，直接來聽一個早上最準。
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
