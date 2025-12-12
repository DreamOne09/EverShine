import React, { useState, useMemo } from 'react';
import { useMembers } from '../hooks/useMembers';
import MemberCard from '../components/members/MemberCard';
import CategoryFilter from '../components/members/CategoryFilter';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

const Members: React.FC = () => {
    const { members, loading, error } = useMembers();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    // Extract unique categories (industries)
    const categories = useMemo(() => {
        const unique = Array.from(new Set(members.map(m => m.industry).filter(Boolean)));
        // Custom sort order if needed, otherwise alphabetical
        return unique.sort((a, b) => a.localeCompare(b, 'zh-TW'));
    }, [members]);

    // Filter logic
    const filteredMembers = useMemo(() => {
        return members.filter(member => {
            if (member.name === '人名') return false; // Filter out template placeholders if any

            const matchesCategory = activeCategory === 'All' || member.industry === activeCategory;
            const normalizedSearch = searchQuery.toLowerCase();
            const matchesSearch =
                member.name.toLowerCase().includes(normalizedSearch) ||
                (member.industry && member.industry.toLowerCase().includes(normalizedSearch)) ||
                (member.company && member.company.toLowerCase().includes(normalizedSearch)) ||
                (member.services && member.services.some(s => s.toLowerCase().includes(normalizedSearch))) ||
                (member.hashtags && member.hashtags.some(h => h.toLowerCase().includes(normalizedSearch)));

            return matchesCategory && matchesSearch;
        });
    }, [members, activeCategory, searchQuery]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error) return <div className="text-center py-20 text-red-400">無法載入會員資料: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="text-center mb-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">白金會員介紹</h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
                        我們匯聚了各行各業的菁英，透過彼此的專業協作，為客戶提供最值得信賴的服務。
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, width: "80%" }}
                    animate={{ opacity: 1, width: "100%" }}
                    className="relative max-w-lg mx-auto mb-10 group"
                >
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search className="text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="搜尋會員名字、行業、公司或服務..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-bg-dark/60 backdrop-blur-sm border border-gray-600 rounded-full py-3.5 pl-12 pr-6 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-lg"
                    />
                </motion.div>

                <CategoryFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onSelect={setActiveCategory}
                />
            </div>

            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
                <AnimatePresence mode='popLayout'>
                    {filteredMembers.map(member => (
                        <motion.div
                            layout
                            key={member.id || member.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <MemberCard member={member} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredMembers.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center text-gray-400 py-16 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm"
                >
                    <p className="text-xl">沒有找到符合條件的會員</p>
                    <button
                        onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                        className="mt-4 px-6 py-2 bg-primary text-bg-dark rounded-full hover:bg-[#b08d55] transition-colors font-bold"
                    >
                        清除搜尋條件
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default Members;
