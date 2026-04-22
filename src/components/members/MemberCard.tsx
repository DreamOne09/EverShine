import React, { useMemo, useState } from 'react';
import type { Member } from '../../types';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Phone } from 'lucide-react';
import { siteConfig } from '../../config/site.config';
import { normalizeMemberLinks } from '../../lib/memberLinks';
import { formatTaiwanPhoneDisplay, formatTaiwanPhoneTelHref } from '../../lib/phoneFormat';
import { idealPreviewLine } from '../../lib/memberIntroSplit';

export interface MemberCardProps {
    member: Member;
    onOpenDetails: (member: Member) => void;
}

function getPhotoUrl(photo: string) {
    if (!photo) return siteConfig.defaultPhoto;
    const clean = photo.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
    return clean.startsWith('/') ? clean : `/${clean}`;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onOpenDetails }) => {
    const [imgSrc, setImgSrc] = useState(getPhotoUrl(member.photo));
    React.useEffect(() => {
        setImgSrc(getPhotoUrl(member.photo));
    }, [member.photo]);

    const slogan = (member.shortIntro || member.fullIntro || '').replace(/\\n/g, ' ').trim();
    const titleLine = member.position || member.title || '';
    const links = useMemo(() => normalizeMemberLinks(member.links), [member.links]);
    const lineUrl = links.find((l) => (l.type || '').toLowerCase() === 'line');
    const igUrl = links.find((l) => {
        const t = (l.type || '').toLowerCase();
        return t === 'instagram' || t === 'ig';
    });
    const phoneDisplay = member.phone ? formatTaiwanPhoneDisplay(member.phone) : '';
    const phoneHref = member.phone ? formatTaiwanPhoneTelHref(member.phone) : '';
    const hasContactStrip = Boolean(phoneHref || lineUrl || igUrl);
    const idealLine = idealPreviewLine(member.fullIntro || '', 48);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="flex h-full min-h-[20rem] flex-col"
        >
            <div
                className={clsx(
                    'member-card-neon-breathe relative flex h-full min-h-[20rem] flex-col overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.065] p-2.5 backdrop-blur-xl',
                    'transition-transform duration-300 ease-out',
                    'hover:scale-[1.015] hover:border-sky-400/35'
                )}
            >
                <div className="flex flex-1 flex-col gap-2">
                    {/* 頭像 + 身分欄：提高資訊密度 */}
                    <div className="flex gap-2.5">
                        <div className="relative shrink-0">
                            <div className="h-[8.1rem] w-[8.1rem] overflow-hidden rounded-full border border-white/35 shadow-[0_12px_40px_rgba(0,0,0,0.45)] ring-1 ring-sky-400/20">
                                <img
                                    src={imgSrc}
                                    alt=""
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                    style={{ objectPosition: member.photoPosition || 'center top' }}
                                    onError={() => setImgSrc(siteConfig.defaultPhoto)}
                                />
                            </div>
                        </div>
                        <div className="min-w-0 flex-1 pt-0.5 text-left">
                            <div className="mb-1 flex justify-end">
                                <span className="max-w-full truncate rounded-full border border-white/15 bg-black/45 px-2 py-0.5 text-[11px] font-medium tracking-wide text-slate-200 backdrop-blur-sm">
                                    {member.industry || '未分類'}
                                </span>
                            </div>
                            <h3 className="line-clamp-1 text-xl font-bold tracking-[0.18em] text-white">{member.name}</h3>
                            <div className="mt-1 space-y-0.5">
                                {member.company ? (
                                    <p className="line-clamp-1 text-sm font-normal tracking-wide text-slate-300">{member.company}</p>
                                ) : null}
                                {titleLine ? (
                                    <p className="line-clamp-1 text-sm font-normal tracking-wide text-slate-400">{titleLine}</p>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <p className="line-clamp-2 min-h-[2.5rem] w-full px-0.5 text-left text-sm leading-snug text-slate-300">
                        {slogan || '\u00a0'}
                    </p>

                    {idealLine ? (
                        <p className="line-clamp-1 border-l-2 border-amber-400/70 pl-2 text-xs font-medium tracking-wide text-amber-100/95">
                            <span className="text-amber-400/90">理想引薦</span>
                            <span className="mx-1.5 text-slate-500">·</span>
                            <span className="text-slate-200/90">{idealLine}</span>
                        </p>
                    ) : (
                        <p className="line-clamp-1 text-xs text-slate-600">&nbsp;</p>
                    )}

                    {/* 底部工具列：深色底整合聯絡與 CTA */}
                    <div className="mt-auto flex w-full items-stretch gap-0 overflow-hidden rounded-xl border border-white/[0.1] bg-black/40 shadow-inner shadow-black/30">
                        {hasContactStrip ? (
                            <div className="flex shrink-0 items-center gap-0.5 border-r border-white/10 px-1.5 py-1.5">
                                {phoneHref ? (
                                    <a
                                        href={`tel:${phoneHref}`}
                                        title={phoneDisplay}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-sky-400 transition-colors hover:bg-white/10"
                                        aria-label={`電話 ${phoneDisplay}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Phone size={15} strokeWidth={2.2} />
                                    </a>
                                ) : null}
                                {lineUrl ? (
                                    <a
                                        href={lineUrl.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#06C755] transition-colors hover:bg-[#06C755]/15"
                                        aria-label="LINE"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                                        </svg>
                                    </a>
                                ) : null}
                                {igUrl ? (
                                    <a
                                        href={igUrl.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-pink-200 transition-colors hover:bg-white/10"
                                        aria-label="Instagram"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                ) : null}
                            </div>
                        ) : null}
                        <button
                            type="button"
                            onClick={() => onOpenDetails(member)}
                            className="min-w-0 flex-1 px-2 py-2 text-sm font-semibold tracking-wide text-slate-100 transition-colors hover:bg-sky-500/15 hover:text-sky-100"
                        >
                            完整介紹
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MemberCard;
