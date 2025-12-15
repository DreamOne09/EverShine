import React from 'react';
import { useReferrals } from '../hooks/useReferrals';
import { motion } from 'framer-motion';
import { ArrowRight, Quote } from 'lucide-react';
import PageHero from '../components/common/PageHero';

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
        <div className="min-h-screen relative overflow-hidden">
            <PageHero
                title="引薦案例"
                subtitle={
                    <>
                        真實的引薦案例，展現 BNI 的商業價值。<br />每一次的引薦，都是一份信任的傳遞。
                    </>
                }
            />

            <div className="container mx-auto px-4 py-12 relative z-10">

                {/* Referrals Grid */}
                {/* Referrals Grid */}
                <div className="flex md:grid md:grid-cols-2 overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-4 md:gap-8 pb-6 md:pb-0 px-4 -mx-4 md:mx-0 no-scrollbar items-stretch max-w-6xl mx-auto">
                    {referrals.map((referral, index) => {
                        const isSelected = selectedReferralId === referral.id;
                        return (
                            <div key={referral.id} className="snap-center shrink-0 w-[85vw] md:w-auto h-full">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    onClick={() => toggleReferral(referral.id)}
                                    className={`bg-bg-dark/60 backdrop-blur-md border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] group flex flex-col cursor-pointer h-full ${isSelected ? 'border-primary ring-1 ring-primary z-20 scale-[1.02]' : 'border-white/10 hover:border-primary/50'
                                        }`}
                                >
                                    <div className="h-2 bg-gradient-to-r from-primary-light via-primary to-primary-dark transition-opacity" />

                                    <div className="p-6 md:p-8 flex-grow flex flex-col">
                                        <h3 className={`text-xl md:text-2xl font-bold mb-4 transition-colors leading-snug ${isSelected ? 'text-primary' : 'text-white group-hover:text-primary'}`}>
                                            {referral.title}
                                        </h3>

                                        <div className="flex items-start gap-4 mb-6">
                                            <Quote className="text-primary/40 shrink-0 transform rotate-180" size={32} />
                                            <div className="flex-1">
                                                <p className={`text-gray-300 text-base leading-relaxed ${isSelected ? '' : 'line-clamp-3'}`}>
                                                    {referral.description}
                                                </p>
                                                {isSelected && referral.referrer?.story && (
                                                    <div className="mt-4 pt-4 border-t border-white/10">
                                                        <p className="text-xs text-primary mb-1">引薦人故事：</p>
                                                        <p className="text-gray-400 text-sm italic">{referral.referrer.story}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Metrics Badge */}
                                        <div className="bg-primary/10 rounded-xl p-6 mb-8 border border-primary/20 mt-auto">
                                            <div className="text-xs text-primary-light uppercase tracking-wider mb-2 font-bold">成效數據</div>
                                            <div className="flex justify-between items-end">
                                                <div className="font-bold text-white text-2xl">{referral.metrics.amount}</div>
                                                <div className="text-sm text-gray-400 font-medium px-2 py-1 bg-white/5 rounded">{referral.metrics.type}</div>
                                            </div>
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
                                                        <div className="text-xs text-gray-500 mb-0.5">引薦人</div>
                                                        <div className="font-bold text-base truncate text-white">{referral.referrer.name}</div>
                                                        <div className="text-xs text-gray-400 truncate">{referral.referrer.industry}</div>
                                                    </div>
                                                </div>

                                                {/* Arrow */}
                                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/50 flex flex-col items-center">
                                                    <span className="text-[10px] text-primary/70 mb-1">引薦給</span>
                                                    <ArrowRight size={20} />
                                                </div>

                                                {/* Referee */}
                                                <div className="flex items-center gap-4 w-[45%] justify-end text-right">
                                                    <div className="overflow-hidden">
                                                        <div className="text-xs text-gray-500 mb-0.5">被引薦人</div>
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
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Referrals;
