import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building, Briefcase, Phone, Mail, Globe, Target, Check } from 'lucide-react';
import type { Member } from '../../types';
import { siteConfig } from '../../config/site.config';
import { normalizeMemberLinks } from '../../lib/memberLinks';
import { formatTaiwanPhoneDisplay, formatTaiwanPhoneTelHref } from '../../lib/phoneFormat';

function getPhotoUrl(photo: string) {
    if (!photo) return siteConfig.defaultPhoto;
    const clean = photo.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
    return clean.startsWith('/') ? clean : `/${clean}`;
}

function splitIntro(fullIntro: string): { main: string; ideal: string | null } {
    if (!fullIntro) return { main: '', ideal: null };
    const text = fullIntro.replace(/\\n/g, '\n');
    const markers = ['【理想引薦對象】', '【理想引薦】', '理想引薦對象：', '理想引薦對象'];
    let cut = -1;
    let markerLen = 0;
    for (const m of markers) {
        const i = text.indexOf(m);
        if (i !== -1 && (cut === -1 || i < cut)) {
            cut = i;
            markerLen = m.length;
        }
    }
    if (cut === -1) return { main: text.trim(), ideal: null };
    const main = text.slice(0, cut).trim();
    let ideal = text.slice(cut + markerLen).trim();
    const nextSection = ideal.search(/\n【[^】]+】/);
    if (nextSection !== -1) ideal = ideal.slice(0, nextSection).trim();
    return { main: main || text.trim(), ideal: ideal || null };
}

