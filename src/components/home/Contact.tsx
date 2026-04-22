import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { useMembers } from '../../hooks/useMembers';

/** 三尊幹部：站方設定職稱與聯絡資訊；頭像與會員庫 name 對應時由 members 帶入照片 */
const LEADERSHIP = [
    {
        title: '現任主席',
        name: '王年煜',
        industry: 'AI程式交易',
        company: '創達智能技術股份有限公司',
        phone: '0938-767-768',
        email: 'wang.ian@investrontech.com',
    },
    {
        title: '現任副主席',
        name: '王祈',
        industry: 'ai學習整合',
        company: '祈育教育實業坊',
        phone: '0956-522-350',
        email: 'samuel900731@gmail.com',
    },
    {
        title: '現任秘書財務',
        name: '劉懿德',
        industry: '策展規劃設計',
        company: '樂橙創作設計',
        phone: '0952-983-157',
        email: 'claire@allrange.tw',
    },
] as const;

const Contact: React.FC = () => {
    const { members } = useMembers();

    const leadership = LEADERSHIP.map((role) => {
        const member = members.find((m) => m.name === role.name);
        return {
            ...role,
            member: member ?? null,
            /** 會員庫有資料時優先顯示（與站方手動欄位同步時較新） */
            company: member?.company?.trim() || role.company,
            phone: member?.phone?.trim() || role.phone,
            email: member?.email?.trim() || role.email,
            industry: member?.industry?.trim() || role.industry,
        };
    });

    return (
        <section
            className="min-h-screen flex flex-col justify-center relative py-24 md:py-32 overflow-hidden"
            id="contact"
            aria-labelledby="contact-heading"
        >
            {/* 底層：深藍網格＋光暈（對齊 EverShine 深色主題） */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.35]"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 1px 1px, rgba(79, 176, 227, 0.22) 1px, transparent 0)
                    `,
                    backgroundSize: '32px 32px',
                }}
                aria-hidden
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050a14]/80 via-transparent to-[#050a14]/90" aria-hidden />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-bg-dark/50 -skew-x-12 transform origin-top-right" aria-hidden />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/8 rounded-full blur-[100px] z-0" aria-hidden />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 md:mb-24">
                    <motion.h2
                        id="contact-heading"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-white mb-6"
                    >
                        聯繫 <span className="text-[#4FB0E3]">EverShine</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed"
                    >
                        歡迎與台灣 BNI 長輝白金分會聯繫。無論是業務合作、商會參訪申請，或是想了解更多關於台灣 BNI 商會的資訊，我們隨時為您服務。
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-2 sm:px-4">
                    {leadership.map((item, index) => (
                        <motion.article
                            key={item.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#0a192f]/75 backdrop-blur-md border border-[#4FB0E3]/35 rounded-2xl p-6 md:p-7 hover:border-[#4FB0E3]/60 hover:shadow-[0_0_32px_rgba(79,176,227,0.12)] transition-all duration-300 group text-center h-full flex flex-col"
                        >
                            <div className="relative w-28 h-28 mx-auto mb-5 shrink-0">
                                <div
                                    className="absolute inset-0 rounded-full bg-[#4FB0E3]/25 blur-md scale-110 opacity-80 group-hover:opacity-100 transition-opacity"
                                    aria-hidden
                                />
                                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#4FB0E3]/55 ring-2 ring-[#4FB0E3]/20 shadow-[0_0_20px_rgba(79,176,227,0.25)]">
                                    <img
                                        src={item.member?.photo || `/images/members/${item.name}.jpg`}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        style={{ objectPosition: item.member?.photoPosition || 'top' }}
                                        onError={(e) => {
                                            e.currentTarget.src = '/images/assets/logo/白色正方形logo.png';
                                        }}
                                    />
                                </div>
                            </div>

                            <h3 className="text-base font-bold text-white mb-2 tracking-wide">{item.title}</h3>
                            <p className="text-2xl font-black text-[#4FB0E3] mb-2 drop-shadow-[0_0_12px_rgba(79,176,227,0.35)]">
                                {item.name}
                            </p>
                            <p className="text-white/95 text-sm font-medium mb-5">{item.industry}</p>

                            <div className="border-t border-white/10 pt-4 space-y-3 text-left w-full mt-auto">
                                <p className="font-medium text-white text-center text-sm leading-snug">{item.company}</p>
                                <a
                                    href={`tel:${item.phone.replace(/-/g, '')}`}
                                    className="flex items-center justify-center gap-2 text-gray-200 hover:text-[#4FB0E3] transition-colors"
                                >
                                    <Phone size={16} className="text-[#4FB0E3] shrink-0" aria-hidden />
                                    <span className="tabular-nums">{item.phone}</span>
                                </a>
                                <a
                                    href={`mailto:${item.email}`}
                                    className="flex items-center justify-center gap-2 text-gray-200 hover:text-[#4FB0E3] transition-colors"
                                >
                                    <Mail size={16} className="text-[#4FB0E3] shrink-0" aria-hidden />
                                    <span className="text-sm break-all text-center">{item.email}</span>
                                </a>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Contact;
