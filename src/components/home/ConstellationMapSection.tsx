import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import { Button } from '@animate-ui/react/primitives/buttons/button';
import {
    blur,
    transition as motionTransition,
    useMotionTokens,
    useShouldReduceMotion,
    useTempoTransition,
} from '@animate-ui/react/utils/motion';
import SectionLabel from '../common/SectionLabel';

interface SectorNode {
    id: string;
    code: string;
    name: string;
    shortName: string;
    angleDeg: number;
    orbitRadius: number; // percentage of SVG half-size
    roles: string[];
    chainStory: string;
    caseRef: {
        pair: string;
        metric: string;
        summary: string;
    };
}

const SECTORS: SectorNode[] = [
    {
        id: 'space',
        code: 'SEC-01',
        name: '居住空間與工程',
        shortName: '居住工程',
        angleDeg: -90,
        orbitRadius: 38,
        roles: ['室內設計', '空調工程', '水電工程', '機電設計', '抗病毒地板', '景觀與建材'],
        chainStory: '屋主或企業裝修時，設計師一進場就能把空調、水電、弱電、建材夥伴整組帶進去，不用業主自己到處找工班踩雷。',
        caseRef: {
            pair: '洪智威（空調）→ 劉弼凱（水電）',
            metric: '現場即刻接手',
            summary: '去老公寓裝冷氣發現電壓不足、有跳電風險，當場打給水電夥伴接手重拉迴路與插座。',
        },
    },
    {
        id: 'brand',
        code: 'SEC-02',
        name: '品牌整合與行銷',
        shortName: '品牌行銷',
        angleDeg: -45,
        orbitRadius: 38,
        roles: ['品牌識別設計', '展覽與空間策展', '自媒體代操', '包裝設計', '禮贈品與團體服'],
        chainStory: '客戶要推新品牌或辦大型展覽時，從 CIS 識別、包裝、員工團服到展場施工與短影音曝光，在同一條星鏈上一次對齊。',
        caseRef: {
            pair: '施秉辰（資訊弱電）→ 劉懿德（展覽設計）',
            metric: 'NT$ 50 萬成交',
            summary: '家人公司參加大型生技展需要攤位設計，不找外包比三家，直接對接分會策展夥伴，兩次會議就定案。',
        },
    },
    {
        id: 'digital',
        code: 'SEC-03',
        name: '數位科技與應用',
        shortName: '數位科技',
        angleDeg: 0,
        orbitRadius: 38,
        roles: ['客製網站與系統開發', 'AI 自動化導入', '資訊弱電整合', '數位廣告與數據追蹤', '科技獵才'],
        chainStory: '品牌定位做好之後，馬上由網站與系統夥伴接手官網、CRM 與 AI 流程，讓前端行銷的流量真正留得下來。',
        caseRef: {
            pair: '江沛璇（營養）→ 江學洋（品牌）→ 團服／網站',
            metric: '同一客戶四方接案',
            summary: '從營養客戶的品牌重整開始，順著需求把分會裡的團服與網站開發夥伴一起帶進去，團服已回購到第三刷。',
        },
    },
    {
        id: 'legal',
        code: 'SEC-04',
        name: '企業經營與法稅',
        shortName: '企業法稅',
        angleDeg: 45,
        orbitRadius: 38,
        roles: ['會計師稅務規劃', '商務律師', '專利商標智財', '人資勞資顧問', '企業補助與管顧'],
        chainStory: '公司規模放大、要簽大合約或申請專利時，會計師、律師與勞資顧問直接幫夥伴把關，省去自己在外面摸索試錯的學費。',
        caseRef: {
            pair: '跨業專案法稅護航',
            metric: '企業長約顧問',
            summary: '分會夥伴接下跨國或大型標案時，直接由會內律師與會計師協同審約與節稅架構。',
        },
    },
    {
        id: 'finance',
        code: 'SEC-05',
        name: '金融財富與資產',
        shortName: '金融資產',
        angleDeg: 90,
        orbitRadius: 38,
        roles: ['企業與房貸融資', '家族信託規劃', '產物與企業保險', '資產配置顧問'],
        chainStory: '不管是買廠房、轉貸降息還是工程履約保險，懂企業體質的銀行與信託夥伴會在最適合的時間點幫客戶出手。',
        caseRef: {
            pair: '劉懿德（策展）→ 陳亭儒（銀行融資）',
            metric: 'NT$ 1,050 萬核貸',
            summary: '先幫建築師朋友算準原房貸綁約到期日，罰款期一過立刻送件，核下 1,050 萬、含 3 年寬限期。',
        },
    },
    {
        id: 'health',
        code: 'SEC-06',
        name: '健康照護與身心',
        shortName: '健康身心',
        angleDeg: 135,
        orbitRadius: 38,
        roles: ['運動營養師', '機能營養保健', '醫療輔具', '物理治療與體態管理', '企業健康講座'],
        chainStory: '醫療輔具、營養師與健身教練彼此客戶高度重疊；一個人先贏得客戶信任，就能把上下游照護夥伴一起介紹進去。',
        caseRef: {
            pair: '江學洋（品牌）→ 楊承樺（運動營養師）',
            metric: '長期 B2B 轉介',
            summary: '幫一位健身教練解開飲食卡關後，教練開始固定把旗下學員轉介過來搭配營養菜單。',
        },
    },
    {
        id: 'life',
        code: 'SEC-07',
        name: '生活服務與消費',
        shortName: '生活消費',
        angleDeg: 180,
        orbitRadius: 38,
        roles: ['精品餐飲與外燴', '企業福委禮盒', '汽車美容與旅宿', '活動場地與共享空間'],
        chainStory: '企業辦尾牙、客戶招待、新品發表會或股東伴手禮，分會自己的餐飲、空間與禮盒夥伴直接包辦。',
        caseRef: {
            pair: '企業活動與伴手禮採購鏈',
            metric: '季約與節慶回購',
            summary: '各家會員公司的三節禮盒、開幕外燴與講座空間，優先由分會內部夥伴互相採購與轉介。',
        },
    },
    {
        id: 'edu',
        code: 'SEC-08',
        name: '學習成長與探索',
        shortName: '學習探索',
        angleDeg: -135,
        orbitRadius: 38,
        roles: ['企業內訓講師', '領導力與溝通培訓', '魔術方塊與兒童邏輯教育', '職涯與身心探索'],
        chainStory: '學校、補教與企業人資常需要不同主題的講師與課程，教育生態圈的夥伴透過一對一串聯，一起把課表與活動做滿。',
        caseRef: {
            pair: '李孟一（魔術方塊教育）× 教育生態圈',
            metric: '跨校與企業合作',
            summary: '創業初期加入長輝，透過一對一串起補教與親子活動夥伴，把外部合作變成公司擴張主力。',
        },
    },
];

