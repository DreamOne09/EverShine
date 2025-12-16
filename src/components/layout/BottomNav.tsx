import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, BookOpen, BarChart2, User, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const BottomNav: React.FC = () => {
    const location = useLocation();
    const { user } = useAuth();

    const isActive = (path: string) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { name: '首頁', path: '/', icon: <Home size={20} /> },
        { name: '關於', path: '/bni', icon: <BookOpen size={20} /> },
        { name: '會員', path: '/members', icon: <Users size={20} /> },
        { name: '引薦', path: '/referrals', icon: <BarChart2 size={20} /> },
        {
            name: user ? '檔案' : '登入',
            path: user ? '/member-edit' : '/login',
            icon: user ? <User size={20} /> : <LogIn size={20} />
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0a192f]/95 backdrop-blur-xl border-t border-white/10 pb-safe">
            <div className="flex justify-between items-center h-[70px] px-2 max-w-md mx-auto">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-300 ${active ? 'text-primary' : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            {/* Active Indicator Top Line */}
                            {active && (
                                <motion.div
                                    layoutId="bottom-nav-active"
                                    className="absolute top-0 w-8 h-[3px] bg-primary shadow-[0_0_8px_rgba(76,168,223,0.6)] rounded-b-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <div className={`transition-transform duration-300 ${active ? '-translate-y-1' : ''}`}>
                                {item.icon}
                            </div>
                            <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
