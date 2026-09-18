import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useMembers } from '../../hooks/useMembers';
import { resolveMemberPhotoObjectPosition } from '../../lib/memberPhotoPosition';
import { buildMemberSlug } from '../../lib/memberSlug';
import { motion } from 'framer-motion';
import SectionLabel from '../common/SectionLabel';

const MemberThumbnail: React.FC<{
    photo: string;
    name: string;
    industry: string;
    photoPosition?: string;
    href: string;
}> = ({ photo, name, industry, photoPosition, href }) => {
    const resolvedPhoto = (() => {
        if (!photo) return '/images/assets/logo/白色正方形logo.png';
        const cleanP = photo.trim();
        if (cleanP.startsWith('http')) return cleanP;
        return cleanP.startsWith('/') ? cleanP : `/${cleanP}`;
    })();
    const [brokenSrc, setBrokenSrc] = useState<string | null>(null);
    const imgSrc = brokenSrc === resolvedPhoto ? '/images/assets/logo/白色正方形logo.png' : resolvedPhoto;

    return (
        <Link
            to={href}
            className="mx-3 flex w-24 flex-shrink-0 flex-col items-center text-center md:mx-4 md:w-32"
            aria-label={`查看 ${name} 的會員頁`}
        >
            <div className="relative h-24 w-24 overflow-hidden rounded-full border border-white/15 transition-all duration-300 hover:border-platinum/50 hover:shadow-[0_0_24px_rgba(212,160,23,0.18)] md:h-32 md:w-32">
                <img
                    src={imgSrc}
                    alt={name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    style={{ objectPosition: resolveMemberPhotoObjectPosition(photoPosition) }}
                    onError={() => setBrokenSrc(resolvedPhoto)}
                />
            </div>
            <span className="mt-2 line-clamp-1 text-sm font-bold tracking-wide text-white md:text-base">{name}</span>
            <span className="mt-0.5 line-clamp-1 text-[10px] text-primary-light/90 md:text-xs">{industry}</span>
        </Link>
    );
};

const MarqueeRow: React.FC<{ children: React.ReactNode; direction?: 'left' | 'right'; speed?: number }> = ({
    children,
    direction = 'left',
    speed = 20,
}) => {
    return (
        <div className="flex overflow-hidden py-3 select-none">
            <motion.div
                className="flex items-start"
                initial={{ x: direction === 'left' ? '0%' : '-50%' }}
                animate={{ x: direction === 'left' ? '-50%' : '0%' }}
                transition={{ repeat: Infinity, ease: 'linear', duration: speed }}
            >
                {children}
                {children}
                {children}
                {children}
            </motion.div>
        </div>
    );
};

const MemberWall: React.FC = () => {
    const { members, loading } = useMembers();

    if (loading) return <div className="py-20 text-center text-gray-500">載入會員中…</div>;
    if (!members.length) return null;

    const validMembers = members.filter((m) => m.name !== '系統管理員');

    const chunkSize = Math.ceil(validMembers.length / 3);
    const row1 = validMembers.slice(0, chunkSize);
    const row2 = validMembers.slice(chunkSize, chunkSize * 2);
    const row3 = validMembers.slice(chunkSize * 2);

    const renderRow = (row: typeof validMembers) => (
        <div className="flex">
            {row.map((m) => (
                <MemberThumbnail
                    key={m.id}
                    photo={m.photo}
                    name={m.name}
                    industry={m.industry}
                    photoPosition={m.photoPosition}
                    href={`/member/${buildMemberSlug(m)}`}
                />
            ))}
        </div>
    );

    return (
        <section className="relative flex min-h-[80vh] flex-col justify-center overflow-hidden py-16">
            <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]"></div>

            <div className="relative z-10 mb-10 text-center">
                <SectionLabel>Members</SectionLabel>
                <h2 className="mb-3 text-3xl font-black text-white md:text-4xl">我們的會員</h2>
                <div className="mx-auto mb-3 h-1 w-16 rounded-full bg-primary"></div>
                <p className="text-lg tracking-wide text-gray-400">匯聚各行各業的獨家代表</p>
            </div>

            <div className="relative mx-auto w-full max-w-[1920px] mask-linear-gradient">
                <MarqueeRow speed={50}>{renderRow(row1)}</MarqueeRow>
                <MarqueeRow direction="right" speed={55}>{renderRow(row2)}</MarqueeRow>
                <MarqueeRow speed={60}>{renderRow(row3)}</MarqueeRow>
            </div>

            <div className="relative z-10 mt-10 text-center">
                <Link
                    to="/members"
                    className="btn-lux btn-ghost-lux inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold"
                >
                    查看所有會員
                    <ArrowRight size={16} />
                </Link>
            </div>
        </section>
    );
};

export default MemberWall;
