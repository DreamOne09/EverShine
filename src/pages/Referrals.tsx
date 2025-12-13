import React from 'react';
import { useReferrals } from '../hooks/useReferrals';
import { motion } from 'framer-motion';
import { ArrowRight, Quote } from 'lucide-react';

const Referrals: React.FC = () => {
    const { referrals, loading, error } = useReferrals();
    const [selectedReferralId, setSelectedReferralId] = React.useState<string | null>(null);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error) return <div className="text-center py-20 text-red-400">無法載入引薦資料: {error}</div>;

    const toggleReferral = (id: string) => {
        if (selectedReferralId === id) {
            setSelectedReferralId(null);
        } else {
            setSelectedReferralId(id);
        }
    };

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
                            引薦案例
                        </span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        真實的引薦案例，展現 BNI 的商業價值。<br />每一次的引薦，都是一份信任的傳遞。
                    </p>
                </motion.div>
            </div>

            {/* Referrals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {referrals.map((referral, index) => {
                    const isSelected = selectedReferralId === referral.id;
                    return (
                        <motion.div
                            key={referral.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            onClick={() => toggleReferral(referral.id)}
                            className={`bg-bg-dark/60 backdrop-blur-md border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] group flex flex-col cursor-pointer ${isSelected ? 'border-primary ring-1 ring-primary' : 'border-white/10 hover:border-primary/50'
                                }`}
                        >
                            {/* Header Gradient */}
                            <div className={`h-2 bg-gradient-to-r from-primary-light via-primary to-primary-dark transition-opacity ${isSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />

                            <div className="p-8 flex-grow flex flex-col">
                                <h3 className={`text-2xl font-bold mb-4 transition-colors ${isSelected ? 'text-primary' : 'text-white group-hover:text-primary'}`}>
                                    {referral.title}
                                </h3>

                                <div className="flex items-start gap-4 mb-6">
                                    <Quote className="text-primary/40 shrink-0 transform rotate-180" size={32} />
                                    <p className={`text-gray-300 text-base leading-relaxed ${isSelected ? '' : 'line-clamp-3'}`}>
                                        {referral.description}
                                    </p>
                                </div>

                                {/* Metrics Badge */}
                                <div className="bg-primary/10 rounded-xl p-6 mb-8 border border-primary/20">
                                    <div className="text-xs text-primary-light uppercase tracking-wider mb-2 font-bold">成效數據</div>
                                    <div className="font-bold text-white text-lg">{referral.metrics.amount}</div>
                                    <div className="text-sm text-gray-400">{referral.metrics.type}</div>
                                </div>

                                {/* Members Connection */}
                                <div className="mt-auto border-t border-white/5 pt-6">
                                    <div className="flex items-center justify-between relative">
                                        {/* Referrer */}
                                        <div className="flex items-center gap-4 w-[45%]">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 shrink-0">
                                                <img
                                                    src={referral.referrer.photo || '/images/assets/logo/白色正方形logo.png'}
                                                    alt={referral.referrer.name}
                                                    className="w-full h-full object-cover object-[center_top]"
                                                    onError={(e) => e.currentTarget.src = '/images/assets/logo/白色正方形logo.png'}
                                                />
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="font-bold text-base truncate text-white">{referral.referrer.name}</div>
                                                <div className="text-xs text-gray-400 truncate">{referral.referrer.industry}</div>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/50">
                                            <ArrowRight size={20} />
                                        </div>

                                        {/* Referee */}
                                        <div className="flex items-center gap-4 w-[45%] justify-end text-right">
                                            <div className="overflow-hidden">
                                                <div className="font-bold text-base truncate text-white">{referral.referee.name}</div>
                                                <div className="text-xs text-gray-400 truncate">{referral.referee.industry}</div>
                                            </div>
                                            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 shrink-0">
                                                <img
                                                    src={referral.referee.photo || '/images/assets/logo/白色正方形logo.png'}
                                                    alt={referral.referee.name}
                                                    className="w-full h-full object-cover object-[center_top]"
                                                    onError={(e) => e.currentTarget.src = '/images/assets/logo/白色正方形logo.png'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Referrals;
