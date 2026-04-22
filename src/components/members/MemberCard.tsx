import React, { useMemo, useState } from 'react';
import type { Member } from '../../types';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Phone } from 'lucide-react';
import { siteConfig } from '../../config/site.config';
import { normalizeMemberLinks } from '../../lib/memberLinks';
import { formatTaiwanPhoneDisplay, formatTaiwanPhoneTelHref } from '../../lib/phoneFormat';

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

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="flex h-full min-h-[18.25rem] flex-col"
        >
            <div
                className={clsx(
                    'relative flex h-full min-h-[18.25rem] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-2xl',
                    'transition-all duration-300 ease-out',
                    'hover:scale-[1.02] hover:ring-1 hover:ring-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.12)]'
                )}
            >
                {/* 產業：右上角 */}
                <span className="absolute right-2 top-2 z-10 max-w-[46%] truncate rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] font-medium tracking-wide text-slate-300 backdrop-blur-sm">
                    {member.industry || '未分類'}
                </span>

                <div className="flex flex-1 flex-col items-center gap-1.5 pt-0.5 text-center">
                    <div className="h-[6.75rem] w-[6.75rem] shrink-0 overflow-hidden rounded-full border border-white/40 ring-1 ring-white/10 shadow-lg shadow-black/40">
                        <img
                            src={imgSrc}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                            style={{ objectPosition: member.photoPosition || 'center top' }}
                            onError={() => setImgSrc(siteConfig.defaultPhoto)}
                        />
                    </div>

                    <h3 className="line-clamp-1 w-full px-1 text-lg font-bold tracking-[0.2em] text-white">{member.name}</h3>

                    <div className="w-full space-y-0.5 px-0.5">
                        {member.company ? (
                            <p className="line-clamp-1 text-xs font-normal tracking-wide text-slate-400">{member.company}</p>
                        ) : null}
                        {titleLine ? (
                            <p className="line-clamp-1 text-xs font-normal tracking-wide text-slate-400">{titleLine}</p>
                        ) : null}
                    </div>

                    <p className="line-clamp-2 min-h-[2.25rem] w-full flex-1 px-0.5 text-center text-xs leading-snug text-slate-400">
                        {slogan || '\u00a0'}
                    </p>

                    {/* 底部：聯絡圖示與「完整介紹」整合為單一工具列 */}
                    <div className="mt-auto flex w-full items-stretch gap-0 overflow-hidden rounded-xl border border-white/12 bg-white/[0.04] pt-2">
                        {hasContactStrip ? (
                            <div className="flex shrink-0 items-center gap-0.5 border-r border-white/10 px-1.5 py-1">
                                {phoneHref ? (
                                    <a
                                        href={`tel:${phoneHref}`}
                                        title={phoneDisplay}
                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[#3b82f6] transition-colors hover:bg-white/10"
                                        aria-label={`電話 ${phoneDisplay}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Phone size={14} strokeWidth={2.2} />
                                    </a>
                                ) : null}
                                {lineUrl ? (
                                    <a
                                        href={lineUrl.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[#06C755] transition-colors hover:bg-[#06C755]/15"
                                        aria-label="LINE"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                                        </svg>
                                    </a>
                                ) : null}
                                {igUrl ? (
                                    <a
                                        href={igUrl.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-pink-200 transition-colors hover:bg-white/10"
                                        aria-label="Instagram"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                ) : null}
                            </div>
                        ) : null}
                        <button
                            type="button"
                            onClick={() => onOpenDetails(member)}
                            className="min-w-0 flex-1 px-2 py-1.5 text-xs font-semibold tracking-wide text-slate-200 transition-colors hover:bg-blue-500/15 hover:text-sky-100"
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
