import React, { useState } from 'react';
import { useMembers } from '../../hooks/useMembers';
import { motion } from 'framer-motion';

const MemberThumbnail: React.FC<{ photo: string, name: string }> = ({ photo, name }) => {
    const [imgSrc, setImgSrc] = useState(photo);

    return (
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-[#c5a47e]/50 shadow-lg flex-shrink-0 mx-4 relative group cursor-pointer hover:border-[#c5a47e] transition-colors duration-300">
            <img
                src={imgSrc}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                onError={() => setImgSrc('/images/assets/logo/EverShine-logo.png')} // Fallback image
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-xs md:text-sm font-bold tracking-widest">{name}</span>
            </div>
        </div>
    );
};

const MarqueeRow: React.FC<{ children: React.ReactNode, direction?: 'left' | 'right', speed?: number }> = ({ children, direction = 'left', speed = 20 }) => {
    return (
        <div className="flex overflow-hidden py-6 select-none">
            <motion.div
                className="flex items-center"
                initial={{ x: direction === 'left' ? '0%' : '-50%' }}
                animate={{ x: direction === 'left' ? '-50%' : '0%' }}
                transition={{ repeat: Infinity, ease: "linear", duration: speed }}
            >
                {children}
                {children}
                {children}
                {children}
            </motion.div>
        </div>
    );
}

const MemberWall: React.FC = () => {
    const { members, loading } = useMembers();

    if (loading) return <div className="py-20 text-center text-gray-500">Loading Members...</div>;
    if (!members.length) return null;

    // Filter out valid members with photos first if possible, or just used all
    const validMembers = members.filter(m => m.name !== '系統管理員');

    const chunkSize = Math.ceil(validMembers.length / 3);
    const row1 = validMembers.slice(0, chunkSize);
    const row2 = validMembers.slice(chunkSize, chunkSize * 2);
    const row3 = validMembers.slice(chunkSize * 2);

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 blur-[100px] -z-10 rounded-full"></div>

            <div className="text-center mb-12 relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">我們的白金會員</h2>
                <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-3"></div>
                <p className="text-gray-400 text-lg tracking-wide">匯聚 {validMembers.length}+ 位各行各業的頂尖菁英</p>
            </div>

            <div className="relative w-full max-w-[1920px] mx-auto">
                <MarqueeRow speed={50}>
                    <div className="flex">
                        {row1.map(m => <MemberThumbnail key={m.id} photo={`/images/members/${m.name}.jpg`} name={m.name} />)}
                    </div>
                </MarqueeRow>

                <MarqueeRow direction="right" speed={55}>
                    <div className="flex">
                        {row2.map(m => <MemberThumbnail key={m.id} photo={`/images/members/${m.name}.jpg`} name={m.name} />)}
                    </div>
                </MarqueeRow>

                <MarqueeRow speed={45}>
                    <div className="flex">
                        {row3.map(m => <MemberThumbnail key={m.id} photo={`/images/members/${m.name}.jpg`} name={m.name} />)}
                    </div>
                </MarqueeRow>

                {/* Fade Mask */}
                <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-bg-dark to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-bg-dark to-transparent z-10 pointer-events-none"></div>
            </div>
        </section>
    );
};

export default MemberWall;
