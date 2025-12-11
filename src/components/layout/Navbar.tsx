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
        { name: '關於我們', path: '/about' }, // Changed to verify path
        { name: '白金會員', path: '/members' },
        { name: '引薦單', path: '/referrals' }, // Changed to verify path
        { name: '聯絡我們', path: '/contact' }, // Changed to verify path
        { name: '什麼是 BNI ?', path: '/bni' },
    ];

    const isActive = (path: string) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-bg-dark/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
                }`}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="relative w-10 h-10 overflow-hidden rounded-md border border-white/20 group-hover:border-primary/50 transition-colors">
                        <img
                            src="/images/assets/logo/白色正方形logo.png"
                            alt="EverShine Logo"
                            className="w-full h-full object-contain p-1"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-white tracking-wider group-hover:text-primary transition-colors">EverShine</span>
                        <span className="text-xs text-gray-400 tracking-[0.2em] group-hover:text-primary/70 transition-colors">长辉白金分会</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="relative group py-2"
                        >
                            <span className={`text-sm tracking-wider font-medium transition-colors ${isActive(link.path) ? 'text-primary' : 'text-gray-300 group-hover:text-white'
                                }`}>
                                {link.name}
                            </span>
                            <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary transform origin-left transition-transform duration-300 ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                }`} />
                        </Link>
                    ))}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-5 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 text-sm font-bold tracking-wide"
                    >
                        立即加入
                    </motion.button>
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
        </motion.nav>
    );
};

export default Navbar;
