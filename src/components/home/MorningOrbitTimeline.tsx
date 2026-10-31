import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import { useMotionTokens } from '@animate-ui/react/utils/motion';
import SectionLabel from '../common/SectionLabel';

interface LogPoint {
    time: string;
    phase: string;
    title: string;
    detail: string;
    highlight: string;
}

const LOG_POINTS: LogPoint[] = [
    {
        time: '06:20',
        phase: 'SIGNAL ON · 開艙連線',
        title: '打開 Zoom 進場，先開麥打招呼',
        detail: '不用五點起床趕車去飯店。在家泡杯咖啡打開電腦，前十分鐘是自由破冰，接待組會先帶第一次來的來賓認識同產業鏈的夥伴。',
        highlight: '免通勤、零場地費，外縣市或出差中也能準時上線',
    },
    {
        time: '06:30',
        phase: 'ORBIT WARMUP · 早鳥交流',
        title: '分組討論室暖身，先聊最近手上的案子',
        detail: 'Zoom 自動拆成小房間，四到五位老闆一組深聊近況。就算你平常慢熟、不愛跑飯局，在小組裡照著主題聊也很自然。',
        highlight: '小房間深度認識，不會對著六十人大畫面發呆',
    },
    {
        time: '07:00',
        phase: 'MAIN SEQUENCE · 30 秒精準廣播',
        title: '全體點名：每個人 30 秒講清楚「這週要找誰」',
        detail: '不講空泛的公司簡介，直接講「我這週想認識哪一類客戶或協力廠商」。全場近 60 位老闆同時幫你對照手上的名單。',
        highlight: '一業一代表，同一個專業沒有第二個人跟你搶單',
    },
    {
        time: '07:45',
        phase: 'GRAVITY TRANSFER · 專題主講與實名引薦',
        title: '本週主講人深度拆解 ＋ 當場見證成交與引薦單',
        detail: '每週由一位會員用 5 到 8 分鐘拆解自己的代表作與合作模式；接著全場逐一報告這週幫哪位夥伴牽了線、成了多少金額的案子。',
        highlight: '每一筆引薦都有單據紀錄與真實性核查',
    },
    {
        time: '08:30',
        phase: 'LAUNCH · 準時散會跑業務',
        title: '八點半準時收工，帶著引薦名單開始一天的行程',
        detail: '當別人才剛塞在上班車陣裡，你已經開完一場 60 人規模的商務對接會。會後再跟對上線的夥伴約「一對一」把合作細節談定。',
        highlight: '完全不佔用白天跑客戶與處理公司正事的時間',
    },
];

const MorningOrbitTimeline: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(2);
    const { spring } = useMotionTokens();

    return (
        <section
            id="morning-orbit"
            aria-labelledby="morning-orbit-heading"
            className="relative z-10 py-20 md:py-28 px-4"
        >
            <div className="container mx-auto max-w-6xl">
                <Effect inView fade blur={{ initialBlur: 2 }} slide={{ offset: 14 }}>
                    <div className="text-center mb-12 md:mb-16">
                        <SectionLabel>Wednesday 06:20 – 08:30</SectionLabel>
                        <h2
                            id="morning-orbit-heading"
                            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4"
                        >
                            週三早晨 120 分鐘的 <span className="text-primary">星際航行日誌</span>
                        </h2>
                        <p className="mx-auto max-w-2xl text-base sm:text-lg text-gray-300 leading-relaxed">
                            很多老闆好奇：「一大早六點半在 Zoom 上開會，到底都在做什麼？」點開下面五個時間座標，看我們怎麼在八點半前把生意對接完。
                        </p>
                    </div>
                </Effect>

                {/* 時間軸軌道選擇器 */}
                <div className="relative mb-8">
                    <div
                        className="pointer-events-none absolute top-1/2 left-6 right-6 hidden -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block"
                        aria-hidden
                    />
                    <div
                        role="tablist"
                        aria-label="週三例會時間軸"
                        className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 md:gap-4 relative z-10"
                    >
                        {LOG_POINTS.map((pt, idx) => {
                            const isActive = idx === activeIndex;
                            return (
                                <button
                                    key={pt.time}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`relative rounded-2xl border p-3.5 sm:p-4 text-left transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                        isActive
                                            ? 'border-platinum/60 text-white'
                                            : 'border-white/10 bg-[#071526]/85 text-gray-400 hover:border-primary/40 hover:text-white'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="morning-orbit-active-card"
                                            transition={spring.selection}
                                            className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/25 via-[#0c233d]/90 to-[#071526]/95 border border-platinum/50 shadow-[0_0_28px_rgba(76,168,223,0.22)]"
                                            aria-hidden
                                        />
                                    )}
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between gap-1 mb-1">
                                            <span
                                                className={`font-mono text-lg sm:text-xl font-black tabular-nums ${
                                                    isActive ? 'text-platinum-light' : 'text-primary'
                                                }`}
                                            >
                                                {pt.time}
                                            </span>
                                            <span
                                                className={`h-2 w-2 rounded-full ${
                                                    isActive
                                                        ? 'bg-platinum-light shadow-[0_0_8px_rgba(232,197,71,0.9)]'
                                                        : 'bg-white/20'
                                                }`}
                                                aria-hidden
                                            />
                                        </div>
                                        <div className="text-xs sm:text-sm font-bold line-clamp-1">
                                            {pt.title.split('，')[0].split('：')[0]}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 展開的當下航段詳情 */}
                <div className="glass-panel rounded-3xl p-6 sm:p-8 md:p-10 border border-white/15">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-4 flex flex-col items-start border-b md:border-b-0 md:border-r border-white/10 pb-5 md:pb-0 md:pr-6">
                            <span className="font-mono text-xs tracking-[0.22em] text-platinum-light uppercase mb-2">
                                {LOG_POINTS[activeIndex].phase}
                            </span>
                            <div className="font-mono text-5xl sm:text-6xl font-black text-white tabular-nums tracking-tight mb-3">
                                {LOG_POINTS[activeIndex].time}
                            </div>
                            <span className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary-light">
                                {LOG_POINTS[activeIndex].highlight}
                            </span>
                        </div>

                        <div className="md:col-span-8">
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 leading-snug">
                                {LOG_POINTS[activeIndex].title}
                            </h3>
                            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                                {LOG_POINTS[activeIndex].detail}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MorningOrbitTimeline;
