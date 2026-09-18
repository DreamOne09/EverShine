import React, { useState } from 'react';
import { siteConfig } from '../../config/site.config';
import { resolveMemberPhotoUrl } from '../../lib/memberPhotoUrl';
import { resolveMemberPhotoObjectPosition } from '../../lib/memberPhotoPosition';

interface ReferralAvatarProps {
    name: string;
    photo: string;
    photoPosition?: string;
    borderClassName: string;
    ringClassName: string;
    /** lg：引薦卡主人臉；md 保留給其他較小場合 */
    size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASS = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24 sm:h-28 sm:w-28 lg:h-[5.5rem] lg:w-[5.5rem] xl:h-28 xl:w-28',
} as const;

function initialsFromName(name: string): string {
    const trimmed = (name || '').trim();
    if (!trimmed) return '輝';
    return trimmed.slice(0, 1);
}

function hasUsablePhoto(photo: string): boolean {
    return Boolean(photo && photo.trim() && photo.trim() !== siteConfig.defaultPhoto);
}

/** 引薦案例頭像：無照片時改顯示姓名字首，避免整排都是同一個 logo */
const ReferralAvatar: React.FC<ReferralAvatarProps> = ({
    name,
    photo,
    photoPosition,
    borderClassName,
    ringClassName,
    size = 'md',
}) => {
    const src = resolveMemberPhotoUrl(photo);
    const [brokenSrc, setBrokenSrc] = useState<string | null>(null);
    const showFallback = !hasUsablePhoto(photo) || brokenSrc === src;

    return (
        <div
            data-testid="referral-avatar"
            className={`${SIZE_CLASS[size]} overflow-hidden rounded-full border ${borderClassName} ring-2 ${ringClassName} bg-slate-900 shadow-[0_10px_28px_rgba(0,0,0,0.4)]`}
        >
            {showFallback ? (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-slate-900 text-lg font-bold text-primary-light sm:text-xl">
                    {initialsFromName(name)}
                </div>
            ) : (
                <img
                    src={src}
                    alt={name}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: resolveMemberPhotoObjectPosition(photoPosition) }}
                    onError={() => setBrokenSrc(src)}
                />
            )}
        </div>
    );
};

export default ReferralAvatar;
