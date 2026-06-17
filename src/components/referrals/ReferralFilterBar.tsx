import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { REFERRAL_CATEGORIES } from '../../lib/referralFilter';

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
    const hasActiveFilters = query.trim().length > 0 || activeCategory !== '全部';

    return (
        <div className="max-w-6xl mx-auto mb-8 md:mb-10 space-y-4">
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all text-sm md:text-base"
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

            <div className="flex w-full items-center gap-2.5 overflow-x-auto no-scrollbar pb-1 px-1 md:flex-wrap md:justify-center">
                {REFERRAL_CATEGORIES.map((cat) => {
                    const count = categoryCounts.get(cat) ?? 0;
                    const isActive = activeCategory === cat;
                    return (
                        <motion.button
                            key={cat}
                            type="button"
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onCategoryChange(cat)}
                            className={clsx(
                                'rounded-full border transition-all duration-200 whitespace-nowrap shrink-0',
                                'px-3 py-1.5 text-xs sm:text-sm flex items-center gap-1.5',
                                isActive
                                    ? 'bg-primary text-bg-dark border-primary font-bold shadow-[0_0_12px_rgba(76,168,223,0.25)]'
                                    : 'bg-white/5 text-gray-300 border-white/10 hover:border-primary/60 hover:text-primary'
                            )}
                        >
                            <span>{cat === '全部' ? '全部案例' : cat}</span>
                            <span
                                className={clsx(
                                    'tabular-nums text-[10px] px-1.5 py-0.5 rounded-full',
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
