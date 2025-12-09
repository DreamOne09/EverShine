import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
    categories: string[];
    activeCategory: string;
    onSelect: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, activeCategory, onSelect }) => {
    return (
        <div className="flex flex-wrap gap-3 justify-center mb-12">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect('All')}
                className={clsx(
                    "px-5 py-2 rounded-full border transition-all duration-300 backdrop-blur-sm",
                    activeCategory === 'All'
                        ? "bg-[#c5a47e] text-[#06203a] border-[#c5a47e] font-bold shadow-[0_0_15px_rgba(197,164,126,0.3)]"
                        : "bg-white/5 text-gray-300 border-white/10 hover:border-[#c5a47e] hover:text-[#c5a47e]"
                )}
            >
                全部
            </motion.button>
            {categories.map(cat => (
                <motion.button
                    key={cat}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(cat)}
                    className={clsx(
                        "px-5 py-2 rounded-full border transition-all duration-300 backdrop-blur-sm",
                        activeCategory === cat
                            ? "bg-[#c5a47e] text-[#06203a] border-[#c5a47e] font-bold shadow-[0_0_15px_rgba(197,164,126,0.3)]"
                            : "bg-white/5 text-gray-300 border-white/10 hover:border-[#c5a47e] hover:text-[#c5a47e]"
                    )}
                >
                    {cat}
                </motion.button>
            ))}
        </div>
    );
};

export default CategoryFilter;
