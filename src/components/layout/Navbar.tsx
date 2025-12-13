import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: '首頁', path: '/' },
        { name: '關於 BNI', path: '/bni' },
        { name: '會員介紹', path: '/members' },
        { name: '引薦案例', path: '/referrals' },
    ];

    // Handle scroll to anchor when path contains hash
    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location]);

    const isActive = (path: string) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0e2a47]/95 backdrop-blur-md shadow-lg py-4 border-b border-primary/20' : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-[95%] mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 overflow-hidden rounded-md transition-colors">
                        <img
                            src="/images/assets/logo/白色正方形logo.png"
                            alt="EverShine Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-white tracking-wide group-hover:text-primary transition-colors leading-tight">
                            EverShine
                        </span>
                        <span className="text-xs text-gray-300 tracking-wider font-medium group-hover:text-white transition-colors">
                            長輝白金分會
                        </span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.path}
                            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group overflow-hidden ${isActive(link.path)
                                ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] ring-1 ring-white/20'
                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className="relative z-10">{link.name}</span>
                            {isActive(link.path) && (
                                <motion.div
                                    layoutId="navbar-indicator"
                                    className="absolute inset-0 bg-primary/10 rounded-full z-0"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </a>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-bg-dark/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-8 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`py-3 px-4 rounded-lg flex justify-between items-center ${isActive(link.path)
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span className="font-medium tracking-wide">{link.name}</span>
                                    {isActive(link.path) && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </Link>
                            ))}
                            <button className="w-full mt-4 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-lg shadow-lg">
                                立即加入
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav >
    );
};

export default Navbar;
