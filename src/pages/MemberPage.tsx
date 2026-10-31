import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import { Button } from '@animate-ui/react/primitives/buttons/button';
import { useMembers } from '../hooks/useMembers';
import { useReferrals } from '../hooks/useReferrals';
import { buildMemberSlug, resolveMemberFromSlug } from '../lib/memberSlug';
import SEO from '../components/common/SEO';
import { CardSkeleton, EmptyState } from '../components/loading';
import MemberDetailBody from '../components/members/MemberDetailBody';
import ReferralCard from '../components/referrals/ReferralCard';
import { siteConfig } from '../config/site.config';
import { splitIntro } from '../lib/memberIntroSplit';
import { resolveMemberPhotoObjectPosition } from '../lib/memberPhotoPosition';
import { EmblemConstellationMesh, EmblemVerifiedLedger } from '../components/home/StarshipEmblems';

const CATEGORY_MAPPING: Record<string, string> = {
    '工程裝修': '居住空間與工程',
    '居住與空間工程': '居住空間與工程',
    '企業行銷': '品牌整合與行銷',
    '企業顧問': '企業經營與法稅',
    '企業營運與法稅': '企業經營與法稅',
    '資訊系統': '數位科技與應用',
    '數位AI與創新科技': '數位科技與應用',
    '數位科技與智能應用': '數位科技與應用',
    '健康美麗': '健康照護與身心',
    '身心健康與醫療': '健康照護與身心',
    '美食餐飲': '生活服務與消費',
    '飲食文化與食品': '生活服務與消費',
    '休閒教育': '學習成長與探索',
    '教育學習與休閒': '學習成長與探索',
    '投資理財': '金融財富與資產',
};

function normalizePrimarySector(rawCategory?: string): string {
    if (!rawCategory) return '跨產業領域';
    const first = rawCategory.split(/[,|、]/)[0]?.trim() || '';
    if (!first) return '跨產業領域';
    if (CATEGORY_MAPPING[first]) return CATEGORY_MAPPING[first];
    const noSuffix = first.replace('生態圈', '');
    return noSuffix || '跨產業領域';
}

function getPhotoUrl(photo: string) {
    if (!photo) return siteConfig.defaultPhoto;
    const clean = photo.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
    return clean.startsWith('/') ? clean : `/${clean}`;
}

const MemberPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { members, loading, error } = useMembers();
    const { referrals } = useReferrals();
    const [copied, setCopied] = useState(false);
    const [selectedReferralId, setSelectedReferralId] = useState<string | null>(null);

    const member = useMemo(
        () => resolveMemberFromSlug(slug || '', members),
        [slug, members]
    );

    const primarySector = useMemo(
        () => normalizePrimarySector(member?.category),
        [member?.category]
    );

    const memberReferrals = useMemo(() => {
        if (!member) return [];
        const midStr = String(member.id);
        return referrals.filter((r) => {
            const matchId =
                (r.referrer?.memberId && String(r.referrer.memberId) === midStr) ||
                (r.referee?.memberId && String(r.referee.memberId) === midStr);
            const matchName =
                r.referrer?.name === member.name || r.referee?.name === member.name;
            return matchId || matchName;
        });
    }, [member, referrals]);

    const sameSectorPeers = useMemo(() => {
        if (!member) return [];
        return members
            .filter(
                (m) =>
                    m.id !== member.id &&
                    m.name !== '系統管理員' &&
                    normalizePrimarySector(m.category) === primarySector
            )
            .slice(0, 4);
    }, [member, members, primarySector]);

    if (loading) {
        return (
            <div className="min-h-dvh pt-28 pb-24 md:pt-32 md:pb-12 px-4 container mx-auto max-w-5xl">
                <CardSkeleton className="w-full" />
            </div>
        );
    }

    if (error || !member) {
        return (
            <div className="min-h-dvh pt-28 pb-24 md:pt-32 md:pb-12 px-4 container mx-auto max-w-2xl">
                <SEO title="找不到會員" noindex />
                <div className="text-center">
                    <EmptyState
                        title="找不到這位會員的檔案"
                        description={error || '此會員可能已不在分會在籍名單中，或網址有誤。'}
                        action={
                            <button
                                type="button"
                                onClick={() => navigate('/members')}
                                className="px-6 py-2.5 bg-primary text-bg-dark rounded-full hover:bg-primary/90 transition-colors font-bold inline-flex items-center gap-2"
                            >
                                <ArrowLeft size={16} /> 返回會員名錄
                            </button>
                        }
                        className="border-white/10 bg-white/[0.03]"
                    />
                </div>
            </div>
        );
    }

    const { main: introMain } = splitIntro(member.fullIntro || '');
    const cleanDescription = (
        member.shortIntro ||
        introMain ||
        member.fullIntro ||
        `${member.name}｜${member.industry || ''}｜${member.company || ''} — BNI 長輝白金分會獨家專業代表。`
    )
        .replace(/\\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 200);

    const titleText = `${member.name}｜${member.industry || '專業代表'}｜${siteConfig.branchFullName}`;
    const canonicalSlug = buildMemberSlug(member);

    const personSchema: Record<string, unknown> = {
        '@type': 'ProfilePage',
        url: `${siteConfig.siteUrl}/member/${canonicalSlug}`,
        name: titleText,
        mainEntity: {
            '@type': 'Person',
            '@id': `${siteConfig.siteUrl}/member/${canonicalSlug}#person`,
            name: member.name,
            jobTitle: member.position || member.title || undefined,
            worksFor: member.company
                ? { '@type': 'Organization', name: member.company }
                : undefined,
            memberOf: {
                '@type': 'Organization',
                '@id': `${siteConfig.siteUrl}/#organization`,
                name: siteConfig.branchFullName,
                url: siteConfig.siteUrl,
            },
            description: cleanDescription,
            image: member.photo
                ? member.photo.startsWith('http')
                    ? member.photo
                    : `${siteConfig.siteUrl}${member.photo.startsWith('/') ? '' : '/'}${member.photo}`
                : undefined,
        },
    };

    const handleShare = async () => {
        const shareData = {
            title: titleText,
            text: cleanDescription,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2200);
        } catch {
            // 使用者取消或不支援，靜默
        }
    };

    return (
        <div className="min-h-dvh pt-24 pb-24 md:pt-28 md:pb-20 px-4 container mx-auto max-w-5xl">
            <SEO
                title={titleText}
                description={cleanDescription}
                keywords={[
                    member.name,
                    member.industry,
                    member.company,
                    primarySector,
                    'BNI',
                    siteConfig.branchFullName,
                ]
                    .filter(Boolean)
                    .join(', ')}
                breadcrumbs={[
                    { name: '長輝會員', path: '/members' },
                    { name: `${member.name}（${member.industry || '會員'}）`, path: `/member/${canonicalSlug}` },
                ]}
                ogImage={member.photo && !member.photo.startsWith('http') ? member.photo : undefined}
                structuredData={personSchema}
            />

            {/* 頂部導覽與分享列 */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <Link
                    to="/members"
                    className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} /> 返回長輝會員名錄
                </Link>

                <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
                        在籍會員
                    </span>
                    <button
                        type="button"
                        onClick={handleShare}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-sky-400/50 hover:bg-sky-500/15 cursor-pointer"
                    >
                        {copied ? <Check size={14} className="text-emerald-300" /> : <Share2 size={14} />}
                        {copied ? '已複製獨立網址' : '分享此頁名片'}
                    </button>
                </div>
            </div>

            {/* 會員完整檔案 */}
            <Effect fade blur={{ initialBlur: 4 }} slide={{ offset: 14 }}>
                <article className="glass-panel relative overflow-hidden rounded-3xl border border-white/15 p-5 sm:p-8 md:p-10">
                    <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/10 pb-4">
                        <div>
                            <div className="font-mono text-[11px] tracking-wider text-platinum-light/90">
                                {siteConfig.branchFullName} · 會員編號 #{String(member.id).padStart(3, '0')}
                            </div>
                            <h1 className="mt-1 text-lg sm:text-xl font-bold text-white">
                                {member.name}
                                <span className="mx-2 text-white/30">｜</span>
                                <span className="text-primary-light">{member.industry || '專業代表'}</span>
                                <span className="hidden md:inline text-sm font-normal text-gray-400 ml-2">
                                    （{primarySector}）
                                </span>
                            </h1>
                        </div>
                        <Link
                            to={`/members?q=${encodeURIComponent(primarySector)}`}
                            className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-200 hover:border-sky-300/60 hover:text-white transition-colors"
                        >
                            產業分類：{primarySector}
                        </Link>
                    </header>

                    <MemberDetailBody member={member} expanded />
                </article>
            </Effect>

            {/* 此會員參與過的真實引薦紀錄 */}
            {memberReferrals.length > 0 && (
                <section className="mt-12" aria-labelledby="member-referrals-heading">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <span className="text-primary">
                                <EmblemVerifiedLedger size={30} />
                            </span>
                            <div>
                                <div className="text-xs font-semibold tracking-wider text-platinum-light">
                                    引薦合作紀錄
                                </div>
                                <h2 id="member-referrals-heading" className="text-xl sm:text-2xl font-black text-white">
                                    {member.name} 參與過的真實引薦案例（{memberReferrals.length} 則）
                                </h2>
                            </div>
                        </div>
                        <Link
                            to="/referrals"
                            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:text-white transition-colors"
                        >
                            查看全分會引薦案例 <ArrowRight size={15} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-start">
                        {memberReferrals.map((referral, index) => (
                            <ReferralCard
                                key={referral.id}
                                referral={referral}
                                index={index}
                                isSelected={selectedReferralId === referral.id}
                                onToggle={() =>
                                    setSelectedReferralId((cur) => (cur === referral.id ? null : referral.id))
                                }
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* 同產業領域的上下游合作夥伴 */}
            {sameSectorPeers.length > 0 && (
                <section className="mt-12" aria-labelledby="same-sector-peers-heading">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <span className="text-primary">
                                <EmblemConstellationMesh size={30} />
                            </span>
                            <div>
                                <div className="text-xs font-semibold tracking-wider text-platinum-light">
                                    同產業領域夥伴 · {primarySector}
                                </div>
                                <h2 id="same-sector-peers-heading" className="text-xl sm:text-2xl font-black text-white">
                                    同屬「{primarySector}」領域的合作夥伴
                                </h2>
                            </div>
                        </div>
                        <Link
                            to="/members"
                            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:text-white transition-colors"
                        >
                            瀏覽全部 59 位代表 <ArrowRight size={15} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {sameSectorPeers.map((peer) => {
                            const peerSlug = buildMemberSlug(peer);
                            return (
                                <Link
                                    key={peer.id}
                                    to={`/member/${peerSlug}`}
                                    className="glass-panel group flex items-center gap-3.5 rounded-2xl p-4 border border-white/10 hover:border-primary/50 transition-colors"
                                >
                                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/25 bg-slate-950">
                                        <img
                                            src={getPhotoUrl(peer.photo)}
                                            alt={peer.name}
                                            width={56}
                                            height={56}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            style={{
                                                objectPosition: resolveMemberPhotoObjectPosition(peer.photoPosition),
                                            }}
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="font-bold text-white group-hover:text-primary transition-colors truncate">
                                            {peer.name}
                                        </div>
                                        <div className="text-xs font-medium text-platinum-soft truncate">
                                            {peer.industry}
                                        </div>
                                        {peer.company && (
                                            <div className="text-[11px] text-gray-400 truncate mt-0.5">
                                                {peer.company}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* 底部：預約週三晨會交流 */}
            <section className="mt-12">
                <div className="glass-panel rounded-3xl border border-platinum/35 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div>
                        <div className="text-xs font-semibold tracking-wider text-platinum-light mb-1">
                            預約商務交流
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                            想在週三線上例會認識 {member.name}（{member.industry}）嗎？
                        </h2>
                        <p className="text-sm sm:text-base text-gray-300 max-w-2xl">
                            你可以直接撥打上方聯絡方式，或報名週三早上 06:30 的 Zoom 例會，一次認識 {member.name} 與整個「{primarySector}」領域的上下游企業主。
                        </p>
                    </div>
                    <div className="shrink-0">
                        <Button asChild>
                            <Link
                                to="/#contact"
                                className="btn-lux btn-platinum-lux inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm sm:text-base font-bold whitespace-nowrap"
                            >
                                <Sparkles size={17} />
                                預約來賓參觀
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MemberPage;
