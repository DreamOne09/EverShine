import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, BookOpen, MessageCircle, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { name: '首頁', path: '/', icon: <Home size={22} /> },
        { name: '會員', path: '/members', icon: <Users size={22} /> },
        { name: 'BNI', path: '/bni', icon: <BookOpen size={22} /> },
        { name: '引薦', path: '/referrals', icon: <BarChart2 size={22} /> },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#06203a]/95 backdrop-blur-xl border-t border-white/10 pb-safe">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`relative flex flex-col items-center justify-center w-full h-full py-1 gap-1 transition-colors duration-300 ${active ? 'text-primary' : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            {/* Active Indicator Background */}
                            {active && (
                                <motion.div
                                    layoutId="bottom-nav-active"
                                    className="absolute -top-[1px] left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_#4CA8DF]"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'scale-100'}`}>
                                {item.icon}
                            </div>
                            <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
                        </Link>
                    );
                })}
                <a
                    href="/#contact"
                    className="flex flex-col items-center justify-center w-full h-full py-1 gap-1 text-gray-400 hover:text-gray-200"
                    onClick={(e) => {
                        // Simple hash navigation fix if already on home
                        if (location.pathname === '/') {
                            e.preventDefault();
                            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                >
                    <MessageCircle size={22} />
                    <span className="text-[10px] font-medium tracking-wide">合作</span>
                </a>
            </div>
        </div>
    );
};

export default BottomNav;
