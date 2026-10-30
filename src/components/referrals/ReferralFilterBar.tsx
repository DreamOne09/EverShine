import React from 'react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { useMotionTokens, useShouldReduceMotion } from '@animate-ui/react/utils/motion';
import { Search, X } from 'lucide-react';
import { REFERRAL_CATEGORIES } from '../../lib/referralFilter';

/** 分類 pill 顯示用短標（完整名稱放 title 供 hover） */
const CATEGORY_SHORT_LABELS: Record<string, string> = {
    全部: '全部案例',
    居住空間與工程: '居住工程',
    企業經營與法稅: '企業法稅',
    金融財富與資產: '金融資產',
    品牌整合與行銷: '品牌行銷',
    數位科技與應用: '數位科技',
    健康照護與身心: '健康身心',
    生活服務與消費: '生活消費',
    學習成長與探索: '學習探索',
};

interface ReferralFilterBarProps {
    query: string;
    onQueryChange: (value: string) => void;
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    totalCount: number;
    filteredCount: number;
    categoryCounts: Map<string, number>;
}

const ReferralFilterBar: React.FC<ReferralFilterBarProps> = ({
    query,
    onQueryChange,
    activeCategory,
    onCategoryChange,
    totalCount,
    filteredCount,
    categoryCounts,
}) => {
    const reduce = useShouldReduceMotion();
    const { spring, scale } = useMotionTokens();
    const pressedTransform = reduce ? 'scale(1)' : `scale(${scale.press})`;
    const hasActiveFilters = query.trim().length > 0 || activeCategory !== '全部';

    return (
        <div className="max-w-7xl mx-auto mb-8 md:mb-10 space-y-4">
            <div className="sticky top-[60px] md:top-[72px] z-20 -mx-1 px-1 py-2 bg-bg-primary/95 backdrop-blur-md rounded-xl md:static md:bg-transparent md:backdrop-blur-none md:p-0">
                <div className="relative max-w-xl mx-auto">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={18}
                        aria-hidden
                    />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder="搜尋案例、會員姓名、產業或關鍵字…"
                        aria-label="搜尋引薦案例"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors text-sm md:text-base"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => onQueryChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white rounded-md"
                            aria-label="清除搜尋"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2" role="tablist" aria-label="案例產業分類">
                {REFERRAL_CATEGORIES.map((cat) => {
                    const count = categoryCounts.get(cat) ?? 0;
                    const isActive = activeCategory === cat;
                    const shortLabel = CATEGORY_SHORT_LABELS[cat] ?? cat;
                    return (
                        <motion.button
                            key={cat}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            title={cat}
                            initial={{ transform: 'scale(1)' }}
                            whileTap={{ transform: pressedTransform }}
                            transition={spring.press}
                            onClick={() => onCategoryChange(cat)}
                            className={clsx(
                                'relative rounded-xl border transition-colors duration-200 text-left',
                                'px-2.5 py-2 text-xs sm:text-sm flex items-center justify-between gap-1.5 min-h-[2.75rem]',
                                isActive
                                    ? 'text-bg-dark border-platinum font-bold'
                                    : 'bg-white/5 text-gray-300 border-white/10 hover:border-platinum/50 hover:text-platinum-soft'
                            )}
                        >
                            {isActive && (
                                <motion.span
                                    layoutId="referral-category-indicator"
                                    transition={spring.selection}
                                    className="absolute inset-0 rounded-xl bg-platinum shadow-[0_0_12px_rgba(212,160,23,0.25)]"
                                    aria-hidden
                                />
                            )}
                            <span className="relative z-10 leading-tight line-clamp-2">{shortLabel}</span>
                            <span
                                className={clsx(
                                    'relative z-10 tabular-nums text-[10px] px-1.5 py-0.5 rounded-full shrink-0',
                                    isActive ? 'bg-bg-dark/20 text-bg-dark' : 'bg-white/10 text-gray-400'
                                )}
                            >
                                {count}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-400">
                <span>
                    顯示 <span className="text-white font-semibold tabular-nums">{filteredCount}</span>
                    {' / '}
                    <span className="tabular-nums">{totalCount}</span> 筆案例
                </span>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={() => {
                            onQueryChange('');
                            onCategoryChange('全部');
                        }}
                        className="text-primary hover:text-primary-light underline-offset-2 hover:underline text-xs sm:text-sm"
                    >
                        清除篩選
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReferralFilterBar;
