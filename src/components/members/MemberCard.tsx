import React, { useMemo, useState } from 'react';
import type { Member } from '../../types';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Phone } from 'lucide-react';
import { siteConfig } from '../../config/site.config';
import { normalizeMemberLinks } from '../../lib/memberLinks';
import { formatTaiwanPhoneDisplay } from '../../lib/phoneFormat';

export interface MemberCardProps {
    member: Member;
    onOpenDetails: (member: Member) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onOpenDetails }) => {
    const getPhotoUrl = (photo: string) => {
        if (!photo) return siteConfig.defaultPhoto;
        const cleanPhoto = photo.trim();
        if (cleanPhoto.startsWith('http://') || cleanPhoto.startsWith('https://')) return cleanPhoto;
        return cleanPhoto.startsWith('/') ? cleanPhoto : `/${cleanPhoto}`;
    };

    const [imgSrc, setImgSrc] = useState(getPhotoUrl(member.photo));

    React.useEffect(() => {
        setImgSrc(getPhotoUrl(member.photo));
    }, [member.photo]);

    const slogan = (member.shortIntro || member.fullIntro || '').replace(/\\n/g, ' ').trim();
    const titleLine = member.position || member.title || '';
    const links = useMemo(() => normalizeMemberLinks(member.links), [member.links]);
    const lineUrl = useMemo(() => links.find((l) => (l.type || '').toLowerCase() === 'line'), [links]);
    const phoneDisplay = member.phone ? formatTaiwanPhoneDisplay(member.phone) : '';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex h-full min-h-[20rem] flex-col"
        >
            <div
                className={clsx(
                    'relative flex h-full min-h-[20rem] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B1120]/75 p-4 backdrop-blur-md',
                    'transition-all duration-300 ease-out',
                    'hover:scale-[1.02] hover:shadow-2xl hover:ring-2 hover:ring-sky-500/50'
                )}
            >
                {/* 行業：左上角絕對定位、小字 */}
                <span className="absolute left-2 top-2 z-10 max-w-[calc(100%-1rem)] truncate rounded-md border border-primary/35 bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-200 backdrop-blur-sm sm:text-[11px]">
                    {member.industry || '未分類'}
                </span>

                <div className="flex flex-1 flex-col items-center gap-1.5 pt-6 text-center">
                    {/* 頭像 +25%：原 6rem → 7.5rem */}
                    <div className="h-[7.5rem] w-[7.5rem] shrink-0 overflow-hidden rounded-full border border-white/15 ring-1 ring-white/5">
                        <img
                            src={imgSrc}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover bg-[#06203a]"
                            style={{ objectPosition: member.photoPosition || 'center top' }}
                            onError={() => setImgSrc(siteConfig.defaultPhoto)}
                        />
                    </div>

                    <h3 className="line-clamp-1 w-full px-1 text-lg font-bold leading-tight text-white">{member.name}</h3>

                    {member.company ? (
                        <p className="line-clamp-1 w-full px-1 text-xs font-normal text-gray-400">{member.company}</p>
                    ) : (
                        <span className="h-3" aria-hidden />
                    )}
                    {titleLine ? (
                        <p className="line-clamp-1 w-full px-1 text-[11px] font-normal text-gray-500">{titleLine}</p>
                    ) : (
                        <span className="h-3" aria-hidden />
                    )}

                    <p className="line-clamp-2 min-h-[2.25rem] w-full flex-1 px-0.5 text-[11px] leading-snug text-gray-400 sm:text-xs">
                        {slogan || '\u00a0'}
                    </p>

                    {/* 聯絡預覽列 */}
                    <div className="mt-1 flex w-full flex-col gap-1 border-t border-white/10 pt-2 text-left">
                        {phoneDisplay && (
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-300">
                                <Phone className="shrink-0 text-primary/90" size={12} strokeWidth={2.5} aria-hidden />
                                <span className="truncate tabular-nums">{phoneDisplay}</span>
                            </div>
                        )}
                        {lineUrl && (
                            <a
                                href={lineUrl.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-[11px] text-emerald-300/90 hover:text-emerald-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 opacity-90" aria-hidden>
                                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                                </svg>
                                <span className="truncate">LINE</span>
                            </a>
                        )}
                        {!phoneDisplay && !lineUrl && <span className="text-[10px] text-gray-600">—</span>}
                    </div>

                    <button
                        type="button"
                        onClick={() => onOpenDetails(member)}
                        className="mt-auto w-full rounded-lg border border-primary/40 bg-primary/15 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-[#0B1120]"
                    >
                        完整介紹
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default MemberCard;
