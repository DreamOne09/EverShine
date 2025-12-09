import React, { useState } from 'react';
import type { Member } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Building, Briefcase, Phone, Globe, Mail } from 'lucide-react';
import clsx from 'clsx';

const MemberCard: React.FC<{ member: Member }> = ({ member }) => {
    const [expanded, setExpanded] = useState(false);
    const [imgSrc, setImgSrc] = useState(`/images/members/${member.name}.jpg`);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col h-full"
        >
            <div className={clsx(
                "bg-[rgba(6,32,58,0.6)] backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-[#c5a47e]/50 relative group flex flex-col h-full",
            )}>
                {/* Top Border Gradient */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c5a47e] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex flex-col items-center text-center flex-grow">
                    <div className="w-28 h-28 rounded-full border-2 border-[#c5a47e] p-1 mb-4 relative shrink-0">
                        <img
                            src={imgSrc}
                            alt={member.name}
                            className="w-full h-full rounded-full object-cover bg-[#06203a]"
                            onError={() => setImgSrc('/images/assets/logo/EverShine-logo.png')}
                        />
                    </div>

                    <h3 className="text-xl font-bold text-[#c5a47e] mb-1">{member.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <span className="px-3 py-1 bg-[#c5a47e]/10 rounded-full text-[#c5a47e] border border-[#c5a47e]/20 text-xs font-medium">{member.industry}</span>
                    </div>

                    <div className="text-gray-300 text-sm mb-4 line-clamp-3 min-h-[3.6em]">
                        {member.shortIntro || member.fullIntro}
                    </div>

                    <div className="mt-auto w-full">
                        <AnimatePresence>
                            {expanded && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-left text-sm text-gray-300 border-t border-white/10 pt-4 mt-2 overflow-hidden"
                                >
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-xs"><Building size={14} className="text-[#c5a47e] shrink-0" /> <span className="truncate">{member.company}</span></div>
                                        <div className="flex items-center gap-2 text-xs"><Briefcase size={14} className="text-[#c5a47e] shrink-0" /> <span className="truncate">{member.title}</span></div>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="text-[#c5a47e] text-xs uppercase tracking-wider mb-2 font-bold">個人介紹</h4>
                                        <p className="leading-relaxed text-gray-400 text-xs">{member.fullIntro}</p>
                                    </div>

                                    {member.services && member.services.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-[#c5a47e] text-xs uppercase tracking-wider mb-2 font-bold">服務項目</h4>
                                            <ul className="space-y-1 text-gray-400 text-xs">
                                                {member.services.map((s, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span className="text-[#c5a47e] mt-0.5">•</span>
                                                        <span>{s}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Social/Contact Links */}
                                    {member.links && member.links.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                                            {member.links.map((link, i) => (
                                                <a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 bg-white/5 rounded-full hover:bg-[#c5a47e] hover:text-[#06203a] transition-colors text-gray-400"
                                                    title={link.type}
                                                >
                                                    {link.icon === 'globe' ? <Globe size={16} /> :
                                                        link.icon === 'phone' ? <Phone size={16} /> :
                                                            link.icon === 'mail' ? <Mail size={16} /> : <Globe size={16} />}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={() => setExpanded(!expanded)}
                            className={clsx(
                                "w-full flex items-center justify-center py-2 mt-2 rounded-lg transition-all duration-300 text-sm font-medium",
                                expanded
                                    ? "text-[#06203a] bg-[#c5a47e]"
                                    : "text-[#c5a47e] hover:bg-[#c5a47e]/10"
                            )}
                        >
                            {expanded ? '收起' : '完整介紹'}
                            <ChevronDown
                                size={16}
                                className={clsx("ml-1 transition-transform duration-300", expanded ? "rotate-180" : "")}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MemberCard;
