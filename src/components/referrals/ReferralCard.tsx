import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Quote, ChevronDown } from 'lucide-react';
import type { Referral } from '../../types';
import { getReferralEcosystem } from '../../lib/referralFilter';
import ReferralAvatar from './ReferralAvatar';

interface ReferralCardProps {
    referral: Referral;
    isSelected: boolean;
    onToggle: () => void;
    index: number;
}

const ReferralCard: React.FC<ReferralCardProps> = ({
    referral,
    isSelected,
    onToggle,
    index,
}) => {
    const ecosystem = getReferralEcosystem(referral);
    const showMetricsType =
        Boolean(referral.metrics.type) &&
        referral.metrics.type !== referral.title &&
        referral.metrics.type !== ecosystem;
    const hasStories = Boolean(referral.referrer?.story || referral.referee?.story);

    const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle();
        }
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.04, 0.32), duration: 0.4 }}
            onClick={onToggle}
            onKeyDown={onKeyDown}
            role="button"
            tabIndex={0}
            aria-expanded={isSelected}
            className={`min-w-0 bg-bg-dark/60 backdrop-blur-md border rounded-2xl overflow-hidden transition-colors duration-300 flex flex-col cursor-pointer h-full ${
                isSelected
                    ? 'border-primary ring-1 ring-primary shadow-[0_8px_30px_rgba(59,130,246,0.15)]'
                    : 'border-white/10 hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]'
            }`}
        >
            <div className="h-1.5 bg-gradient-to-r from-primary-light via-primary to-primary-dark" />

            <div className="p-4 sm:p-5 flex-grow flex flex-col">
                <div className="flex items-start gap-2 mb-2.5">
                    <h3
                        className={`flex-1 text-[1.05rem] sm:text-lg font-bold transition-colors leading-snug ${
                            isSelected ? 'text-primary' : 'text-white'
                        }`}
                    >
                        {referral.title}
                    </h3>
                    <Quote
                        className={`shrink-0 mt-0.5 transition-colors ${isSelected ? 'text-primary/60' : 'text-primary/30'}`}
                        size={18}
                        aria-hidden
                    />
                </div>
                <div className="flex flex-wrap items-start gap-2 mb-3">
                    <span className="inline-block text-[10px] font-medium text-primary/90 bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5 max-w-full">
                        {ecosystem}
                    </span>
                </div>

                <p className={`text-gray-300 text-sm leading-relaxed mb-4 ${isSelected ? '' : 'line-clamp-3'}`}>
                    {referral.description}
                </p>

                {isSelected && hasStories && (
                    <div className="space-y-3 mb-4">
                        {referral.referrer?.story && (
                            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-1.5">
                                    引薦人真心話
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed italic">
                                    「{referral.referrer.story}」
                                </p>
                                <div className="mt-2 text-right text-xs text-primary/70">— {referral.referrer.name}</div>
                            </div>
                        )}
                        {referral.referee?.story && (
                            <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-3.5">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-200/80 mb-1.5">
                                    被引薦人回饋
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed">
                                    {referral.referee.story}
                                </p>
                                <div className="mt-2 text-right text-xs text-cyan-200/70">— {referral.referee.name}</div>
                            </div>
                        )}
                    </div>
                )}

                <div className="bg-primary/10 rounded-xl px-3.5 py-3 border border-primary/20 mt-auto">
                    <div className="text-[10px] text-primary-light uppercase tracking-widest mb-0.5 font-bold">成效數據</div>
                    <div className="font-bold text-white text-lg break-words leading-snug">{referral.metrics.amount}</div>
                    {showMetricsType && (
                        <div className="mt-2 text-xs text-gray-300 font-medium px-2 py-1 bg-white/5 rounded-md w-fit max-w-full line-clamp-2">
                            {referral.metrics.type}
                        </div>
                    )}
                </div>

                <div className="mt-4 border-t border-white/10 pt-4">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
                        <div className="flex flex-col items-center text-center min-w-0">
                            <ReferralAvatar
                                name={referral.referrer.name}
                                photo={referral.referrer.photo}
                                photoPosition={referral.referrer.photoPosition}
                                borderClassName="border-primary/30"
                                ringClassName="ring-primary/10"
                                size="sm"
                            />
                            <div className="mt-1.5 font-bold text-xs sm:text-sm text-white break-words text-center max-w-full">
                                {referral.referrer.name}
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-gray-400 line-clamp-2 max-w-full text-center">
                                {referral.referrer.industry}
                            </div>
                        </div>

                        <div className="flex items-center justify-center pt-5">
                            <div className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                                <span>引薦</span>
                                <ArrowRight size={11} />
                            </div>
                        </div>

                        <div className="flex flex-col items-center text-center min-w-0">
                            <ReferralAvatar
                                name={referral.referee.name}
                                photo={referral.referee.photo}
                                photoPosition={referral.referee.photoPosition}
                                borderClassName="border-cyan-400/30"
                                ringClassName="ring-cyan-400/10"
                                size="sm"
                            />
                            <div className="mt-1.5 font-bold text-xs sm:text-sm text-white break-words text-center max-w-full">
                                {referral.referee.name}
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-gray-400 line-clamp-2 max-w-full text-center">
                                {referral.referee.industry}
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-gray-500">
                        <span>{isSelected ? '點擊收合' : '點擊展開完整故事'}</span>
                        <ChevronDown
                            size={12}
                            className={`transition-transform ${isSelected ? 'rotate-180' : ''}`}
                            aria-hidden
                        />
                    </div>
                </div>
            </div>
        </motion.article>
    );
};

export default ReferralCard;
