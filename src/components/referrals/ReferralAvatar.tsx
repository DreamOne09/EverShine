import React, { useEffect, useState } from 'react';
import { siteConfig } from '../../config/site.config';
import { resolveMemberPhotoUrl } from '../../lib/memberPhotoUrl';
import { resolveMemberPhotoObjectPosition } from '../../lib/memberPhotoPosition';

interface ReferralAvatarProps {
    name: string;
    photo: string;
    photoPosition?: string;
    borderClassName: string;
    ringClassName: string;
}

/** 引薦案例頭像：無照片或載入失敗時顯示長輝預設 logo */
const ReferralAvatar: React.FC<ReferralAvatarProps> = ({
    name,
    photo,
    photoPosition,
    borderClassName,
    ringClassName,
}) => {
    const [src, setSrc] = useState(() => resolveMemberPhotoUrl(photo));

    useEffect(() => {
        setSrc(resolveMemberPhotoUrl(photo));
    }, [photo]);

    return (
        <div
            className={`h-16 w-16 rounded-full overflow-hidden border-2 ${borderClassName} ring-2 ${ringClassName} bg-slate-900 shadow-[0_8px_20px_rgba(0,0,0,0.35)]`}
        >
            <img
                src={src}
                alt={name}
                className="w-full h-full object-cover"
                style={{ objectPosition: resolveMemberPhotoObjectPosition(photoPosition) }}
                onError={() => setSrc(siteConfig.defaultPhoto)}
            />
        </div>
    );
};

export default ReferralAvatar;
