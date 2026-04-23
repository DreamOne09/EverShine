import React, { useEffect, useCallback } from 'react';
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

const bentoPanel =
    'rounded-2xl border border-white/[0.11] bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-5';

/** 長文區：在父層已限制高度時用 flex-1 + min-h-0 捲動，避免穿透下方區塊 */
const bentoTextScroll =
    'min-h-0 flex-1 overflow-y-auto overscroll-contain py-0.5 pr-2 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.5)_transparent]';

const proseTight = 'whitespace-pre-wrap break-words text-sm leading-[1.65] text-slate-200 sm:text-base';

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

    const linkIcon = (t: string, size = 18, url?: string) => {
        const kind = inferLinkVisualType(t, url || '');
        switch (kind) {
            case 'phone':
                return <Phone size={size} />;
            case 'mail':
            case 'email':
                return <Mail size={size} />;
            case 'facebook':
            case 'fb':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-[#1877F2]">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                );
            case 'instagram':
            case 'ig':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-pink-300">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                );
            case 'linkedin':
                return <Linkedin size={size} className="shrink-0 text-[#0A66C2]" />;
            case 'line':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                );
            default:
                return <Globe size={size} className="text-sky-300/90" />;
        }
    };

    const contactDockClass =
        'flex min-h-[4.5rem] min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-white/[0.12] bg-black/35 px-1.5 py-2 text-[10px] font-medium tracking-wide text-slate-200 shadow-inner shadow-black/30 transition-all hover:border-sky-400/40 hover:bg-white/[0.06] hover:text-white sm:px-2 sm:text-xs';

    const renderDockLink = (link: { type: string; url: string }) => {
        const t = (link.type || '').toLowerCase();
        const vis = inferLinkVisualType(link.type, link.url);
        const label =
            vis === 'line'
                ? 'LINE'
                : vis === 'instagram' || vis === 'ig'
                  ? 'IG'
                  : vis === 'facebook' || vis === 'fb'
                    ? 'Facebook'
                    : vis === 'linkedin'
                      ? 'LinkedIn'
                      : vis === 'website' || vis === 'globe'
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
                {linkIcon(link.type, 18, link.url)}
                <span className="max-w-full truncate px-0.5 text-center">{label}</span>
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
                        className="relative z-10 flex max-h-[100dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl border border-white/[0.14] bg-slate-950/88 shadow-2xl shadow-blue-950/45 backdrop-blur-2xl sm:max-h-[92vh] sm:rounded-2xl"
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

                        {/* 頂列：預留右側給關閉鈕，避免 Logo 被裁切 */}
                        <div className="relative z-20 shrink-0 px-4 pb-2 pt-4 sm:px-7 sm:pb-3 sm:pt-5">
                            <h2 id="member-detail-title" className="sr-only">
                                {m.name} — 會員檔案
                            </h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute right-3 top-3 z-30 rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white sm:right-5 sm:top-4"
                                aria-label="關閉"
                            >
                                <X size={22} />
                            </button>
                            <div className="flex flex-col items-end gap-1.5 pr-14 sm:pr-16">
                                <img
                                    src={logoSrc}
                                    alt="BNI 長輝白金分會"
                                    className="h-11 w-auto max-w-[min(70vw,280px)] object-contain object-right contrast-[1.08] drop-shadow-[0_0_20px_rgba(59,130,246,0.35)] sm:h-[3.25rem] sm:max-w-[min(65vw,320px)]"
                                />
                                <span className="text-[11px] font-semibold tracking-[0.28em] text-slate-300 sm:text-xs">
                                    長輝白金分會
                                </span>
                            </div>
                        </div>

                        <div className="relative z-10 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 pb-4 pt-2 sm:px-6 sm:pb-6 sm:pt-3">
                            <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-12 lg:gap-6 lg:pt-1">
                                {/* 左欄：大螢幕 sticky，長文捲動時身分區仍固定可見 */}
                                <div className="flex w-full min-w-0 flex-col items-center lg:sticky lg:top-2 lg:col-span-4 lg:self-start lg:px-1">
                                    <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center lg:mx-auto lg:items-center">
                                        {/* 頭像獨立區塊：姓名在圓形下方，避免與照片重疊、裁切頭頂 */}
                                        <div className="flex w-full flex-col items-center pt-2">
                                            <div className="relative flex justify-center">
                                                <div className="relative h-[8.5rem] w-[8.5rem] shrink-0 sm:h-40 sm:w-40 lg:h-44 lg:w-44">
                                                    <div
                                                        className="absolute -inset-1 rounded-full bg-gradient-to-b from-[#3b82f6]/28 to-transparent blur-md"
                                                        aria-hidden
                                                    />
                                                    <div className="relative rounded-full border-[4px] border-slate-950 bg-slate-950 shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
                                                        <div className="relative aspect-square w-full overflow-hidden rounded-full border border-[#38bdf8] ring-1 ring-white/15">
                                                            <img
                                                                src={getPhotoUrl(m.photo)}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                                style={{
                                                                    objectPosition: resolveMemberPhotoObjectPosition(m.photoPosition),
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="mt-5 w-full break-words px-1 text-xl font-black tracking-[0.06em] text-white sm:mt-6 sm:text-2xl sm:tracking-[0.1em] lg:text-3xl">
                                                {m.name}
                                            </h3>
                                        </div>

                                        <div
                                            className={`mt-5 w-full rounded-2xl border border-amber-200/35 bg-gradient-to-r from-amber-900/45 via-slate-600/50 to-amber-950/40 px-4 py-3 text-center text-sm font-semibold leading-snug tracking-wide text-amber-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] sm:px-5 sm:text-base ${!(m.company || m.position || m.title) ? 'mb-4' : ''}`}
                                        >
                                            <span className="block break-words">
                                                產業別：{m.industry || '未分類'}
                                            </span>
                                        </div>

                                        {(m.company || m.position || m.title) && (
                                            <div className="mb-5 mt-1 w-full space-y-2.5 text-sm leading-relaxed tracking-wide text-slate-400 sm:text-base">
                                                {m.company ? (
                                                    <p className="flex items-start justify-center gap-2 text-left lg:justify-start">
                                                        <Building size={16} className="mt-0.5 shrink-0 text-sky-400/90" />
                                                        <span className="min-w-0 flex-1 break-words">{m.company}</span>
                                                    </p>
                                                ) : null}
                                                {m.position || m.title ? (
                                                    <p className="flex items-start justify-center gap-2 text-left lg:justify-start">
                                                        <Briefcase size={16} className="mt-0.5 shrink-0 text-sky-400/70" />
                                                        <span className="min-w-0 flex-1 break-words">{m.position || m.title}</span>
                                                    </p>
                                                ) : null}
                                            </div>
                                        )}

                                        <div className="mt-2 w-full pb-1 lg:mt-3">
                                            <p className="mb-2.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 lg:text-left">
                                                聯絡方式
                                            </p>
                                            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-2">
                                                {m.phone ? (
                                                    <a
                                                        href={`tel:${formatTaiwanPhoneTelHref(m.phone)}`}
                                                        className={contactDockClass}
                                                    >
                                                        {linkIcon('phone', 18)}
                                                        <span className="w-full break-all text-center tabular-nums text-[10px] leading-tight text-slate-400 sm:text-[11px]">
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

                                {/* 右欄：Bento — 個人介紹與理想引薦並排同高；長文區內捲動 */}
                                <div className="flex min-w-0 flex-col gap-4 lg:col-span-8">
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
                                                            ? 'flex min-h-0 flex-col gap-3 lg:max-h-[min(52vh,28rem)] lg:flex-row lg:items-stretch lg:gap-5'
                                                            : 'flex min-h-0 flex-col gap-3'
                                                    }
                                                >
                                                    <section
                                                        className={
                                                            ideal
                                                                ? `${bentoPanel} flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:min-h-[12rem] lg:basis-[58%]`
                                                                : `${bentoPanel} flex min-h-0 min-w-0 flex-col overflow-hidden`
                                                        }
                                                    >
                                                        <h3 className="mb-2.5 shrink-0 text-xs font-bold uppercase tracking-[0.22em] text-sky-400 sm:text-sm">
                                                            個人介紹
                                                        </h3>
                                                        <div className={ideal ? `${bentoTextScroll} min-h-[8rem]` : `${bentoTextScroll} max-h-[min(55vh,24rem)]`}>
                                                            <p className={proseTight}>{displayIntro || '—'}</p>
                                                        </div>
                                                    </section>

                                                    {ideal ? (
                                                        <section className="flex min-h-0 min-w-0 flex-1 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-[#3b82f6] to-emerald-400 p-[1px] shadow-[0_0_40px_rgba(59,130,246,0.2)] lg:min-h-[12rem] lg:basis-[42%]">
                                                            <div className="flex h-full min-h-0 min-w-0 flex-col rounded-[15px] bg-slate-950/96 p-4 backdrop-blur-xl sm:p-5">
                                                                <h3 className="mb-2.5 flex shrink-0 items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-amber-100 sm:text-base">
                                                                    <Target
                                                                        className="shrink-0 text-sky-300 animate-pulse"
                                                                        size={20}
                                                                        aria-hidden
                                                                    />
                                                                    理想引薦對象
                                                                </h3>
                                                                <div className={`${bentoTextScroll} min-h-[6rem]`}>
                                                                    <p className={`${proseTight} text-slate-100`}>{ideal}</p>
                                                                </div>
                                                            </div>
                                                        </section>
                                                    ) : null}
                                                </div>

                                                {services.length > 0 ? (
                                                    <section className={`${bentoPanel} relative min-h-0 min-w-0 overflow-hidden`}>
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
                                                            <ul className="grid max-h-[min(42vh,17rem)] grid-cols-1 gap-x-6 gap-y-2 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin] sm:max-h-[min(48vh,20rem)] sm:grid-cols-2 lg:max-h-[min(40vh,18rem)]">
                                                                {services.map((s, i) => (
                                                                    <li
                                                                        key={i}
                                                                        className="flex items-start gap-2.5 text-sm leading-[1.65] text-slate-200 sm:text-base"
                                                                    >
                                                                        <Check
                                                                            className="mt-0.5 shrink-0 text-sky-400"
                                                                            size={18}
                                                                            strokeWidth={2.5}
                                                                        />
                                                                        <span className="min-w-0 break-words">{s}</span>
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
