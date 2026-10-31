import React, { useMemo } from 'react';
import { Building, Briefcase, Phone, Mail, Globe, Check, Linkedin, Facebook } from 'lucide-react';
import type { Member } from '../../types';
import { siteConfig } from '../../config/site.config';
import { normalizeMemberLinks } from '../../lib/memberLinks';
import { formatTaiwanPhoneDisplay, formatTaiwanPhoneTelHref } from '../../lib/phoneFormat';
import { splitIntro } from '../../lib/memberIntroSplit';
import { resolveMemberPhotoObjectPosition } from '../../lib/memberPhotoPosition';
import GoldMedalBadge from './GoldMedalBadge';
import { resolveGoldMedalCount } from '../../lib/goldMedal';
import { EmblemBeaconLock, EmblemExclusiveOrbit } from '../home/StarshipEmblems';

/**
 * 會員檔案核心內容 — 給 Modal（彈窗）與 /member/:slug（獨立頁）共用。
 * 不包含 modal 殼（背景遮罩、關閉按鈕、portal）。
 */

function getPhotoUrl(photo: string) {
    if (!photo) return siteConfig.defaultPhoto;
    const clean = photo.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
    return clean.startsWith('/') ? clean : `/${clean}`;
}

const bentoMuted =
    'rounded-2xl border border-white/12 bg-[#071628]/75 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:p-6';

const bentoTextScroll =
    'min-h-0 flex-1 overflow-y-auto overscroll-contain py-0.5 pr-2 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.45)_transparent]';

const proseBody = 'whitespace-pre-wrap break-words text-sm leading-[1.7] text-slate-200 sm:text-base';

const microCell =
    'inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-sky-400/50 hover:bg-sky-500/15 hover:text-white';

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

