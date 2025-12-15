import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Facebook, Instagram, Youtube } from 'lucide-react';

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
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0e2a47]/95 backdrop-blur-md shadow-lg py-4' : 'bg-gradient-to-b from-black/50 to-transparent py-6'
                }`}
        >
            <div className="max-w-[95%] mx-auto px-6 flex justify-center md:justify-between items-center">
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
                        <Link
                            key={link.name}
                            to={link.path}
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
                        </Link>
                    ))}

                    {/* Social Icons */}
                    <div className="flex items-center gap-3 pl-4 border-l border-white/10 ml-2">
                        <a href="https://www.facebook.com/BNlLongTermCare" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-colors"><Facebook size={20} /></a>
                        <a href="https://www.instagram.com/chhubni/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E4405F] transition-colors"><Instagram size={20} /></a>
                        <a href="https://www.threads.net/@chhubni" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FFFFFF] transition-colors">
                            <svg width="20" height="20" viewBox="0 0 192 192" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Mobile Menu Button - Hidden in favor of Bottom Nav */}
                <button
                    className="hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
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

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav >
    );
};

export default Navbar;
