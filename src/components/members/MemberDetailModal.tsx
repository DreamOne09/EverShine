import React, { useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building, Briefcase, Phone, Mail, Globe, Target, Check, Linkedin } from 'lucide-react';
import type { Member } from '../../types';
import { siteConfig } from '../../config/site.config';
import { normalizeMemberLinks } from '../../lib/memberLinks';
import { formatTaiwanPhoneDisplay, formatTaiwanPhoneTelHref } from '../../lib/phoneFormat';
import { splitIntro } from '../../lib/memberIntroSplit';
import { resolveMemberPhotoObjectPosition } from '../../lib/memberPhotoPosition';

function getPhotoUrl(photo: string) {
    if (!photo) return siteConfig.defaultPhoto;
    const clean = photo.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
    return clean.startsWith('/') ? clean : `/${clean}`;
}

const bentoMuted =
    'rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:p-5';

const bentoTextScroll =
    'min-h-0 flex-1 overflow-y-auto overscroll-contain py-0.5 pr-2 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.45)_transparent]';

const proseBody = 'whitespace-pre-wrap break-words text-sm leading-[1.65] text-slate-200 sm:text-base';

function inferLinkVisualType(type: string, url: string): string {
    const t = (type || '').toLowerCase();
    const u = (url || '').toLowerCase();
    if (t === 'facebook' || t === 'fb' || u.includes('facebook.com')) return 'facebook';
    if (t === 'instagram' || t === 'ig' || u.includes('instagram.com')) return 'instagram';
    if (t === 'linkedin' || u.includes('linkedin.com')) return 'linkedin';
    if (t === 'line' || u.includes('line.me')) return 'line';
    if (t === 'website' || t === 'globe' || /^https?:\/\//i.test(url || '')) {
        if (u.includes('facebook.com')) return 'facebook';
        if (u.includes('instagram.com')) return 'instagram';
        if (u.includes('linkedin.com')) return 'linkedin';
    }
    return t;
}

const microCell =
    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-200 transition-all hover:border-sky-400/50 hover:bg-sky-500/15 hover:text-white';

