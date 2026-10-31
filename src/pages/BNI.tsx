import React from 'react';
import { Link } from 'react-router-dom';
import { CountingNumber } from '@animate-ui/react/primitives/texts/counting-number';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import PageHero from '../components/common/PageHero';
import SEO from '../components/common/SEO';
import { siteConfig } from '../config/site.config';
import {
    EmblemOrbitSync,
    EmblemExclusiveOrbit,
    EmblemVerifiedLedger,
    EmblemConstellationMesh,
} from '../components/home/StarshipEmblems';

const StatCard: React.FC<{
    value: number;
    fromNumber?: number;
    suffix?: string;
    label: React.ReactNode;
    subtext?: string;
    isLarge?: boolean;
}> = ({ value, fromNumber = 0, suffix = '+', label, subtext, isLarge }) => {
    return (
        <div
            className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center transition-colors ${
                isLarge
                    ? 'md:col-span-2 md:row-span-2 flex flex-col justify-center items-center bg-primary/10 border-primary/30 shadow-[0_0_30px_rgba(76,168,223,0.1)]'
                    : 'hover:bg-white/10'
            }`}
        >
            <div
                className={`font-bold text-white mb-2 font-mono tabular-nums ${
                    isLarge ? 'text-6xl md:text-7xl text-primary' : 'text-4xl md:text-5xl'
                }`}
            >
                <CountingNumber number={value} fromNumber={fromNumber} thousandSeparator="," inView />
                {suffix && <span className="text-2xl ml-1 align-top">{suffix}</span>}
            </div>
            <div className={`text-gray-300 ${isLarge ? 'text-xl font-bold' : 'text-sm'}`}>{label}</div>
            {subtext && <div className="text-gray-500 text-xs mt-1">{subtext}</div>}
        </div>
    );
};

const CORE_VALUES = [
    {
        title: 'Givers Gain® 付出者收穫',
        desc: '先幫夥伴介紹生意，別人自然也會把案子帶給你。在長輝，我們不問「你能給我什麼」，而是先問「我這週能幫誰引薦客戶」。',
    },
    {
        title: 'Building Relationships 先建立信任',
        desc: '沒有人會把自己的重要客戶隨便介紹給陌生人。我們靠每週見面與一對一深聊，把單純換名片的交情變成敢放心託付客戶的夥伴。',
    },
    {
        title: 'Lifelong Learning 持續精進',
        desc: '怎麼在 30 秒內讓別人聽懂你的專業？怎麼聽出客戶背後真正的需求？分會提供固定培訓與導師陪伴，大家一起把基本功練紮實。',
    },
    {
        title: 'Traditions + Innovation 守住紀律、工具翻新',
        desc: '一業一代表、準時出席、實名引薦這套跑了四十年的規則不能改；但開會方式與數位工具可以與時俱進——長輝就是把它搬上線上的代表。',
    },
    {
        title: 'Positive Attitude 正向支持',
        desc: '自己當老闆難免遇到卡關的時候。分會裡沒有同行相忌，只有近 60 位不同領域的老闆幫你出主意、補資源。',
    },
    {
        title: 'Accountability 說到做到',
        desc: '夥伴把客戶介紹給你，就是把他的信用押在你身上。接了引薦單就按時回報進度、把服務做好，這是分會最看重的底線。',
    },
    {
        title: 'Recognition 看見每一份付出',
        desc: '無論是幫夥伴牽成大案子、邀請優質來賓，或是每週穩定出席，每一份對分會的貢獻都會在例會上被公開表揚。',
    },
] as const;

const BNIPage: React.FC = () => {
    return (
        <div className="min-h-screen pt-0">
            <SEO
                title="認識 BNI｜全球商務引薦組織與長輝例會制度"
                description="BNI 成立於 1985 年，遍及 76+ 國家、擁有 34 萬+ 會員。長輝白金分會全程在 Zoom 線上開會，每週三早上 06:30–08:30 用 90 分鐘固定議程幫彼此對接生意。"
                keywords="什麼是BNI, BNI商會, 線上BNI, 商務引薦系統, 付出者收穫, Givers Gain, 長輝白金分會, 線上商務例會"
                breadcrumbs={[{ name: '認識 BNI', path: '/bni' }]}
                structuredData={{
                    '@type': 'WebPage',
                    name: '認識 BNI — 全球商務引薦組織與長輝例會制度',
                    description: 'BNI 在台灣有 245 個分會與近萬名會員。了解長輝白金分會如何透過每週三線上例會創造引薦。',
                    url: 'https://evershine.tw/bni',
                    isPartOf: { '@id': 'https://evershine.tw/#website' },
                    inLanguage: 'zh-TW',
                }}
            />
            <PageHero
                compact
                tone="meeting"
                backgroundImage={siteConfig.backgrounds.meetingSpeaker}
                backgroundPosition="center 28%"
                badge="Givers Gain®"
                title="認識 BNI"
                subtitle={
                    <>
                        1985 年創立至今，遍及 76+ 國家、11,300+ 分會、34 萬+ 企業主<br />
                        一業一代表，用固定例會把口頭人脈變成可追蹤的生意引薦
                    </>
                }
            />

            {/* Data Notice */}
            <div className="bg-primary/10 border-y border-primary/20 py-3 text-center text-sm text-primary font-mono tracking-wide">
                <strong>統計基準：2025 年 10 月 25 日</strong>
                <span className="mx-2 opacity-50">|</span>
                官方年度滾動統計，實際數字隨各分會每週引薦持續累加
            </div>

            {/* Global Stats */}
            <section className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">BNI 全球近一年累計規模</h2>
                    <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pb-6 md:pb-0 px-4">
                    <div className="col-span-2 md:col-span-2 md:row-span-2">
                        <StatCard
                            isLarge
                            value={7500}
                            fromNumber={5000}
                            label={
                                <>
                                    全球引薦成交金額<br />
                                    （億新台幣）
                                </>
                            }
                            subtext="過去 12 個月"
                        />
                    </div>
                    <div>
                        <StatCard value={76} fromNumber={50} label="國家與地區" />
                    </div>
                    <div>
                        <StatCard value={11300} fromNumber={8000} label="運作中分會" />
                    </div>
                    <div>
                        <StatCard value={34} fromNumber={20} suffix="萬+" label="全球會員" />
                    </div>
                    <div>
                        <StatCard
                            value={1680}
                            fromNumber={1000}
                            suffix="萬+"
                            label={
                                <>
                                    全球引薦單數<br />
                                    （過去 12 個月）
                                </>
                            }
                        />
                    </div>
                </div>
            </section>

            {/* Taiwan Stats */}
            <section className="py-20 bg-white/5 relative border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">BNI 在台灣的實際規模</h2>
                        <div className="w-16 h-1 bg-white/20 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto text-center">
                        <div className="p-4 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono tabular-nums">
                                <CountingNumber number={245} fromNumber={180} inView />
                            </div>
                            <div className="text-gray-300 font-medium">個分會</div>
                        </div>
                        <div className="p-4 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono tabular-nums">
                                <CountingNumber number={9932} fromNumber={7000} thousandSeparator="," inView />
                            </div>
                            <div className="text-gray-300 font-medium">位企業主會員</div>
                        </div>
                        <div className="p-4 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono tabular-nums">
                                <CountingNumber number={72} fromNumber={50} inView />萬+
                            </div>
                            <div className="text-gray-300 font-medium">
                                張引薦單<br />
                                <span className="text-xs text-gray-500 font-normal">（過去 12 個月）</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono tabular-nums">
                                <CountingNumber number={253} fromNumber={180} inView />
                            </div>
                            <div className="text-gray-300 font-medium">
                                億成交金額<br />
                                <span className="text-xs text-gray-500 font-normal">（過去 12 個月・新台幣）</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono tabular-nums">
                                <CountingNumber number={73} fromNumber={40} inView />
                            </div>
                            <div className="text-gray-300 font-medium">
                                張／人<br />
                                <span className="text-xs text-gray-500 font-normal">每位會員年均收到引薦</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono tabular-nums">
                                <CountingNumber number={255} fromNumber={180} inView />
                            </div>
                            <div className="text-gray-300 font-medium">
                                萬／人<br />
                                <span className="text-xs text-gray-500 font-normal">每位會員年均成交金額</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7 Core Values */}
            <section className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">BNI 的七條行事準則</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        把不同背景的老闆聚在一起長期合作，靠的不是人情壓力，而是全體分會共同遵守的七個原則
                    </p>
                    <div className="w-16 h-1 bg-primary mx-auto rounded-full mt-4"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {CORE_VALUES.map((item, idx) => (
                        <Effect
                            key={item.title}
                            inView
                            fade
                            blur={{ initialBlur: 4 }}
                            slide={{ offset: 14 }}
                            delay={(idx % 3) * 70}
                            className="h-full"
                        >
                            <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-[background-color,border-color,translate] duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 hover:border-primary/50 group h-full">
                                <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-white transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </Effect>
                    ))}
                </div>
            </section>

            {/* Meeting Agenda */}
            <section className="py-20 bg-white/5 border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">週三早上的 20 個例會環節</h2>
                        <p className="text-gray-400">90 分鐘按表操課，讓每個人都講得到重點、聽得見需求</p>
                        <div className="w-16 h-1 bg-white/20 mx-auto rounded-full mt-4"></div>
                    </div>

                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
                        {[
                            '01. 自由交流時間 (Open Networking)',
                            '02. 歡迎及介紹領導團隊',
                            '03. BNI 宗旨及概況說明',
                            '04. 人脈教育培訓 (Networking Education)',
                            '05. 傑出表現會員認可及表揚',
                            '06. 傳遞名片盒 (Pass Business Cards)',
                            '07. 歡迎新會員及入會儀式',
                            '08. 會員 30–60 秒專業簡報 (Weekly Presentations)',
                            '09. 歡迎來賓及其簡報',
                            "10. 副主席績效報告 (Vice President's Report)",
                            '11. 會員委員會報告 (Membership Committee Report)',
                            '12. 秘書／財務報告',
                            '13. 介紹本週專題簡報人',
                            '14. 專題主題簡報 (Featured Presentation)',
                            '15. 業務引薦及會員見證 (Referrals & Testimonials)',
                            '16. 引薦真實性核查 (Referral Reality Check)',
                            '17. 秘書／財務再次報告（宣佈未來六週主講人）',
                            '18. 分會公告與提醒 (Announcements)',
                            '19. 門票抽獎 (Door Prize)',
                            '20. 主席結語及會議正式結束',
                        ].map((step, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors rounded-lg group"
                            >
                                <div className="w-2 h-2 rounded-full bg-primary shrink-0 group-hover:scale-150 transition-transform"></div>
                                <span className="text-gray-300 font-mono text-base group-hover:text-white transition-colors">
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Join */}
            <section className="py-20 container mx-auto px-4">
                <Effect inView fade blur={{ initialBlur: 4 }} slide={{ offset: 16 }}>
                    <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary/10 to-bg-dark border border-primary/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                        <h2 className="text-3xl font-bold text-white mb-6 relative z-10">
                            為什麼很多老闆最後選了「線上分會」？
                        </h2>
                        <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed relative z-10">
                            傳統早餐會得五點多起床、趕車去飯店；在長輝，每週三早上六點半打開 Zoom 就能跟將近 60 位不同產業的老闆對接。每個行業只收一位代表，同一個專業在分會裡沒有第二個人跟你分案源，八點半散會後直接開始跑當天的行程。
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                            <div className="p-4 flex flex-col items-center">
                                <div className="mb-3 text-primary"><EmblemOrbitSync size={40} /></div>
                                <h3 className="font-bold text-white mb-2">全程 Zoom 與會</h3>
                                <p className="text-sm text-gray-300">不用趕早班車，出差或在外縣市也能照常出席。</p>
                            </div>
                            <div className="p-4 flex flex-col items-center">
                                <div className="mb-3 text-primary"><EmblemExclusiveOrbit size={40} /></div>
                                <h3 className="font-bold text-white mb-2">一業一代表</h3>
                                <p className="text-sm text-gray-300">每個專業只收一位，分會裡的同類需求都歸你。</p>
                            </div>
                            <div className="p-4 flex flex-col items-center">
                                <div className="mb-3 text-primary"><EmblemVerifiedLedger size={40} /></div>
                                <h3 className="font-bold text-white mb-2">實名引薦追蹤</h3>
                                <p className="text-sm text-gray-300">每一張引薦單都有紀錄與核查，不是口頭說說。</p>
                            </div>
                            <div className="p-4 flex flex-col items-center">
                                <div className="mb-3 text-primary"><EmblemConstellationMesh size={40} /></div>
                                <h3 className="font-bold text-white mb-2">跨分會與國際資源</h3>
                                <p className="text-sm text-gray-300">連通全台 245 個分會與全球 76+ 國的 BNI 網絡。</p>
                            </div>
                        </div>
                    </div>
                </Effect>
            </section>

            {/* Internal Links Section */}
            <section className="py-16 container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-white mb-8">往下看看長輝的夥伴與合作實績</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            to="/members"
                            className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-primary/50 transition-colors"
                        >
                            <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-white transition-colors">
                                長輝會員名錄
                            </h3>
                            <p className="text-gray-400 text-sm">看看目前八大產業有哪些專業代表在分會裡</p>
                        </Link>
                        <Link
                            to="/referrals"
                            className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-primary/50 transition-colors"
                        >
                            <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-white transition-colors">
                                真實引薦案例
                            </h3>
                            <p className="text-gray-400 text-sm">看夥伴之間實際怎麼牽線、怎麼把案子做成</p>
                        </Link>
                        <Link
                            to="/#contact"
                            className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-primary/50 transition-colors"
                        >
                            <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-white transition-colors">
                                預約週三來訪
                            </h3>
                            <p className="text-gray-400 text-sm">直接找主席、副主席或秘財報名下一場線上例會</p>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BNIPage;
