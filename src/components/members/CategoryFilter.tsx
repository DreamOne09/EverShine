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

            {categories.map(cat => (
                <motion.button
                    key={cat}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(cat)}
                    className={clsx(
                        "px-5 py-2 rounded-full border transition-all duration-300 backdrop-blur-sm",
                        activeCategory === cat
                            ? "bg-primary text-bg-dark border-primary font-bold shadow-[0_0_15px_rgba(76,168,223,0.3)]"
                            : "bg-white/5 text-gray-300 border-white/10 hover:border-primary hover:text-primary"
                    )}
                >
                    {cat}
                </motion.button>
            ))}
        </div>
    );
};

export default CategoryFilter;