function linkIconOnly(t: string, size = 18, url?: string) {
    const kind = inferLinkVisualType(t, url || '');
    switch (kind) {
        case 'phone':
            return <Phone size={size} strokeWidth={2} className="text-sky-300" />;
        case 'mail':
        case 'email':
            return <Mail size={size} strokeWidth={2} className="text-sky-300" />;
        case 'facebook':
        case 'fb':
            return <Facebook size={size} className="text-[#1877F2]" />;
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
}

function linkLabelText(type: string, url: string): string {
    const kind = inferLinkVisualType(type, url);
    switch (kind) {
        case 'facebook':
            return 'Facebook';
        case 'instagram':
            return 'Instagram';
        case 'linkedin':
            return 'LinkedIn';
        case 'line':
            return 'LINE';
        default:
            return '官方網站';
    }
}

interface MemberDetailBodyProps {
    member: Member;
    expanded?: boolean;
}

const MemberDetailBody: React.FC<MemberDetailBodyProps> = ({ member: m, expanded = false }) => {
    const contactMicroCells = useMemo(() => {
        const links = normalizeMemberLinks(m.links);
        const cells: React.ReactNode[] = [];

        if (m.phone) {
            const displayPhone = formatTaiwanPhoneDisplay(m.phone);
            cells.push(
                <a
                    key="p"
                    href={`tel:${formatTaiwanPhoneTelHref(m.phone)}`}
                    className={microCell}
                    aria-label={`電話 ${displayPhone}`}
                >
                    {linkIconOnly('phone', 16)}
                    <span className="font-mono tabular-nums">{displayPhone}</span>
                </a>
            );
        }
        if (m.email) {
            cells.push(
                <a key="e" href={`mailto:${m.email}`} className={microCell} aria-label={`信箱 ${m.email}`}>
                    {linkIconOnly('mail', 16)}
                    <span className="truncate max-w-[13rem]">{m.email}</span>
                </a>
            );
        }
        links.forEach((l, idx) => {
            const label = linkLabelText(l.type, l.url);
            cells.push(
                <a
                    key={`link-${idx}`}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={microCell}
                    aria-label={label}
                >
                    {linkIconOnly(l.type, 16, l.url)}
                    <span>{label}</span>
                </a>
            );
        });
        return cells;
    }, [m]);

    const { main: introMain, ideal } = splitIntro(m.fullIntro || '');
    const displayIntro = introMain || m.shortIntro || m.fullIntro?.replace(/\\n/g, '\n') || '';
    const services = (m.services || []).filter((s) => s && s.trim());
    const hashtags = (m.hashtags || []).filter((h) => h && h.trim());
    const goldMedalCount = resolveGoldMedalCount(m);

    const proseScrollClass = expanded ? 'min-h-0 flex-1' : `${bentoTextScroll} max-h-[min(50vh,22rem)]`;

    return (
        <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-12 lg:gap-8">
            {/* 左欄：頭像 + 產業別 + 公司/職稱 + 聯絡方式 */}
            <div className="flex w-full min-w-0 flex-col items-center lg:col-span-4 lg:items-stretch">
                <div className="relative flex w-full flex-col items-center rounded-2xl border border-white/10 bg-[#051224]/70 p-5 text-center backdrop-blur-xl">
                    {/* 客製化雙層星軌頭像框 */}
                    <div className="relative mb-3 flex h-40 w-40 items-center justify-center sm:h-44 sm:w-44">
                        <svg
                            viewBox="0 0 180 180"
                            className="pointer-events-none absolute inset-0 h-full w-full"
                            aria-hidden
                        >
                            <circle
                                cx="90"
                                cy="90"
                                r="84"
                                fill="none"
                                stroke="rgba(76,168,223,0.32)"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                            <circle
                                cx="90"
                                cy="90"
                                r="76"
                                fill="none"
                                stroke="rgba(232,197,71,0.38)"
                                strokeWidth="1.2"
                            />
                            <circle cx="90" cy="6" r="3.5" fill="#E8C547" />
                            <circle cx="168" cy="120" r="2.8" fill="#4CA8DF" />
                            <circle cx="14" cy="65" r="2.5" fill="#7CD0FF" />
                        </svg>
                        <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-white/30 bg-slate-950 shadow-[0_18px_48px_rgba(0,0,0,0.6)] sm:h-36 sm:w-36">
                            <img
                                src={getPhotoUrl(m.photo)}
                                alt={`${m.name} — ${m.industry || 'BNI 長輝白金分會'}`}
                                width={144}
                                height={144}
                                className="h-full w-full object-cover"
                                style={{ objectPosition: resolveMemberPhotoObjectPosition(m.photoPosition) }}
                            />
                        </div>
                    </div>

                    {m.id > 0 && (
                        <span className="mb-1.5 font-mono text-[11px] tracking-wider text-platinum-light/90">
                            會員編號 #{String(m.id).padStart(3, '0')} · 產業獨家代表
                        </span>
                    )}

                    <div className="flex w-full items-center justify-center gap-2">
                        <h2
                            className={`text-2xl font-black tracking-[0.04em] text-white sm:text-3xl ${
                                expanded ? 'break-words' : 'line-clamp-2'
                            }`}
                        >
                            {m.name}
                        </h2>
                        {goldMedalCount > 0 ? <GoldMedalBadge count={goldMedalCount} size={16} /> : null}
                    </div>

                    <div className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full border border-platinum/40 bg-platinum/10 px-3.5 py-1.5 text-xs font-bold tracking-wide text-platinum-soft sm:text-sm">
                        <span className="text-[11px] text-platinum-light/90">
                            專業代表
                        </span>
                        <span className={`min-w-0 break-words ${expanded ? '' : 'line-clamp-1'}`}>
                            {m.industry || '未分類'}
                        </span>
                    </div>

                    {m.category && (
                        <p className="mt-2 text-xs text-sky-300/85">
                            產業分類：{m.category.replace(/,/g, ' · ')}
                        </p>
                    )}

                    {(m.company || m.position || m.title) && (
                        <div className="mt-4 w-full space-y-2 border-t border-white/10 pt-4 text-left text-xs leading-relaxed text-slate-300 sm:text-sm">
                            {m.company ? (
                                <p className="flex items-start gap-2.5">
                                    <Building size={16} className="mt-0.5 shrink-0 text-sky-400" />
                                    <span className={`min-w-0 break-words font-medium text-white/95 ${expanded ? '' : 'line-clamp-3'}`}>
                                        {m.company}
                                    </span>
                                </p>
                            ) : null}
                            {m.position || m.title ? (
                                <p className="flex items-start gap-2.5">
                                    <Briefcase size={16} className="mt-0.5 shrink-0 text-sky-400/80" />
                                    <span className={`min-w-0 break-words ${expanded ? '' : 'line-clamp-2'}`}>
                                        {m.position || m.title}
                                    </span>
                                </p>
                            ) : null}
                        </div>
                    )}

                    {contactMicroCells.length > 0 ? (
                        <div className="mt-5 w-full border-t border-white/10 pt-4">
                            <p className="mb-2.5 text-left text-xs font-bold tracking-wider text-platinum-light/90">
                                聯絡方式
                            </p>
                            <div className="flex flex-wrap items-center gap-2">{contactMicroCells}</div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* 右欄：專業介紹、理想引薦與服務項目 */}
            <div className="flex min-w-0 flex-col gap-4 lg:col-span-8">
                <div className={ideal ? 'grid gap-4 lg:grid-cols-2 lg:gap-5' : 'flex flex-col gap-4'}>
                    <section className={`${bentoMuted} flex min-w-0 flex-col`}>
                        <div className="mb-3 flex items-center gap-2">
                            <span className="text-primary">
                                <EmblemExclusiveOrbit size={22} />
                            </span>
                            <h3 className="text-xs font-bold tracking-wider text-sky-300 sm:text-sm">
                                關於我與專業實績
                            </h3>
                        </div>
                        <div className={proseScrollClass}>
                            {expanded && m.shortIntro && introMain && m.shortIntro.trim() !== introMain.trim() ? (
                                <p className={`${proseBody} mb-3 text-sky-100 border-l-2 border-platinum/60 pl-3 font-medium`}>
                                    {m.shortIntro.replace(/\\n/g, '\n')}
                                </p>
                            ) : null}
                            <p className={proseBody}>{displayIntro || '尚未填寫詳細介紹。'}</p>
                        </div>
                    </section>

                    {ideal ? (
                        <section className="relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-platinum/35 bg-gradient-to-br from-platinum/10 via-[#07192e]/90 to-sky-500/10 p-4 shadow-[inset_0_1px_0_rgba(255,243,200,0.12)] backdrop-blur-xl sm:p-6">
                            <div className="mb-3 flex shrink-0 items-center gap-2">
                                <span className="text-platinum-light">
                                    <EmblemBeaconLock size={22} />
                                </span>
                                <h3 className="text-xs font-bold tracking-wider text-platinum-soft sm:text-sm">
                                    理想引薦對象
                                </h3>
                            </div>
                            <div className={proseScrollClass}>
                                <p className={`${proseBody} text-slate-100`}>{ideal}</p>
                            </div>
                        </section>
                    ) : null}
                </div>

                {services.length > 0 ? (
                    <section className={`${bentoMuted} relative min-h-0 min-w-0 overflow-hidden`}>
                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.12]"
                            style={{
                                backgroundImage:
                                    'repeating-linear-gradient(-32deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 10px)',
                            }}
                            aria-hidden
                        />
                        <div className="relative z-10">
                            <h3 className="mb-3 text-xs font-bold tracking-wider text-sky-300 sm:text-sm">
                                主力服務項目
                            </h3>
                            <ul className="grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">
                                {services.map((s, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2 rounded-xl border border-white/8 bg-black/25 px-3.5 py-2.5 text-xs leading-snug text-slate-100 sm:text-sm"
                                    >
                                        <Check className="mt-0.5 shrink-0 text-platinum-light" size={15} strokeWidth={2.5} />
                                        <span className={`min-w-0 break-words ${expanded ? '' : 'line-clamp-4'}`}>{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                ) : null}

                {expanded && hashtags.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        {hashtags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-gray-300"
                            >
                                #{tag.replace(/^#/, '')}
                            </span>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default MemberDetailBody;
