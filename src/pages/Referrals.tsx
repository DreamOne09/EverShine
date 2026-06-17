import React, { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useReferrals } from '../hooks/useReferrals';
import { queryKeys } from '../api/queryKeys';
import { motion } from 'framer-motion';
import { ArrowRight, Quote, ChevronDown } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import SEO from '../components/common/SEO';
import { CardSkeleton, ErrorFallback, EmptyState, SmartImage } from '../components/loading';
import { resolveMemberPhotoObjectPosition } from '../lib/memberPhotoPosition';
import ReferralFilterBar from '../components/referrals/ReferralFilterBar';
import {
    REFERRAL_ALL_CATEGORY,
    countReferralsByCategory,
    filterReferrals,
    getReferralEcosystem,
} from '../lib/referralFilter';

const Referrals: React.FC = () => {
    const queryClient = useQueryClient();
    const { referrals, loading, error } = useReferrals();
    const [selectedReferralId, setSelectedReferralId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(REFERRAL_ALL_CATEGORY);

    const categoryCounts = useMemo(() => countReferralsByCategory(referrals), [referrals]);

    const filteredReferrals = useMemo(
        () => filterReferrals(referrals, { query: searchQuery, category: activeCategory }),
        [referrals, searchQuery, activeCategory]
    );

    if (loading) {
        return (
            <div className="min-h-[70vh] container mx-auto px-4 py-12 pt-24 md:pt-28 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
                <ErrorFallback
                    title="無法載入引薦資料"
                    message={error}
                    onRetry={() => void queryClient.invalidateQueries({ queryKey: queryKeys.referrals.list })}
                    className="max-w-md w-full"
                />
            </div>
        );
    }

    const toggleReferral = (id: string) => {
        if (selectedReferralId === id) {
            setSelectedReferralId(null);
        } else {
            setSelectedReferralId(id);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            <SEO
                title="商會引薦成功案例 | BNI 台灣商務合作實績"
                description="見證台灣 BNI 長輝白金分會的商務引薦實力。透過真實的引薦成功案例，展示台灣頂尖商會如何透過專業對接與互利合作，為企業主創造巨大的商業價值與商務合作機會。"
                keywords="商會引薦案例, BNI成功案例, 台灣商務合作, 商會合作實績, 引薦成功故事, 商務媒合案例, 台灣商會, BNI台灣"
                breadcrumbs={[{ name: '引薦案例', path: '/referrals' }]}
                structuredData={{
                    '@type': 'CollectionPage',
                    name: 'BNI 長輝白金分會商務引薦成功案例',
                    description: '台灣 BNI 長輝白金分會商務引薦成功案例與合作實績。',
                    url: 'https://evershine.tw/referrals',
                    isPartOf: { '@id': 'https://evershine.tw/#website' },
                    inLanguage: 'zh-TW'
                }}
            />
            <PageHero
                title="台灣商會引薦案例"
                subtitle={
                    <>
                        BNI 長輝白金分會真實的商務引薦案例<br />展現台灣商會的商業價值，每一次的引薦都是信任的傳遞
                    </>
                }
            />

            <div className="container mx-auto px-4 py-12 relative z-10">

                {/* Weekly Feature Note */}
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 text-center max-w-2xl mx-auto">
                    <p className="text-primary font-bold text-lg mb-1">每週精選案例</p>
                    <p className="text-gray-400 text-sm">
                        實際上門引薦單遠大於此，目前已累積 <span className="text-white font-mono font-bold">16,800+</span> 筆引薦商機，這裡僅展示每週精選的成功故事。
                    </p>
                </div>

                <ReferralFilterBar
                    query={searchQuery}
                    onQueryChange={setSearchQuery}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    totalCount={referrals.length}
                    filteredCount={filteredReferrals.length}
                    categoryCounts={categoryCounts}
                />

                {/* Referrals Grid - Waterfall/Vertical Stack on Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pb-8 md:pb-0 max-w-6xl mx-auto">
                    {filteredReferrals.length === 0 && referrals.length > 0 && (
                        <div className="col-span-full max-w-xl mx-auto">
                            <EmptyState
                                title="找不到符合的案例"
                                description="試試其他關鍵字，或切換分類篩選。"
                                className="border-white/10 bg-white/[0.03]"
                            />
                        </div>
                    )}
                    {referrals.length === 0 && (
                        <div className="col-span-full max-w-xl mx-auto">
                            <EmptyState
                                title="尚無引薦案例"
                                description="目前沒有可顯示的引薦資料。"
                                className="border-white/10 bg-white/[0.03]"
                            />
                        </div>
                    )}
                    {filteredReferrals.map((referral, index) => {
                        const isSelected = selectedReferralId === referral.id;
                        const ecosystem = getReferralEcosystem(referral);
                        return (
                            <motion.article
                                key={referral.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.45 }}
                                onClick={() => toggleReferral(referral.id)}
                                className={`bg-bg-dark/60 backdrop-blur-md border rounded-2xl overflow-hidden transition-colors duration-300 flex flex-col cursor-pointer h-full ${
                                    isSelected
                                        ? 'border-primary ring-1 ring-primary shadow-[0_8px_30px_rgba(59,130,246,0.15)]'
                                        : 'border-white/10 hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]'
                                }`}
                            >
                                <div className="h-1.5 bg-gradient-to-r from-primary-light via-primary to-primary-dark" />

                                <div className="p-6 md:p-7 flex-grow flex flex-col">
                                    {/* Title */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <h3 className={`flex-1 text-xl md:text-2xl font-bold transition-colors leading-snug ${
                                            isSelected ? 'text-primary' : 'text-white'
                                        }`}>
                                            {referral.title}
                                        </h3>
                                        <Quote
                                            className={`shrink-0 mt-1 transition-colors ${isSelected ? 'text-primary/60' : 'text-primary/30'}`}
                                            size={22}
                                            aria-hidden
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <span className="inline-block text-[10px] font-medium text-primary/90 bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5">
                                            {ecosystem}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className={`text-gray-300 text-sm md:text-base leading-relaxed mb-5 ${isSelected ? '' : 'line-clamp-3'}`}>
                                        {referral.description}
                                    </p>

                                    {/* Expanded stories */}
                                    {isSelected && (referral.referrer?.story || referral.referee?.story) && (
                                        <div className="space-y-3 mb-5">
                                            {referral.referrer?.story && (
                                                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
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
                                                <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-4">
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

                                    {/* Metrics Badge */}
                                    <div className="bg-primary/10 rounded-xl p-5 border border-primary/20 mt-auto">
                                        <div className="flex items-end justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="text-[10px] text-primary-light uppercase tracking-widest mb-1 font-bold">成效數據</div>
                                                <div className="font-bold text-white text-xl md:text-2xl truncate">{referral.metrics.amount}</div>
                                            </div>
                                            <div className="text-xs text-gray-300 font-medium px-2.5 py-1 bg-white/5 rounded-md shrink-0">
                                                {referral.metrics.type}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Members Connection — 橫向人物線，頭像放大且置中 */}
                                    <div className="mt-5 border-t border-white/10 pt-5">
                                        <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3 sm:gap-4">
                                            {/* Referrer */}
                                            <div className="flex flex-col items-center text-center min-w-0">
                                                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-primary/30 ring-2 ring-primary/10 bg-slate-900 shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
                                                    <SmartImage
                                                        src={referral.referrer.photo || '/images/assets/logo/白色正方形logo.png'}
                                                        alt={referral.referrer.name}
                                                        className="w-full h-full object-cover"
                                                        style={{
                                                            objectPosition: resolveMemberPhotoObjectPosition(
                                                                referral.referrer.photoPosition
                                                            ),
                                                        }}
                                                    />
                                                </div>
                                                <div className="mt-2 font-bold text-sm text-white truncate max-w-full">
                                                    {referral.referrer.name}
                                                </div>
                                                <div className="text-[11px] text-gray-400 line-clamp-1 max-w-full">
                                                    {referral.referrer.industry}
                                                </div>
                                            </div>

                                            {/* Arrow pill — 垂直對齊頭像中線 */}
                                            <div className="flex items-center justify-center pt-6">
                                                <div className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                                                    <span>引薦</span>
                                                    <ArrowRight size={12} />
                                                </div>
                                            </div>

                                            {/* Referee */}
                                            <div className="flex flex-col items-center text-center min-w-0">
                                                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-cyan-400/30 ring-2 ring-cyan-400/10 bg-slate-900 shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
                                                    <SmartImage
                                                        src={referral.referee.photo || '/images/assets/logo/白色正方形logo.png'}
                                                        alt={referral.referee.name}
                                                        className="w-full h-full object-cover"
                                                        style={{
                                                            objectPosition: resolveMemberPhotoObjectPosition(
                                                                referral.referee.photoPosition
                                                            ),
                                                        }}
                                                    />
                                                </div>
                                                <div className="mt-2 font-bold text-sm text-white truncate max-w-full">
                                                    {referral.referee.name}
                                                </div>
                                                <div className="text-[11px] text-gray-400 line-clamp-1 max-w-full">
                                                    {referral.referee.industry}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expand hint */}
                                        <div className="mt-4 flex items-center justify-center gap-1 text-[11px] text-gray-500">
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
                    })}
                </div>
            </div>
        </div>
    );
};

export default Referrals;