/** 跨星區引力連線（以索引配對代表常見跨生態圈協作） */
const CROSS_LINKS: [number, number][] = [
    [0, 1], // 居住工程 ↔ 品牌策展
    [1, 2], // 品牌行銷 ↔ 數位科技
    [2, 3], // 數位科技 ↔ 企業法稅
    [3, 4], // 企業法稅 ↔ 金融資產
    [0, 4], // 居住工程 ↔ 金融融資
    [1, 5], // 品牌行銷 ↔ 健康身心
    [5, 6], // 健康身心 ↔ 生活消費
    [6, 7], // 生活消費 ↔ 學習探索
    [7, 1], // 學習探索 ↔ 品牌行銷
];

function polarToXY(angleDeg: number, radiusPct: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
        x: 50 + radiusPct * Math.cos(rad),
        y: 50 + radiusPct * Math.sin(rad),
    };
}

const ConstellationMapSection: React.FC = () => {
    const [activeIdx, setActiveIdx] = useState(0);
    const active = SECTORS[activeIdx];
    const reduce = useShouldReduceMotion();
    const { spring } = useMotionTokens();
    const swapTransition = useTempoTransition(motionTransition.swap);

    return (
        <section
            id="constellation"
            aria-labelledby="constellation-heading"
            className="relative z-10 py-24 md:py-32 px-4 overflow-hidden"
        >
            {/* 深空星雲光暈 */}
            <div
                className="pointer-events-none absolute top-1/2 left-1/4 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute bottom-10 right-10 -z-10 h-[360px] w-[360px] rounded-full bg-platinum/10 blur-[110px]"
                aria-hidden
            />

            <div className="container mx-auto max-w-6xl">
                <Effect inView fade blur={{ initialBlur: 2 }} slide={{ offset: 14 }}>
                    <div className="text-center mb-14 md:mb-16">
                        <SectionLabel>Constellation of 8 Sectors</SectionLabel>
                        <h2
                            id="constellation-heading"
                            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4"
                        >
                            八大產業星系 · <span className="text-primary">一業一代表</span>的引薦引力網
                        </h2>
                        <p className="mx-auto max-w-2xl text-base sm:text-lg text-gray-300 leading-relaxed">
                            每一顆恆星代表一個不撞業的專業席位。點選任一產業座標，看看當客戶需求出現時，長輝的夥伴怎麼把上下游連成同一條生意鏈。
                        </p>
                    </div>
                </Effect>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                    {/* 左側：客製化互動星盤 SVG */}
                    <div className="lg:col-span-6 flex flex-col items-center">
                        <div className="relative w-full max-w-[460px] aspect-square">
                            <svg
                                viewBox="0 0 100 100"
                                className="w-full h-full overflow-visible select-none"
                                role="img"
                                aria-label="長輝白金分會八大產業星盤圖"
                            >
                                <defs>
                                    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="#4CA8DF" stopOpacity="0.42" />
                                        <stop offset="55%" stopColor="#4CA8DF" stopOpacity="0.08" />
                                        <stop offset="100%" stopColor="#06203A" stopOpacity="0" />
                                    </radialGradient>
                                    <linearGradient id="activeBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#E8C547" stopOpacity="0.95" />
                                        <stop offset="100%" stopColor="#4CA8DF" stopOpacity="0.75" />
                                    </linearGradient>
                                </defs>

                                {/* 中心重力場光暈 */}
                                <circle cx="50" cy="50" r="44" fill="url(#coreGlow)" />

                                {/* 外圈刻度環與軌道環 */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.08)"
                                    strokeWidth="0.25"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="38"
                                    fill="none"
                                    stroke="rgba(76,168,223,0.28)"
                                    strokeWidth="0.35"
                                    strokeDasharray="1.2 1.2"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="22"
                                    fill="none"
                                    stroke="rgba(232,197,71,0.22)"
                                    strokeWidth="0.3"
                                />

                                {/* 十字航道座標線 */}
                                <line x1="50" y1="3" x2="50" y2="97" stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
                                <line x1="3" y1="50" x2="97" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />

                                {/* 跨星區協作連線 */}
                                {CROSS_LINKS.map(([a, b]) => {
                                    const p1 = polarToXY(SECTORS[a].angleDeg, SECTORS[a].orbitRadius);
                                    const p2 = polarToXY(SECTORS[b].angleDeg, SECTORS[b].orbitRadius);
                                    const isHighlighted = a === activeIdx || b === activeIdx;
                                    return (
                                        <line
                                            key={`${a}-${b}`}
                                            x1={p1.x}
                                            y1={p1.y}
                                            x2={p2.x}
                                            y2={p2.y}
                                            stroke={isHighlighted ? 'url(#activeBeam)' : 'rgba(148,163,184,0.16)'}
                                            strokeWidth={isHighlighted ? '0.65' : '0.28'}
                                        />
                                    );
                                })}

                                {/* 中心至當前選中星區的主光束 */}
                                {(() => {
                                    const target = polarToXY(active.angleDeg, active.orbitRadius);
                                    return (
                                        <line
                                            x1="50"
                                            y1="50"
                                            x2={target.x}
                                            y2={target.y}
                                            stroke="#E8C547"
                                            strokeWidth="0.55"
                                            strokeDasharray="1.5 1"
                                        />
                                    );
                                })()}

                                {/* 中心恆星：EVERSHINE 週三晨間母艦 */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="11.5"
                                    fill="#061A30"
                                    stroke="rgba(232,197,71,0.6)"
                                    strokeWidth="0.5"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="9.2"
                                    fill="none"
                                    stroke="rgba(76,168,223,0.4)"
                                    strokeWidth="0.3"
                                />
                                <text
                                    x="50"
                                    y="48.5"
                                    textAnchor="middle"
                                    fill="#F3E2A3"
                                    fontSize="2.7"
                                    fontWeight="700"
                                    letterSpacing="0.25"
                                >
                                    EVERSHINE
                                </text>
                                <text
                                    x="50"
                                    y="52.5"
                                    textAnchor="middle"
                                    fill="#9AD8F8"
                                    fontSize="2.1"
                                    fontFamily="monospace"
                                >
                                    WED 06:30
                                </text>

                                {/* 8 個星區節點 */}
                                {SECTORS.map((sec, idx) => {
                                    const pos = polarToXY(sec.angleDeg, sec.orbitRadius);
                                    const isSelected = idx === activeIdx;
                                    const isLinked = CROSS_LINKS.some(
                                        ([a, b]) => (a === activeIdx && b === idx) || (b === activeIdx && a === idx)
                                    );
                                    return (
                                        <g
                                            key={sec.id}
                                            onClick={() => setActiveIdx(idx)}
                                            className="cursor-pointer"
                                        >
                                            {/* 外圍感應熱區 */}
                                            <circle cx={pos.x} cy={pos.y} r="9" fill="transparent" />

                                            {isSelected && (
                                                <circle
                                                    cx={pos.x}
                                                    cy={pos.y}
                                                    r="7.4"
                                                    fill="rgba(232,197,71,0.16)"
                                                    stroke="#E8C547"
                                                    strokeWidth="0.45"
                                                />
                                            )}

                                            <circle
                                                cx={pos.x}
                                                cy={pos.y}
                                                r={isSelected ? '5.4' : '4.4'}
                                                fill={isSelected ? '#E8C547' : isLinked ? '#0D2D4D' : '#07182B'}
                                                stroke={
                                                    isSelected
                                                        ? '#FFF3C8'
                                                        : isLinked
                                                          ? '#7CD0FF'
                                                          : 'rgba(255,255,255,0.28)'
                                                }
                                                strokeWidth={isSelected ? '0.6' : '0.4'}
                                            />

                                            <text
                                                x={pos.x}
                                                y={pos.y + 0.9}
                                                textAnchor="middle"
                                                fill={isSelected ? '#06203A' : '#E2E8F0'}
                                                fontSize="2.4"
                                                fontWeight="700"
                                                fontFamily="monospace"
                                            >
                                                0{idx + 1}
                                            </text>

                                            {/* 標籤 */}
                                            <text
                                                x={pos.x}
                                                y={pos.y + (pos.y > 50 ? 9.2 : -6.8)}
                                                textAnchor="middle"
                                                fill={isSelected ? '#F3E2A3' : isLinked ? '#BAE6FD' : '#94A3B8'}
                                                fontSize="2.75"
                                                fontWeight={isSelected ? '700' : '500'}
                                            >
                                                {sec.shortName}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>

                        {/* 鍵盤與手機皆可快速點選的星區膠囊列 */}
                        <div
                            role="tablist"
                            aria-label="選擇八大產業星區"
                            className="mt-4 flex flex-wrap justify-center gap-2 max-w-lg"
                        >
                            {SECTORS.map((sec, idx) => {
                                const isSelected = idx === activeIdx;
                                return (
                                    <button
                                        key={sec.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={isSelected}
                                        onClick={() => setActiveIdx(idx)}
                                        className={`relative rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-platinum ${
                                            isSelected
                                                ? 'text-bg-dark'
                                                : 'border border-white/10 bg-white/[0.04] text-gray-300 hover:border-platinum/40 hover:text-white'
                                        }`}
                                    >
                                        {isSelected && (
                                            <motion.span
                                                layoutId="constellation-sector-pill"
                                                transition={spring.selection}
                                                className="absolute inset-0 rounded-full bg-platinum shadow-[0_0_16px_rgba(212,160,23,0.35)]"
                                                aria-hidden
                                            />
                                        )}
                                        <span className="relative z-10 font-mono mr-1 opacity-75">0{idx + 1}</span>
                                        <span className="relative z-10">{sec.shortName}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 右側：星區情報艙（切換顯示該產業代表席位與真實合作鏈） */}
                    <div className="lg:col-span-6">
                        <div className="glass-panel rounded-3xl p-6 sm:p-8 md:p-10 border border-white/15">
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.div
                                    key={active.id}
                                    initial={{ opacity: 0, filter: reduce ? 'none' : blur.icon }}
                                    animate={{
                                        opacity: 1,
                                        filter: 'blur(0px)',
                                        transition: swapTransition,
                                        transitionEnd: { filter: 'none' },
                                    }}
                                    exit={{
                                        opacity: 0,
                                        filter: reduce ? 'none' : blur.icon,
                                        transition: swapTransition,
                                    }}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                        <span className="inline-flex items-center gap-2 rounded-full border border-platinum/40 bg-platinum/10 px-3 py-1 font-mono text-xs font-bold tracking-widest text-platinum-soft">
                                            <span className="h-1.5 w-1.5 rounded-full bg-platinum-light" aria-hidden />
                                            {active.code} · EXCLUSIVE ORBIT
                                        </span>
                                        <span className="font-mono text-xs text-primary-light/80">
                                            一業一代表・同分會不撞業
                                        </span>
                                    </div>

                                    <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                                        {active.name}
                                    </h3>

                                    <p className="text-gray-300 text-base leading-relaxed mb-6">
                                        {active.chainStory}
                                    </p>

                                    {/* 席位構成 */}
                                    <div className="mb-6">
                                        <div className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-2.5">
                                            此星區涵蓋的專業席位
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {active.roles.map((role) => (
                                                <span
                                                    key={role}
                                                    className="rounded-lg border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-xs sm:text-sm font-medium text-sky-100"
                                                >
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 真實對接紀錄 */}
                                    <div className="rounded-2xl border border-platinum/30 bg-black/30 p-4 sm:p-5 mb-6">
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                            <span className="text-xs font-mono uppercase tracking-wider text-platinum-light">
                                                真實引薦軌跡 · VERIFIED LINK
                                            </span>
                                            <span className="rounded-full bg-platinum/20 border border-platinum/40 px-2.5 py-0.5 text-xs font-bold text-platinum-soft">
                                                {active.caseRef.metric}
                                            </span>
                                        </div>
                                        <div className="text-sm font-bold text-white mb-1">
                                            {active.caseRef.pair}
                                        </div>
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            {active.caseRef.summary}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <Button asChild>
                                            <Link
                                                to={`/members`}
                                                className="btn-lux btn-primary-lux inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold"
                                            >
                                                認識這個星區的會員
                                                <ArrowRight size={16} />
                                            </Link>
                                        </Button>
                                        <Button asChild>
                                            <Link
                                                to="/referrals"
                                                className="btn-lux btn-ghost-lux inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
                                            >
                                                看更多跨業案例
                                            </Link>
                                        </Button>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ConstellationMapSection;
