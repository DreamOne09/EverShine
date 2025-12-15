import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';

const Contact: React.FC = () => {
    return (
        <section className="min-h-screen flex flex-col justify-center relative py-24 md:py-32 overflow-hidden" id="contact">
            {/* Background Elements */}
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
                        我們隨時準備為您服務。無論是業務合作、參訪申請，或是想了解更多關於 BNI 的資訊，歡迎隨時與我們聯繫。
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
                    {/* President Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-bg-dark/60 backdrop-blur-md border border-primary/20 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group text-center h-full flex flex-col"
                    >
                        <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-primary/50 mb-4 group-hover:border-primary transition-colors shrink-0">
                            <img
                                src="/images/members/王年煜.jpg"
                                alt="王年煜"
                                className="w-full h-full object-cover"
                                style={{ objectPosition: 'top' }}
                                onError={(e) => e.currentTarget.src = '/images/assets/logo/白色正方形logo.png'}
                            />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">現任主席</h3>
                        <div className="text-xl text-primary font-bold mb-1">王年煜</div>
                        <div className="text-gray-300 text-base mb-4">AI程式交易</div>

                        <div className="border-t border-white/10 pt-4 space-y-2 text-left inline-block w-full text-base mt-auto">
                            <div className="flex flex-col items-center gap-1 text-gray-300 justify-center">
                                <span className="font-medium text-white">創達智能技術股份有限公司 董事長</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 justify-center pt-2">
                                <Phone size={16} className="text-primary shrink-0" />
                                <span>0938-767-768</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 justify-center">
                                <Mail size={16} className="text-primary shrink-0" />
                                <span className="text-sm break-all">wang.ian@investrontech.com</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Vice President Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-bg-dark/60 backdrop-blur-md border border-primary/20 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group text-center h-full flex flex-col"
                    >
                        <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-primary/50 mb-4 group-hover:border-primary transition-colors shrink-0">
                            <img
                                src="/images/members/王祈.jpg"
                                alt="王祈"
                                className="w-full h-full object-cover"
                                style={{ objectPosition: 'top' }}
                                onError={(e) => e.currentTarget.src = '/images/assets/logo/白色正方形logo.png'}
                            />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">現任副主席</h3>
                        <div className="text-xl text-primary font-bold mb-1">王祈</div>
                        <div className="text-gray-300 text-base mb-4">AI學習整合</div>

                        <div className="border-t border-white/10 pt-4 space-y-2 text-left inline-block w-full text-base mt-auto">
                            <div className="flex flex-col items-center gap-1 text-gray-300 justify-center">
                                <span className="font-medium text-white">祈育教育實業坊 董事長</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 justify-center pt-2">
                                <Phone size={16} className="text-primary shrink-0" />
                                <span>0956-522-350</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 justify-center">
                                <Mail size={16} className="text-primary shrink-0" />
                                <span className="text-sm break-all">samuel900731@gmail.com</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Secretary/Treasurer Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-bg-dark/60 backdrop-blur-md border border-primary/20 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group text-center h-full flex flex-col"
                    >
                        <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-primary/50 mb-4 group-hover:border-primary transition-colors shrink-0">
                            <img
                                src="/images/members/劉懿德.jpg"
                                alt="劉懿德"
                                className="w-full h-full object-cover"
                                style={{ objectPosition: 'top' }}
                                onError={(e) => e.currentTarget.src = '/images/assets/logo/白色正方形logo.png'}
                            />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">現任秘書財務</h3>
                        <div className="text-xl text-primary font-bold mb-1">劉懿德</div>
                        <div className="text-gray-300 text-base mb-4">策展規劃設計</div>

                        <div className="border-t border-white/10 pt-4 space-y-2 text-left inline-block w-full text-base mt-auto">
                            <div className="flex flex-col items-center gap-1 text-gray-300 justify-center">
                                <span className="font-medium text-white">樂橙創作設計 董事長</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 justify-center pt-2">
                                <Phone size={16} className="text-primary shrink-0" />
                                <span>0952-983-157</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 justify-center">
                                <Mail size={16} className="text-primary shrink-0" />
                                <span className="text-sm break-all">claire@allrange.tw</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
