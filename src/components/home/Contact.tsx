import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { useMembers } from '../../hooks/useMembers';

/** 幹部與會員庫 name 對應（產業／稱呼由站方設定，頭像與聯絡方式由 members 帶入） */
const LEADERSHIP = [
    { title: '現任主席', industry: '共享空間', name: '鄭雅菁' },
    { title: '副主席', industry: '空調工程', name: '洪智威' },
    { title: '秘書財務', industry: '信託規劃顧問', name: '王執定' },
] as const;

const Contact: React.FC = () => {
    const { members } = useMembers();

    const leadership = LEADERSHIP.map((role) => {
        const member = members.find((m) => m.name === role.name);
        return { ...role, member: member ?? null };
    });

    return (
        <section className="min-h-screen flex flex-col justify-center relative py-24 md:py-32 overflow-hidden" id="contact">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-bg-dark/50 -skew-x-12 transform origin-top-right"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] z-0"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 md:mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-white mb-6"
                    >
                        聯繫 <span className="text-primary">EverShine</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto"
                    >
                        歡迎與台灣 BNI 長輝白金分會聯繫。無論是業務合作、商會參訪申請，或是想了解更多關於台灣 BNI 商會的資訊，我們隨時為您服務。
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
                    {leadership.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-bg-dark/60 backdrop-blur-md border border-primary/20 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group text-center h-full flex flex-col"
                        >
                            <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-primary/50 mb-4 group-hover:border-primary transition-colors shrink-0">
                                <img
                                    src={item.member?.photo || `/images/members/${item.name}.jpg`}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    style={{ objectPosition: 'top' }}
                                    onError={(e) => {
                                        e.currentTarget.src = '/images/assets/logo/白色正方形logo.png';
                                    }}
                                />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                            <div className="text-primary/90 text-sm font-medium mb-1">
                                {item.industry}
                            </div>
                            <div className="text-xl text-white font-bold mb-4">{item.name}</div>

                            <div className="border-t border-white/10 pt-4 space-y-2 text-left inline-block w-full text-base mt-auto">
                                <div className="flex flex-col items-center gap-1 text-gray-300 justify-center">
                                    <span className="font-medium text-white text-center">
                                        {item.member?.company || '—'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300 justify-center pt-2">
                                    <Phone size={16} className="text-primary shrink-0" />
                                    <span>{item.member?.phone || '—'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300 justify-center">
                                    <Mail size={16} className="text-primary shrink-0" />
                                    <span className="text-sm break-all">{item.member?.email || '—'}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Contact;
