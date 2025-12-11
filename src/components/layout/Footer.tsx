import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="relative z-10 bg-[#06203a] border-t border-white/10 pt-16 pb-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 text-center md:text-left">
                    <div className="md:col-span-2 space-y-4 flex flex-col items-center md:items-start">
                        <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
                            <img src="/images/assets/logo/透明底白字長條logo.png" alt="EverShine" className="h-12 w-auto" />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto md:mx-0 text-center md:text-left">
                            長輝白金分會致力於通過結構化、積極和專業的引薦行銷計畫，為會員提供增加業務機會的環境。
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg tracking-wide">快速連結</h4>
                        <ul className="space-y-3">
                            <li className="list-none"><Link to="/" className="text-gray-400 hover:text-[#c5a47e] transition-colors text-sm">首頁</Link></li>
                            <li className="list-none"><Link to="/members" className="text-gray-400 hover:text-[#c5a47e] transition-colors text-sm">會員介紹</Link></li>
                            <li className="list-none"><Link to="/referrals" className="text-gray-400 hover:text-[#c5a47e] transition-colors text-sm">引薦報告</Link></li>
                            <li className="list-none"><Link to="/bni" className="text-gray-400 hover:text-[#c5a47e] transition-colors text-sm">什麼是 BNI</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg tracking-wide">聯繫我們</h4>
                        <div className="space-y-3 flex flex-col items-center md:items-start">
                            <a href="https://www.facebook.com/BNlLongTermCare" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-[#c5a47e] transition-colors text-sm group">
                                <span className="p-2 bg-white/5 rounded-full group-hover:bg-[#c5a47e] group-hover:text-[#06203a] transition-all"><Facebook size={16} /></span> Facebook
                            </a>
                            <a href="https://www.instagram.com/chhubni/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-[#c5a47e] transition-colors text-sm group">
                                <span className="p-2 bg-white/5 rounded-full group-hover:bg-[#c5a47e] group-hover:text-[#06203a] transition-all"><Instagram size={16} /></span> Instagram
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs gap-4">
                    <p>&copy; {new Date().getFullYear()} BNI EverShine Chapter. All rights reserved.</p>
                    <p className="text-center">
                        本網站由琢奧科技有限公司開發與維護，網站與系統開發歡迎洽詢{' '}
                        <a href="mailto:info@dropout.tw" className="text-[#c5a47e] hover:underline">
                            info@dropout.tw
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
