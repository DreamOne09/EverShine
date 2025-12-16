
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User, Facebook, Instagram, Mic, AtSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const navLinks = [
        { name: '首頁', path: '/' },
        { name: '關於 BNI', path: '/bni' },
        { name: '分會成員', path: '/members' },
        { name: '引薦業務', path: '/referrals' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a192f]/95 backdrop-blur-md py-4 shadow-lg border-b border-white/10' : 'bg-gradient-to-b from-black/50 to-transparent py-6'}`}>
            <div className="container mx-auto px-4 flex justify-center md:justify-between items-center">
                {/* Logo */}
                <NavLink to="/" className="flex items-center gap-3 group">
                    <img
                        src="/images/assets/logo/透明底白字長條logo.png"
                        alt="BNI EverShine"
                        className="h-14 md:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                </NavLink>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `text-base font-medium tracking-wider transition-colors duration-300 hover:text-primary relative group ${isActive ? 'text-primary' : 'text-gray-300'}`
                            }
                        >
                            {link.name}
                            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                        </NavLink>
                    ))}

                    {/* Social Icons */}
                    <div className="flex items-center gap-4 border-l border-white/20 pl-6 mr-2">
                        <a href="https://www.facebook.com/BNIEverShine" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-colors" title="Facebook">
                            <Facebook size={20} />
                        </a>
                        <a href="https://www.instagram.com/bnievershine" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E1306C] transition-colors" title="Instagram">
                            <Instagram size={20} />
                        </a>
                        <a href="https://www.threads.net/@bnievershine" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Threads">
                            <AtSign size={20} />
                        </a>
                    </div>

                    {/* Auth Button */}
                    {user ? (
                        <div className="flex items-center gap-4 border-l border-white/20 pl-6">
                            <NavLink to="/member-edit" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                                <User size={16} />
                                <span>我的檔案</span>
                            </NavLink>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <NavLink
                            to="/login"
                            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-white transition-colors border border-primary/50 hover:bg-primary/10 px-4 py-2 rounded-full"
                        >
                            <LogIn size={16} />
                            <span>會員登入</span>
                        </NavLink>
                    )}
                </div>

                {/* Mobile View: Only Logo is visible here. BottomNav handles navigation. */}
            </div>
        </nav>
    );
};

export default Navbar;