const actionBtnClass =
    'flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3.5 text-sm font-semibold tracking-wide text-white shadow-inner shadow-black/20 transition-all hover:border-[#3b82f6]/50 hover:bg-[#3b82f6]/15 hover:text-sky-100';

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

    const linkIcon = (t: string) => {
        switch (t.toLowerCase()) {
            case 'phone':
                return <Phone size={20} />;
            case 'mail':
            case 'email':
                return <Mail size={20} />;
            case 'facebook':
            case 'fb':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                );
            case 'instagram':
            case 'ig':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                );
            case 'line':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                );
            default:
                return <Globe size={20} />;
        }
    };

    const renderVerticalLink = (link: { type: string; url: string }) => {
        const t = (link.type || '').toLowerCase();
        const label =
            t === 'line'
                ? 'LINE'
                : t === 'instagram' || t === 'ig'
                  ? 'Instagram'
                  : t === 'facebook' || t === 'fb'
                    ? 'Facebook'
                    : t === 'website' || t === 'globe'
                      ? '官方網站'
                      : t === 'phone'
                        ? '電話'
                        : t === 'mail' || t === 'email'
                          ? 'Email'
                          : link.type;

        const href = t === 'phone' ? `tel:${formatTaiwanPhoneTelHref(link.url)}` : link.url;
        const isTel = t === 'phone';

        return (
            <a
                key={`${link.type}-${link.url}`}
                href={href}
                {...(!isTel ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={actionBtnClass}
            >
                {linkIcon(t)}
                {label}
            </a>
        );
    };

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
                        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
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
                        className="relative z-10 flex max-h-[100dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-slate-950/90 shadow-2xl shadow-blue-950/50 backdrop-blur-2xl sm:max-h-[92vh] sm:rounded-2xl"
                    >
            {/* 背景浮水印 LOGO */}
            <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl"
                aria-hidden
            >
                <img
                    src={siteConfig.logos.square}
                    alt=""
                    className="max-h-[min(85vw,520px)] w-auto opacity-[0.03] grayscale contrast-125"
                />
            </div>

            {/* 細網格紋理 */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.12]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59,130,246,0.15) 1px, transparent 0)`,
                    backgroundSize: '24px 24px',
                }}
                aria-hidden
            />

            {/* 右上角分會 LOGO */}
            <div className="pointer-events-none absolute right-14 top-3 z-20 hidden h-8 opacity-80 sm:block">
                <img src={logoSrc} alt="BNI 長輝白金分會" className="h-8 w-auto object-contain object-right" />
            </div>

            <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
                <h2 id="member-detail-title" className="truncate pr-16 text-base font-bold tracking-wider text-white sm:text-lg">
                    會員檔案
                </h2>
                <button
                    type="button"
                    onClick={onClose}
                    className="shrink-0 rounded-xl p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="關閉"
                >
                    <X size={22} />
                </button>
            </div>

            <div className="relative z-10 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 pb-5 pt-2 sm:px-8 sm:pb-6 sm:pt-3">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-8">
                    {/* 左欄 Identity — 頭像破格向上「半衝出」內容區頂線 */}
                    <div className="flex flex-col items-center pt-6 text-center sm:pt-8 lg:items-center">
                        <div className="relative -mt-14 mb-1 flex w-full justify-center sm:-mt-16">
                            <div className="relative h-44 w-44 shrink-0 sm:h-52 sm:w-52">
                                <div className="absolute -inset-1 rounded-full bg-gradient-to-b from-[#3b82f6]/25 to-transparent blur-md" aria-hidden />
                                {/* 4px 深色外圈 + 1px 亮藍內圈（立體懸浮） */}
                                <div className="relative rounded-full border-[4px] border-slate-950 bg-slate-950 shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
                                    <div className="relative h-full w-full overflow-hidden rounded-full border border-[#3b82f6] ring-1 ring-white/10">
                                        <img
                                            src={getPhotoUrl(m.photo)}
                                            alt=""
                                            className="h-full w-full object-cover"
                                            style={{ objectPosition: m.photoPosition || 'center top' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 className="mb-2 line-clamp-2 text-2xl font-black tracking-[0.2em] text-white sm:text-3xl">{m.name}</h3>

                        {/* 工職／產業：金屬漸層 + 亮色邊 */}
                        <div
                            className={`mb-2 w-full max-w-xs rounded-full border border-white/25 bg-gradient-to-r from-slate-600/50 via-slate-400/25 to-slate-700/50 px-4 py-2 text-center text-xs font-semibold tracking-wide text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_6px_20px_rgba(0,0,0,0.35)] sm:text-sm ${!(m.company || m.position || m.title) ? 'mb-6' : ''}`}
                        >
                            工職：{m.industry || '未分類'}
                        </div>

                        {(m.company || m.position || m.title) && (
                            <div className="mb-6 w-full max-w-xs space-y-0.5 text-xs leading-tight tracking-wide text-slate-400">
                                {m.company ? (
                                    <p className="flex items-center justify-center gap-2">
                                        <Building size={14} className="shrink-0 text-[#3b82f6]/90" />
                                        <span className="line-clamp-2">{m.company}</span>
                                    </p>
                                ) : null}
                                {(m.position || m.title) ? (
                                    <p className="flex items-center justify-center gap-2">
                                        <Briefcase size={14} className="shrink-0 text-[#3b82f6]/70" />
                                        <span className="line-clamp-2">{m.position || m.title}</span>
                                    </p>
                                ) : null}
                            </div>
                        )}

                        <div className="mt-auto flex w-full max-w-xs flex-col gap-2">
                            {m.phone && (
                                <a
                                    href={`tel:${formatTaiwanPhoneTelHref(m.phone)}`}
                                    className={`${actionBtnClass} flex-col gap-1 py-3.5 sm:flex-row sm:gap-2`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Phone size={20} />
                                        Phone
                                    </span>
                                    <span className="text-xs font-normal tabular-nums text-slate-400">
                                        {formatTaiwanPhoneDisplay(m.phone)}
                                    </span>
                                </a>
                            )}
                            {m.email && (
                                <a href={`mailto:${m.email}`} className={actionBtnClass}>
                                    <Mail size={20} />
                                    Email
                                </a>
                            )}
                            {normalizeMemberLinks(m.links)
                                .filter((l) => !['mail', 'email', 'phone'].includes((l.type || '').toLowerCase()))
                                .map(renderVerticalLink)}
                        </div>
                    </div>

                    {/* 右欄 Bento */}
                    <div className="flex flex-col gap-4">
                        {(() => {
                            const { main: introMain, ideal } = splitIntro(m.fullIntro || '');
                            const displayIntro =
                                introMain || m.shortIntro || m.fullIntro?.replace(/\\n/g, '\n') || '';
                            const services = (m.services || []).filter((s) => s && s.trim());

                            return (
                                <>
                                    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md sm:p-5">
                                        <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#3b82f6]">關於我</h3>
                                        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">{displayIntro}</p>
                                    </section>

                                    {ideal && (
                                        <section className="rounded-2xl bg-gradient-to-br from-[#3b82f6] via-purple-500 to-emerald-400 p-[1px] shadow-[0_0_36px_rgba(59,130,246,0.18)]">
                                            <div className="rounded-[15px] bg-slate-950/96 p-4 backdrop-blur-md sm:p-5">
                                                <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-100">
                                                    <Target className="shrink-0 text-[#3b82f6] animate-pulse" size={18} aria-hidden />
                                                    理想引薦對象
                                                </h3>
                                                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-100">{ideal}</p>
                                            </div>
                                        </section>
                                    )}

                                    {services.length > 0 && (
                                        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md sm:p-5">
                                            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fbbf24]">服務項目</h3>
                                            <ul className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                                                {services.map((s, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-slate-300">
                                                        <Check className="mt-0.5 shrink-0 text-[#3b82f6]" size={16} strokeWidth={2.5} />
                                                        <span>{s}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    )}
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
                                className="w-full rounded-xl bg-gradient-to-r from-[#3b82f6] to-blue-600 py-3 text-sm font-bold tracking-wide text-white"
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
