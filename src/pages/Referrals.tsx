import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Send, CheckCircle, AlertCircle } from 'lucide-react';

const Referrals: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        referrer: '',
        referee: '',
        notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            // Reset after 3 seconds
            setTimeout(() => {
                setStatus('idle');
                setFormData({ referrer: '', referee: '', notes: '' });
            }, 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen pt-24 pb-20 bg-bg-primary">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-block p-4 rounded-full bg-primary/10 mb-6">
                            <FileText className="w-12 h-12 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">引薦單填寫</h1>
                        <p className="text-gray-400 text-lg">
                            透過正式的引薦流程，為會員創造有價值的商務機會。每一張引薦單，都是一份信任的託付。
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-bg-dark border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

                        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-primary tracking-wide uppercase">推薦人 (您)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.referrer}
                                        onChange={(e) => setFormData({ ...formData, referrer: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-600"
                                        placeholder="請輸入您的姓名"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-primary tracking-wide uppercase">引薦對象 (會員)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.referee}
                                        onChange={(e) => setFormData({ ...formData, referee: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-600"
                                        placeholder="請輸入會員姓名"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-primary tracking-wide uppercase">引薦內容與備註</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-600 resize-none"
                                    placeholder="請詳細描述引薦的業務機會或需求..."
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={status === 'submitting' || status === 'success'}
                                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${status === 'success'
                                            ? 'bg-green-600 text-white cursor-default'
                                            : 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]'
                                        }`}
                                >
                                    {status === 'idle' && (
                                        <>
                                            <Send size={20} />
                                            送出引薦單
                                        </>
                                    )}
                                    {status === 'submitting' && (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            處理中...
                                        </>
                                    )}
                                    {status === 'success' && (
                                        <>
                                            <CheckCircle size={20} />
                                            發送成功
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Notice */}
                    <div className="mt-8 flex items-start gap-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <AlertCircle className="text-primary shrink-0 mt-0.5" size={20} />
                        <div className="text-sm text-gray-300 leading-relaxed">
                            <p className="mb-2 font-bold text-white">溫馨提醒：</p>
                            <p>
                                引薦單送出後，系統將自動通知相關會員。請確保填寫的資訊準確無誤，以便會員能夠及時跟進處理。
                                若有緊急事項，建議直接透過電話或 Line 聯繫該會員。
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Referrals;
