import React from 'react';
import { useReferrals } from '../hooks/useReferrals';
import { motion } from 'framer-motion';
import { ArrowRight, Quote } from 'lucide-react';

const Referrals: React.FC = () => {
    const { referrals, loading, error } = useReferrals();

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error) return <div className="text-center py-20 text-red-400">無法載入引薦資料: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            {/* Hero Section */}
            <div className="text-center mb-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight font-sans">
                        <span className="bg-clip-text text-transparent bg-gradient-to-br from-primary-light via-primary to-primary-dark drop-shadow-2xl">
                            商務引薦成果
                        </span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        真實的引薦案例，展現 BNI 的商業價值。<br />每一次的引薦，都是一份信任的傳遞。
                    </p>
                </motion.div>
            </div>

            {/* Referrals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {referrals.map((referral, index) => (
                    <motion.div
                        key={referral.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="bg-bg-dark/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] group flex flex-col"
                    >
                        {/* Header Gradient */}
                        <div className="h-2 bg-gradient-to-r from-primary-light via-primary to-primary-dark opacity-70 group-hover:opacity-100 transition-opacity" />

                        <div className="p-6 flex-grow flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                                {referral.title}
                            </h3>

                            <div className="flex items-start gap-3 mb-6">
                                <Quote className="text-primary/40 shrink-0 transform rotate-180" size={24} />
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {referral.description}
                                </p>
                            </div>

                            {/* Metrics Badge */}
                            <div className="bg-primary/10 rounded-xl p-4 mb-6 border border-primary/20">
                                <div className="text-xs text-primary-light uppercase tracking-wider mb-1">成效數據</div>
                                <div className="font-bold text-white">{referral.metrics.amount}</div>
                                <div className="text-sm text-gray-400">{referral.metrics.type}</div>
                            </div>

                            {/* Members Connection */}
                            <div className="mt-auto border-t border-white/5 pt-4">
                                <div className="flex items-center justify-between relative">
                                    {/* Referrer */}
                                    <div className="flex items-center gap-3 w-[45%]">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                                            <img
                                                src={referral.referrer.photo || '/images/assets/logo/白色正方形logo.png'}
                                                alt={referral.referrer.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.currentTarget.src = '/images/assets/logo/白色正方形logo.png'}
                                            />
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="font-bold text-sm truncate text-white">{referral.referrer.name}</div>
                                            <div className="text-xs text-gray-400 truncate">{referral.referrer.industry}</div>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/50">
                                        <ArrowRight size={16} />
                                    </div>

                                    {/* Referee */}
                                    <div className="flex items-center gap-3 w-[45%] justify-end text-right">
                                        <div className="overflow-hidden">
                                            <div className="font-bold text-sm truncate text-white">{referral.referee.name}</div>
                                            <div className="text-xs text-gray-400 truncate">{referral.referee.industry}</div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                                            <img
                                                src={referral.referee.photo || '/images/assets/logo/白色正方形logo.png'}
                                                alt={referral.referee.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.currentTarget.src = '/images/assets/logo/白色正方形logo.png'}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Referrals;
