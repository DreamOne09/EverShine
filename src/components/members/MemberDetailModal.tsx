import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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

/** 從 fullIntro 拆出「主要介紹」與「理想引薦對象」區塊（常見 BNI 格式） */
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

const linkButtonClass =
    'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/20 hover:border-primary/40';

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

    if (!open || !member) return null;

    const photoSrc = getPhotoUrl(member.photo);
    const links = normalizeMemberLinks(member.links);
    const { main: introMain, ideal } = splitIntro(member.fullIntro || '');
    const displayIntro = introMain || member.shortIntro || member.fullIntro?.replace(/\\n/g, '\n') || '';
    const phoneDisplay = member.phone ? formatTaiwanPhoneDisplay(member.phone) : '';
    const phoneHref = member.phone ? formatTaiwanPhoneTelHref(member.phone) : '';

    const linkIcon = (t: string) => {
        switch (t) {
            case 'phone':
                return <Phone size={18} />;
            case 'mail':
            case 'email':
                return <Mail size={18} />;
            case 'facebook':
            case 'fb':
                return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                );
            case 'instagram':
            case 'ig':
                return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                );
            case 'line':
                return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                );
            default:
                return <Globe size={18} />;
        }
    };

    const renderLinkButton = (link: { type: string; url: string }) => {
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
                        ? '電話連結'
                        : t === 'mail' || t === 'email'
                          ? 'Email 連結'
                          : (link.type || '連結').charAt(0).toUpperCase() + (link.type || '').slice(1);

        const href = t === 'phone' ? `tel:${formatTaiwanPhoneTelHref(link.url)}` : link.url;
        const isTel = t === 'phone';

        return (
            <a
                key={`${link.type}-${link.url}`}
                href={href}
                {...(!isTel ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={linkButtonClass}
            >
                {linkIcon(t)}
                {label}
            </a>
        );
    };

    const modal = (
        <div
            className="fixed inset-0 z-[10050] flex items-end justify-center sm:items-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-detail-title"
        >
            <button
                type="button"
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                aria-label="關閉"
                onClick={onClose}
            />
            <div className="relative flex max-h-[100dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-[#0B1120]/95 shadow-2xl sm:max-h-[90vh] sm:rounded-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
                    <h2 id="member-detail-title" className="truncate pr-4 text-lg font-bold text-white sm:text-xl">
                        {member.name}
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

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-8">
                    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
                        {/* 左欄：頭像 + 基本資料 + 聯絡按鈕 */}
                        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                            <div className="mb-6 h-40 w-40 shrink-0 overflow-hidden rounded-full border-2 border-white/15 ring-1 ring-white/10">
                                <img
                                    src={photoSrc}
                                    alt=""
                                    className="h-full w-full object-cover"
                                    style={{ objectPosition: member.photoPosition || 'center top' }}
                                />
                            </div>
                            <span className="mb-3 inline-flex max-w-full items-center rounded-xl border border-primary/40 bg-primary/25 px-4 py-2 text-sm font-bold tracking-wide text-sky-100">
                                {member.industry || '未分類'}
                            </span>
                            <p className="mb-1 text-2xl font-bold text-white">{member.name}</p>
                            {member.company && (
                                <p className="mb-2 flex items-center justify-center gap-2 text-sm text-gray-400 lg:justify-start">
                                    <Building size={16} className="shrink-0 text-primary" />
                                    <span>{member.company}</span>
                                </p>
                            )}
                            {member.title && (
                                <p className="mb-6 flex items-center justify-center gap-2 text-sm text-gray-400 lg:justify-start">
                                    <Briefcase size={16} className="shrink-0 text-primary" />
                                    <span>{member.title}</span>
                                </p>
                            )}

                            <div className="mt-auto w-full max-w-sm space-y-2 lg:max-w-none">
                                {phoneDisplay && phoneHref && (
                                    <a href={`tel:${phoneHref}`} className={linkButtonClass}>
                                        <Phone size={18} />
                                        電話 {phoneDisplay}
                                    </a>
                                )}
                                {member.email && (
                                    <a href={`mailto:${member.email}`} className={linkButtonClass}>
                                        <Mail size={18} />
                                        Email
                                    </a>
                                )}
                                {links.map(renderLinkButton)}
                            </div>
                        </div>

                        {/* 右欄：介紹 + 理想引薦 + 服務 */}
                        <div className="space-y-6 leading-relaxed text-gray-300">
                            <section>
                                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">個人介紹</h3>
                                <p className="whitespace-pre-line text-sm sm:text-base">{displayIntro}</p>
                            </section>

                            {ideal && (
                                <section className="rounded-xl border border-white/10 bg-slate-800/50 p-4 sm:p-5">
                                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-sky-200">
                                        <Target size={18} className="text-primary" />
                                        理想引薦對象
                                    </h3>
                                    <p className="whitespace-pre-line text-sm text-gray-300 sm:text-base">{ideal}</p>
                                </section>
                            )}

                            {member.services && member.services.length > 0 && (
                                <section>
                                    <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">服務項目</h3>
                                    <ul className="space-y-2">
                                        {member.services
                                            .filter((s) => s && s.trim())
                                            .map((s, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm sm:text-base">
                                                    <Check className="mt-0.5 shrink-0 text-primary" size={18} strokeWidth={2.5} />
                                                    <span>{s}</span>
                                                </li>
                                            ))}
                                    </ul>
                                </section>
                            )}
                        </div>
                    </div>
                </div>

                <div className="shrink-0 border-t border-white/10 bg-[#0B1120] p-4 sm:hidden">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-xl bg-primary py-3 text-center text-sm font-bold text-[#0B1120]"
                    >
                        關閉
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
};

export default MemberDetailModal;
