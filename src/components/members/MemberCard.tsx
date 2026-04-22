import React, { useState } from 'react';
import type { Member } from '../../types';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { siteConfig } from '../../config/site.config';

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

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex h-full min-h-[22rem] flex-col"
        >
            <div
                className={clsx(
                    'flex h-full min-h-[22rem] flex-col rounded-2xl border border-white/10 bg-[#0B1120]/70 p-5 backdrop-blur-md',
                    'transition-all duration-300 ease-out',
                    'hover:scale-[1.02] hover:shadow-2xl hover:ring-2 hover:ring-sky-500/50'
                )}
            >
                <div className="flex flex-1 flex-col items-center text-center">
                    <div className="mb-4 h-24 w-24 shrink-0 overflow-hidden rounded-full border border-white/15 ring-1 ring-white/5">
                        <img
                            src={imgSrc}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover bg-[#06203a]"
                            style={{ objectPosition: member.photoPosition || 'center top' }}
                            onError={() => setImgSrc(siteConfig.defaultPhoto)}
                        />
                    </div>

                    {/* 行業優先：高對比區塊 */}
                    <div className="mb-3 w-full max-w-[95%]">
                        <span className="inline-flex w-full items-center justify-center rounded-xl border border-primary/45 bg-primary/25 px-3 py-2.5 text-center text-sm font-bold leading-snug text-sky-50 shadow-inner shadow-black/20">
                            {member.industry || '未分類'}
                        </span>
                    </div>

                    <h3 className="mb-2 text-xl font-bold text-white">{member.name}</h3>

                    <p className="mb-4 line-clamp-2 min-h-[2.75rem] flex-1 text-sm leading-relaxed text-gray-400">
                        {slogan || '\u00a0'}
                    </p>

                    <button
                        type="button"
                        onClick={() => onOpenDetails(member)}
                        className="mt-auto w-full rounded-xl border border-primary/40 bg-primary/15 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-[#0B1120]"
                    >
                        完整介紹
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default MemberCard;
