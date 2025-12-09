import React from 'react';
import { useReferrals } from '../hooks/useReferrals';
import ReferralCard from '../components/referrals/ReferralCard';
import { motion } from 'framer-motion';

const Referrals: React.FC = () => {
    const { referrals, loading, error } = useReferrals();

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-[#c5a47e] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error) return <div className="text-center py-20 text-red-400">無法載入引薦資料: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen relative z-10">
            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#c5a47e]">會員引薦報告</h1>
                    <div className="w-24 h-1 bg-[#c5a47e] mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        真實的業務引薦，實際的成交金額。這就是 BNI 系統運作的最佳證明。
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                {referrals.map((referral, index) => (
                    <motion.div
                        key={referral.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, delay: Math.min(index % 2 * 0.1, 0.3) }} // Stagger 2 items
                    >
                        <ReferralCard referral={referral} />
                    </motion.div>
                ))}
            </div>

            {referrals.length === 0 && (
                <div className="text-center text-gray-400 py-20 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                    目前暫無引薦報告
                </div>
            )}
        </div>
    );
};

export default Referrals;
