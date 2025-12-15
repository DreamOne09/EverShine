import React, { useState, useMemo } from 'react';
import { useMembers } from '../hooks/useMembers';
import MemberCard from '../components/members/MemberCard';
import CategoryFilter from '../components/members/CategoryFilter';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import PageHero from '../components/common/PageHero';

const Members: React.FC = () => {
    const { members, loading, error } = useMembers();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('全部');

    // Extract unique categories (major categories)
    const categories = useMemo(() => {
        const unique = new Set(members.flatMap(m =>
            m.category ? m.category.split(/[,|、]/).map(c => c.trim()) : []
        ).filter(Boolean));

        // Remove 'All' or '全部' if they exist in data to avoid duplicates with our default
        unique.delete('All');
        unique.delete('all');
        unique.delete('全部');

        // Custom sort order if needed, otherwise alphabetical
        return ['全部', ...Array.from(unique).sort((a, b) => a.localeCompare(b, 'zh-TW'))];
    }, [members]);

    // Filter logic
    const filteredMembers = useMemo(() => {
        return members.filter(member => {
            if (member.name === '人名') return false; // Filter out template placeholders if any

            // Only show members who have edited their profile (editCount > 0)
            if (!member.editCount || member.editCount <= 0) return false;

            const matchesCategory = activeCategory === '全部' || (member.category && member.category.includes(activeCategory));
            const normalizedSearch = searchQuery.toLowerCase();
            const matchesSearch =
                member.name.toLowerCase().includes(normalizedSearch) ||
                (member.category && member.category.toLowerCase().includes(normalizedSearch)) ||
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
        <div className="min-h-screen relative">
            <PageHero
                title="會員介紹"
                subtitle="我們為夥伴的生意著想，也為夥伴的生意做引薦"
            />

            <div className="container mx-auto px-4 py-8 relative z-10 pt-4 md:pt-10">
                <div className="text-center mb-8 relative z-10">

                    {/* Search Bar - Sticky on Mobile */}
                    <div className="sticky top-[60px] md:top-[80px] z-30 bg-bg-primary/95 backdrop-blur-xl py-4 -mx-4 px-4 mb-2 transition-all shadow-sm md:shadow-none md:static md:bg-transparent md:p-0">
                        <motion.div
                            initial={{ opacity: 0, width: "80%" }}
                            animate={{ opacity: 1, width: "100%" }}
                            className="relative max-w-lg mx-auto group"
                        >
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Search className="text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="搜尋會員名字、行業、公司..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-bg-dark/80 backdrop-blur-sm border border-gray-600 rounded-full py-3.5 pl-12 pr-6 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-lg"
                            />
                        </motion.div>
                    </div>

                    <CategoryFilter
                        categories={categories}
                        activeCategory={activeCategory}
                        onSelect={setActiveCategory}
                    />
                </div>

                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12"
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

                {/* Member Pledge - Moved to Bottom */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 max-w-3xl mx-auto mb-20 border border-white/10 text-left"
                >
                    <div className="text-center mb-6">
                        <h3 className="text-xl md:text-2xl font-bold text-primary mb-2">BNI 會員宣示</h3>
                        <div className="w-12 h-1 bg-primary/50 mx-auto rounded-full"></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-gray-300 text-sm md:text-base">
                        {[
                            "我願意提供我所承諾的服務品質與價格",
                            "我願意對會員及其引薦對象誠實",
                            "我願意在會員及其引薦對象之間建立善意與信任",
                            "我願意對接收到的引薦負責並進行追蹤",
                            "我願意展現正向與支持的態度",
                            "我願意遵守我行業的道德標準"
                        ].map((text, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <span className="text-primary font-bold font-mono text-lg">{idx + 1}.</span>
                                <p>{text}</p>
                            </div>
                        ))}
                    </div>
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
        </div>
    );
};

export default Members;