const MemberDetailModal: React.FC<{
    member: Member | null;
    open: boolean;
    onClose: () => void;
}> = ({ member, open, onClose }) => {
    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        },
        [onClose]
    );

    useEffect(() => {
        if (!open) return;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [open, onKeyDown]);

    const logoSrc = siteConfig.logos.horizontal;

    const linkIconOnly = (t: string, size = 20, url?: string) => {
        const kind = inferLinkVisualType(t, url || '');
        switch (kind) {
            case 'phone':
                return <Phone size={size} strokeWidth={2} />;
            case 'mail':
            case 'email':
                return <Mail size={size} strokeWidth={2} />;
            case 'facebook':
            case 'fb':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-[#1877F2]">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                );
            case 'instagram':
            case 'ig':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-pink-300">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                );
            case 'linkedin':
                return <Linkedin size={size} className="text-[#0A66C2]" />;
            case 'line':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-[#06C755]">
                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                );
            default:
                return <Globe size={size} className="text-sky-300" />;
        }
    };

    const contactMicroCells = useMemo(() => {
        const mem = member;
        if (!mem) return [] as React.ReactNode[];

        const links = normalizeMemberLinks(mem.links);
        const line = links.find((l) => (l.type || '').toLowerCase() === 'line');
        const ig = links.find((l) => {
            const t = (l.type || '').toLowerCase();
            return t === 'instagram' || t === 'ig';
        });

        const cells: React.ReactNode[] = [];
        if (mem.phone) {
            cells.push(
                <a key="p" href={`tel:${formatTaiwanPhoneTelHref(mem.phone)}`} className={microCell} aria-label={`電話 ${formatTaiwanPhoneDisplay(mem.phone)}`}>
                    {linkIconOnly('phone', 20)}
                </a>
            );
        }
        if (mem.email) {
            cells.push(
                <a key="e" href={`mailto:${mem.email}`} className={microCell} aria-label="Email">
                    {linkIconOnly('mail', 20)}
                </a>
            );
        }
        if (line) {
            cells.push(
                <a key="l" href={line.url} target="_blank" rel="noopener noreferrer" className={microCell} aria-label="LINE">
                    {linkIconOnly('line', 20, line.url)}
                </a>
            );
        }
        if (ig) {
            cells.push(
                <a key="i" href={ig.url} target="_blank" rel="noopener noreferrer" className={microCell} aria-label="Instagram">
                    {linkIconOnly('instagram', 20, ig.url)}
                </a>
            );
        }
        return cells;
    }, [member]);

    if (!open || !member) return null;

    const m = member;

    return createPortal(
        <AnimatePresence mode="wait">
            {open && member ? (
                <div className="fixed inset-0 z-[10050] flex items-end justify-center sm:items-center sm:p-4">
                    <motion.button
                        type="button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        aria-label="關閉"
                        onClick={onClose}
                    />
                    <motion.div
                        key={String(m.id)}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="member-detail-title"
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 8 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 flex max-h-[100dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-slate-950/90 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_32px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:max-h-[92vh] sm:rounded-2xl"
                    >
                        {/* 防偽浮水印：極低透明度 */}
                        <div
                            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl"
                            aria-hidden
                        >
                            <img
                                src={siteConfig.logos.square}
                                alt=""
                                className="max-h-[min(95vw,580px)] w-auto opacity-[0.02] grayscale contrast-125"
                            />
                        </div>

                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.08]"
                            style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59,130,246,0.12) 1px, transparent 0)`,
                                backgroundSize: '26px 26px',
                            }}
                            aria-hidden
                        />

                        {/* 品牌：右上角 LOGO h-8 opacity-80 */}
                        <div className="relative z-20 shrink-0 px-5 pb-2 pt-5 sm:px-8 sm:pt-6">
                            <h2 id="member-detail-title" className="sr-only">
                                {m.name} — 會員檔案
                            </h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute right-4 top-4 z-30 rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white sm:right-6 sm:top-5"
                                aria-label="關閉"
                            >
                                <X size={22} />
                            </button>
                            <div className="flex flex-col items-end pr-12 sm:pr-14">
                                <img
                                    src={logoSrc}
                                    alt="BNI 長輝白金分會"
                                    className="h-8 w-auto max-w-[min(72vw,260px)] object-contain object-right opacity-80 drop-shadow-[0_0_16px_rgba(59,130,246,0.25)]"
                                />
                            </div>
                        </div>

                        <div className="relative z-10 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 pb-5 pt-1 sm:px-8 sm:pb-8 sm:pt-2">
                            <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-12 lg:gap-8">
                                {/* 左欄：破格頭像 + 產業別膠囊 + 聯絡圖示 */}
                                <div className="flex w-full min-w-0 flex-col items-center lg:col-span-4 lg:items-stretch xl:col-span-3">
                                    <div className="relative flex w-full max-w-[18rem] flex-col items-center px-1 text-center lg:mx-auto">
                                        {/* 預留頭像向上偏移空間 */}
                                        <div className="flex w-full flex-col items-center pt-16 sm:pt-[4.5rem]">
                                            <div className="relative -mt-[56px] flex justify-center">
                                                <div className="relative h-32 w-32 shrink-0 rounded-full ring-2 ring-blue-500/50 ring-offset-2 ring-offset-slate-950 sm:h-36 sm:w-36">
                                                    <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-b from-blue-400/30 to-transparent blur-md" aria-hidden />
                                                    <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white/25 bg-slate-950 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
                                                        <img
                                                            src={getPhotoUrl(m.photo)}
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                            style={{ objectPosition: resolveMemberPhotoObjectPosition(m.photoPosition) }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="mt-4 line-clamp-2 w-full text-xl font-black tracking-[0.06em] text-white sm:text-2xl">
                                                {m.name}
                                            </h3>

                                            <div className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-sky-100 sm:text-sm">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-300/80">產業別</span>
                                                <span className="line-clamp-1 break-all">{m.industry || '未分類'}</span>
                                            </div>

                                            {(m.company || m.position || m.title) && (
                                                <div className="mt-3 w-full space-y-1.5 text-left text-xs leading-relaxed text-slate-400 sm:text-sm">
                                                    {m.company ? (
                                                        <p className="flex items-start gap-2">
                                                            <Building size={15} className="mt-0.5 shrink-0 text-sky-400/90" />
                                                            <span className="line-clamp-3 min-w-0">{m.company}</span>
                                                        </p>
                                                    ) : null}
                                                    {m.position || m.title ? (
                                                        <p className="flex items-start gap-2">
                                                            <Briefcase size={15} className="mt-0.5 shrink-0 text-sky-400/70" />
                                                            <span className="line-clamp-2 min-w-0">{m.position || m.title}</span>
                                                        </p>
                                                    ) : null}
                                                </div>
                                            )}

                                            {contactMicroCells.length > 0 ? (
                                                <div className="mt-5 w-full">
                                                    <p className="mb-2 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">聯絡方式</p>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {contactMicroCells}
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>

                                {/* 右欄 Bento */}
                                <div className="flex min-w-0 flex-col gap-4 lg:col-span-8 xl:col-span-9">
                                    {(() => {
                                        const { main: introMain, ideal } = splitIntro(m.fullIntro || '');
                                        const displayIntro =
                                            introMain || m.shortIntro || m.fullIntro?.replace(/\\n/g, '\n') || '';
                                        const services = (m.services || []).filter((s) => s && s.trim());

                                        return (
                                            <>
                                                <div
                                                    className={
                                                        ideal
                                                            ? 'grid gap-4 lg:grid-cols-2 lg:gap-5'
                                                            : 'flex flex-col gap-4'
                                                    }
                                                >
                                                    <section className={`${bentoMuted} flex min-w-0 flex-col`}>
                                                        <h3 className="mb-2 shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400 sm:text-xs">
                                                            關於我
                                                        </h3>
                                                        <div className={`${bentoTextScroll} max-h-[min(50vh,22rem)]`}>
                                                            <p className={proseBody}>{displayIntro || '—'}</p>
                                                        </div>
                                                    </section>

                                                    {ideal ? (
                                                        <section className="relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-sky-500/10 via-cyan-500/5 to-blue-500/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-5">
                                                            <h3 className="mb-2 flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100 sm:text-sm">
                                                                <Target className="shrink-0 text-cyan-300" size={18} aria-hidden />
                                                                理想引薦對象
                                                            </h3>
                                                            <div className={`${bentoTextScroll} max-h-[min(50vh,22rem)]`}>
                                                                <p className={`${proseBody} text-slate-100`}>{ideal}</p>
                                                            </div>
                                                        </section>
                                                    ) : null}
                                                </div>

                                                {services.length > 0 ? (
                                                    <section className={`${bentoMuted} relative min-h-0 min-w-0 overflow-hidden`}>
                                                        <div
                                                            className="pointer-events-none absolute inset-0 opacity-[0.15]"
                                                            style={{
                                                                backgroundImage:
                                                                    'repeating-linear-gradient(-32deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 10px)',
                                                            }}
                                                            aria-hidden
                                                        />
                                                        <div className="relative z-10">
                                                            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400 sm:text-xs">
                                                                服務項目
                                                            </h3>
                                                            <ul className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                                                                {services.map((s, i) => (
                                                                    <li
                                                                        key={i}
                                                                        className="flex items-start gap-1.5 text-xs leading-snug text-slate-200 sm:text-sm"
                                                                    >
                                                                        <Check className="mt-0.5 shrink-0 text-cyan-400" size={14} strokeWidth={2.5} />
                                                                        <span className="line-clamp-4 min-w-0 break-words">{s}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </section>
                                                ) : null}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 shrink-0 border-t border-white/10 bg-slate-950/95 p-3 sm:hidden">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 py-3 text-sm font-bold tracking-wide text-white"
                            >
                                關閉
                            </button>
                        </div>
                    </motion.div>
                </div>
            ) : null}
        </AnimatePresence>,
        document.body
    );
};

export default MemberDetailModal;
