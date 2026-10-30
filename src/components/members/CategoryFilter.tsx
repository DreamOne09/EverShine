import React from 'react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { useMotionTokens, useShouldReduceMotion } from '@animate-ui/react/utils/motion';

interface CategoryFilterProps {
    categories: string[];
    activeCategory: string;
    onSelect: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, activeCategory, onSelect }) => {
    const reduce = useShouldReduceMotion();
    const { spring, scale } = useMotionTokens();
    const pressedTransform = reduce ? 'scale(1)' : `scale(${scale.press})`;

    return (
        <div
            role="tablist"
            aria-label="產業分類篩選"
            className="flex w-full items-center gap-3 overflow-x-auto md:overflow-visible no-scrollbar pb-2 md:pb-0 px-4 md:px-0 -mx-4 md:mx-auto md:flex-wrap md:justify-center max-w-4xl mb-8 md:mb-12 mask-linear-gradient md:mask-none"
        >
            <div className="md:hidden absolute right-4 text-gray-500 text-xs pointer-events-none" aria-hidden>
                →
            </div>
            {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                    <motion.button
                        key={cat}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        initial={{ transform: 'scale(1)' }}
                        whileTap={{ transform: pressedTransform }}
                        transition={spring.press}
                        onClick={() => onSelect(cat)}
                        className={clsx(
                            'relative rounded-full border transition-colors duration-200 backdrop-blur-sm whitespace-nowrap shrink-0',
                            'px-3.5 py-1.5 text-sm sm:px-5 sm:py-2 sm:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-platinum',
                            isActive
                                ? 'text-bg-dark border-platinum font-bold'
                                : 'bg-white/5 text-gray-300 border-white/10 hover:border-platinum/50 hover:text-platinum-soft'
                        )}
                    >
                        {isActive && (
                            <motion.span
                                layoutId="member-category-indicator"
                                transition={spring.selection}
                                className="absolute inset-0 rounded-full bg-platinum shadow-[0_0_15px_rgba(212,160,23,0.28)]"
                                aria-hidden
                            />
                        )}
                        <span className="relative z-10">{cat}</span>
                    </motion.button>
                );
            })}
        </div>
    );
};

export default CategoryFilter;
