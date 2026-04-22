import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building, Briefcase, Phone, Mail, Globe, Target, Check } from 'lucide-react';
import type { Member } from '../../types';
import { siteConfig } from '../../config/site.config';
import { normalizeMemberLinks } from '../../lib/memberLinks';
import { formatTaiwanPhoneDisplay, formatTaiwanPhoneTelHref } from '../../lib/phoneFormat';
import { splitIntro } from '../../lib/memberIntroSplit';

function getPhotoUrl(photo: string) {
    if (!photo) return siteConfig.defaultPhoto;
    const clean = photo.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
    return clean.startsWith('/') ? clean : `/${clean}`;
}

const bentoPanel =
    'rounded-2xl border border-white/[0.11] bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-5';

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

    const linkIcon = (t: string, size = 18) => {
        switch (t.toLowerCase()) {
            case 'phone':
                return <Phone size={size} />;
            case 'mail':
            case 'email':
                return <Mail size={size} />;
            case 'facebook':
            case 'fb':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                );
            case 'instagram':
            case 'ig':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                );
            case 'line':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                );
            default:
                return <Globe size={size} />;
        }
    };

    const contactDockClass =
        'flex flex-col items-center gap-1 rounded-xl border border-white/[0.12] bg-black/35 px-2 py-2.5 text-[11px] font-medium tracking-wide text-slate-200 shadow-inner shadow-black/30 transition-all hover:border-sky-400/40 hover:bg-white/[0.06] hover:text-white sm:text-xs';

    const renderDockLink = (link: { type: string; url: string }) => {
        const t = (link.type || '').toLowerCase();
        const label =
            t === 'line'
                ? 'LINE'
                : t === 'instagram' || t === 'ig'
                  ? 'IG'
                  : t === 'facebook' || t === 'fb'
                    ? 'FB'
                    : t === 'website' || t === 'globe'
                      ? '網站'
                      : t === 'phone'
                        ? '電話'
                        : t === 'mail' || t === 'email'
                          ? '信箱'
                          : link.type;

        const href = t === 'phone' ? `tel:${formatTaiwanPhoneTelHref(link.url)}` : link.url;
        const isTel = t === 'phone';

        return (
            <a
                key={`${link.type}-${link.url}`}
                href={href}
                {...(!isTel ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={contactDockClass}
            >
                {linkIcon(t, 18)}
                <span className="max-w-[4.5rem] truncate">{label}</span>
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
                        className="member-card-neon-breathe relative z-10 flex max-h-[100dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl border border-white/[0.14] bg-slate-950/88 shadow-2xl shadow-blue-950/45 backdrop-blur-2xl sm:max-h-[92vh] sm:rounded-2xl"
                    >
                        {/* 背景浮水印 LOGO — 略放大以利「分會榮譽感」 */}
                        <div
                            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl"
                            aria-hidden
                        >
                            <img
                                src={siteConfig.logos.square}
                                alt=""
                                className="max-h-[min(92vw,560px)] w-auto opacity-[0.045] grayscale contrast-125"
                            />
                        </div>

                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.1]"
                            style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59,130,246,0.14) 1px, transparent 0)`,
                                backgroundSize: '24px 24px',
                            }}
                            aria-hidden
                        />

                        {/* 頂列：長輝分會標誌（右上）+ 浮動關閉 */}
                        <div className="relative z-20 shrink-0 px-3 pb-1 pt-3 sm:px-6 sm:pt-4">
                            <h2 id="member-detail-title" className="sr-only">
                                {m.name} — 會員檔案
                            </h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute right-2 top-2 z-30 rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white sm:right-4 sm:top-3"
                                aria-label="關閉"
                            >
                                <X size={22} />
                            </button>
                            <div className="flex flex-col items-end gap-1 pr-11 sm:pr-12">
                                <img
                                    src={logoSrc}
                                    alt="BNI 長輝白金分會"
                                    className="h-12 w-auto max-w-[min(78vw,300px)] object-contain object-right drop-shadow-[0_0_24px_rgba(59,130,246,0.28)] sm:h-[3.75rem]"
                                />
                                <span className="text-[11px] font-semibold tracking-[0.32em] text-slate-400 sm:text-xs">
                                    長輝白金分會
                                </span>
                            </div>
                        </div>

                        <div className="relative z-10 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 pb-4 pt-0 sm:px-6 sm:pb-6 sm:pt-1">
                            <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-12 lg:gap-4 lg:pt-2">
                                {/* 左欄：頭像破格 + 身分 + Bento 聯絡塢 */}
                                <div className="flex flex-col items-center lg:col-span-4 lg:items-stretch">
                                    <div className="relative z-10 flex w-full flex-col items-center text-center lg:items-center">
                                        <div className="relative -mt-16 mb-2 flex w-full justify-center sm:-mt-[4.5rem] lg:-mt-20">
                                            <div className="relative h-40 w-40 shrink-0 sm:h-48 sm:w-48">
                                                <div
                                                    className="absolute -inset-1 rounded-full bg-gradient-to-b from-[#3b82f6]/30 to-transparent blur-md"
                                                    aria-hidden
                                                />
                                                <div className="relative rounded-full border-[4px] border-slate-950 bg-slate-950 shadow-[0_28px_70px_rgba(0,0,0,0.6)]">
                                                    <div className="relative h-full w-full overflow-hidden rounded-full border border-[#38bdf8] ring-1 ring-white/15">
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

                                        <h3 className="mb-2 line-clamp-2 text-2xl font-black tracking-[0.2em] text-white sm:text-3xl">
                                            {m.name}
                                        </h3>

                                        <div
                                            className={`mb-3 w-full max-w-sm rounded-full border border-amber-200/30 bg-gradient-to-r from-amber-900/40 via-slate-600/50 to-amber-950/35 px-4 py-2 text-center text-sm font-semibold tracking-wide text-amber-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] sm:text-base ${!(m.company || m.position || m.title) ? 'mb-5' : ''}`}
                                        >
                                            工職：{m.industry || '未分類'}
                                        </div>

                                        {(m.company || m.position || m.title) && (
                                            <div className="mb-5 w-full max-w-sm space-y-1 text-sm leading-snug tracking-wide text-slate-400 sm:text-base">
                                                {m.company ? (
                                                    <p className="flex items-start justify-center gap-2 lg:justify-start">
                                                        <Building size={16} className="mt-0.5 shrink-0 text-sky-400/90" />
                                                        <span className="line-clamp-3 text-left">{m.company}</span>
                                                    </p>
                                                ) : null}
                                                {m.position || m.title ? (
                                                    <p className="flex items-start justify-center gap-2 lg:justify-start">
                                                        <Briefcase size={16} className="mt-0.5 shrink-0 text-sky-400/70" />
                                                        <span className="line-clamp-2 text-left">{m.position || m.title}</span>
                                                    </p>
                                                ) : null}
                                            </div>
                                        )}

                                        <div className="mt-auto w-full max-w-sm">
                                            <p className="mb-2 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                                                聯絡方式
                                            </p>
                                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                                                {m.phone ? (
                                                    <a
                                                        href={`tel:${formatTaiwanPhoneTelHref(m.phone)}`}
                                                        className={contactDockClass}
                                                    >
                                                        {linkIcon('phone', 18)}
                                                        <span className="tabular-nums text-[10px] text-slate-400 sm:text-[11px]">
                                                            {formatTaiwanPhoneDisplay(m.phone)}
                                                        </span>
                                                    </a>
                                                ) : null}
                                                {m.email ? (
                                                    <a href={`mailto:${m.email}`} className={contactDockClass}>
                                                        {linkIcon('mail', 18)}
                                                        <span className="max-w-full truncate text-[10px] text-slate-400 sm:text-[11px]">
                                                            Email
                                                        </span>
                                                    </a>
                                                ) : null}
                                                {normalizeMemberLinks(m.links)
                                                    .filter((l) => !['mail', 'email', 'phone'].includes((l.type || '').toLowerCase()))
                                                    .map(renderDockLink)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 右欄：Bento — 關於我 / 理想引薦 / 服務 不等高色塊 */}
                                <div className="flex flex-col gap-3 lg:col-span-8">
                                    {(() => {
                                        const { main: introMain, ideal } = splitIntro(m.fullIntro || '');
                                        const displayIntro =
                                            introMain || m.shortIntro || m.fullIntro?.replace(/\\n/g, '\n') || '';
                                        const services = (m.services || []).filter((s) => s && s.trim());

                                        return (
                                            <div className="grid auto-rows-min gap-3 lg:grid-cols-12">
                                                <section className={ideal ? `${bentoPanel} lg:col-span-7` : `${bentoPanel} lg:col-span-12`}>
                                                    <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-sky-400 sm:text-sm">
                                                        個人介紹
                                                    </h3>
                                                    <p className="whitespace-pre-line text-base leading-relaxed text-slate-200 sm:text-lg">
                                                        {displayIntro || '—'}
                                                    </p>
                                                </section>

                                                {ideal ? (
                                                    <section className="rounded-2xl bg-gradient-to-br from-amber-400 via-[#3b82f6] to-emerald-400 p-[1px] shadow-[0_0_40px_rgba(59,130,246,0.2)] lg:col-span-5">
                                                        <div className={`h-full rounded-[15px] bg-slate-950/96 p-4 backdrop-blur-xl sm:p-5`}>
                                                            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-amber-100 sm:text-base">
                                                                <Target
                                                                    className="shrink-0 text-sky-300 animate-pulse"
                                                                    size={20}
                                                                    aria-hidden
                                                                />
                                                                理想引薦對象
                                                            </h3>
                                                            <p className="whitespace-pre-line text-base leading-relaxed text-slate-100 sm:text-lg">
                                                                {ideal}
                                                            </p>
                                                        </div>
                                                    </section>
                                                ) : null}

                                                {services.length > 0 ? (
                                                    <section className={`${bentoPanel} relative overflow-hidden lg:col-span-12`}>
                                                        <div
                                                            className="pointer-events-none absolute inset-0 opacity-[0.22]"
                                                            style={{
                                                                backgroundImage:
                                                                    'repeating-linear-gradient(-32deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 9px)',
                                                            }}
                                                            aria-hidden
                                                        />
                                                        <div className="relative z-10">
                                                            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-200/90 sm:text-sm">
                                                                服務項目
                                                            </h3>
                                                            <ul className="grid grid-cols-1 gap-x-5 gap-y-2.5 sm:grid-cols-2">
                                                                {services.map((s, i) => (
                                                                    <li
                                                                        key={i}
                                                                        className="flex items-start gap-2.5 text-base leading-relaxed text-slate-200 sm:text-lg"
                                                                    >
                                                                        <Check
                                                                            className="mt-0.5 shrink-0 text-sky-400"
                                                                            size={18}
                                                                            strokeWidth={2.5}
                                                                        />
                                                                        <span>{s}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </section>
                                                ) : null}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 shrink-0 border-t border-white/10 bg-slate-950/95 p-3 sm:hidden">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full rounded-xl bg-gradient-to-r from-[#3b82f6] to-blue-600 py-3 text-base font-bold tracking-wide text-white"
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
