import React from 'react';
import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';

const EditPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20 bg-[#050505]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#c5a47e]/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#cf2030]/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

                <div className="w-20 h-20 bg-[#c5a47e]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#c5a47e]/20">
                    <Wrench size={32} className="text-[#c5a47e]" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">會員資料編輯系統<br />升級中</h1>
                <p className="text-gray-400 mb-8 leading-relaxed">
                    為了提供更安全與高效的服務，編輯功能正在進行後端架構的 React 遷移與安全性升級。
                    <br /><br />
                    <span className="text-[#c5a47e] text-sm">如需急件修改，請洽分會秘書處。</span>
                </p>
                <a
                    href="/"
                    className="inline-block w-full px-8 py-3 bg-gradient-to-r from-[#c5a47e] to-[#b08d55] text-[#06203a] font-bold rounded-lg hover:shadow-[0_0_20px_rgba(197,164,126,0.3)] transition-all transform hover:-translate-y-1"
                >
                    返回首頁
                </a>
            </motion.div>
        </div>
    );
};

export default EditPage;
