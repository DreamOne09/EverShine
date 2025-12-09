import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Facebook, Instagram } from 'lucide-react';
import clsx from 'clsx';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { to: '/', label: '首頁' },
        { to: '/bni', label: '什麼是BNI' },
        { to: '/members', label: '會員介紹' },
        { to: '/referrals', label: '會員引薦報告' },
    ];

    return (
        <nav
            className={clsx(
                "fixed top-0 left-0 w-full z-50 transition-all duration-300",
                scrolled
                    ? "bg-[rgba(6,32,58,0.95)] backdrop-blur-md shadow-lg py-2"
                    : "bg-[rgba(8,38,68,0.8)] backdrop-blur-sm py-4"
            )}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link to="/" className="flex items-center group">
                    <img
                        src="/images/assets/logo/透明底白字長條logo.png"
                        alt="EverShine Logo"
                        className={clsx("w-auto transition-all duration-300", scrolled ? "h-10" : "h-14")}
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={clsx(
                                "text-sm font-medium tracking-wide transition-colors relative group",
                                location.pathname === link.to ? "text-[#c5a47e]" : "text-white hover:text-[#c5a47e]"
                            )}
                        >
                            {link.label}
                            <span className={clsx(
                                "absolute -bottom-1 left-0 w-0 h-0.5 bg-[#c5a47e] transition-all duration-300 group-hover:w-full",
                                location.pathname === link.to ? "w-full" : ""
                            )} />
                        </Link>
                    ))}
                    <div className="flex space-x-4 ml-4 pl-4 border-l border-white/10">
                        <a href="https://www.facebook.com/BNlLongTermCare" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#c5a47e] transition-colors"><Facebook size={18} /></a>
                        <a href="https://www.instagram.com/chhubni/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#c5a47e] transition-colors"><Instagram size={18} /></a>
                        <a href="https://www.threads.net/@chhubni" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#c5a47e] transition-colors">
                            {/* Threads icon simplified as text or custom SVG later */}
                            <span className="text-xs font-bold border border-current rounded-full w-5 h-5 flex items-center justify-center">@</span>
                        </a>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-[#06203a] border-t border-white/10 absolute w-full left-0 top-full">
                    <div className="flex flex-col p-6 space-y-4">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={clsx(
                                    "text-white text-lg py-2 border-b border-white/5",
                                    location.pathname === link.to ? "text-[#c5a47e]" : ""
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
