import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Clock, ArrowRight } from 'lucide-react';

const Contact: React.FC = () => {
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');
        // Simulate submission
        setTimeout(() => {
            setFormStatus('success');
            setTimeout(() => setFormStatus('idle'), 3000);
        }, 1500);
    };

    return (
        <section className="relative py-24 md:py-32 bg-bg-primary overflow-hidden" id="contact">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-bg-dark/50 -skew-x-12 transform origin-top-right"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 md:mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
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
                        我們隨時準備為您服務。無論是業務合作、參訪申請，或是想了解更多關於 BNI 的資訊，歡迎隨時與我們聯繫。
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="bg-bg-dark border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors group">
                            <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                                <MapPin size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">分會地點</h3>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                台北市中山區植福路 8 號<br />(典華大直會館)
                            </p>
                            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary text-sm font-medium hover:underline">
                                查看地圖 <ArrowRight size={14} className="ml-1" />
                            </a>
                        </div>

                        <div className="bg-bg-dark border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors group">
                            <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                                <Clock size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">聚會時間</h3>
                            <p className="text-gray-400 leading-relaxed">
                                每週四早上<br />
                                <span className="text-white font-medium">06:45 - 09:00</span>
                            </p>
                        </div>

                        <div className="bg-bg-dark border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-colors group">
                            <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                                <Mail size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">電子郵件</h3>
                            <p className="text-gray-400 mb-4">
                                一般諮詢與業務合作
                            </p>
                            <a href="mailto:info@evershine.tw" className="text-xl text-white font-medium hover:text-primary transition-colors">
                                info@evershine.tw
                            </a>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-bg-dark border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] pointer-events-none"></div>

                        <h3 className="text-2xl font-bold text-white mb-8">發送訊息</h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 font-medium ml-1">姓名</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-600"
                                        placeholder="您的稱呼"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 font-medium ml-1">聯絡電話</label>
                                    <input
                                        type="tel"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-600"
                                        placeholder="09xx-xxx-xxx"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-medium ml-1">電子郵件</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-600"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-medium ml-1">訊息內容</label>
                                <textarea
                                    rows={4}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-600 resize-none"
                                    placeholder="請告訴我們您的需求..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={formStatus !== 'idle'}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${formStatus === 'success'
                                        ? 'bg-green-600 text-white cursor-default'
                                        : 'bg-primary text-bg-dark hover:bg-primary-light active:scale-[0.98]'
                                    }`}
                            >
                                {formStatus === 'idle' && (
                                    <>
                                        發送訊息 <Send size={18} />
                                    </>
                                )}
                                {formStatus === 'submitting' && (
                                    <>
                                        處理中... <div className="w-4 h-4 border-2 border-bg-dark/50 border-t-bg-dark rounded-full animate-spin" />
                                    </>
                                )}
                                {formStatus === 'success' && (
                                    <>
                                        已送出
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
