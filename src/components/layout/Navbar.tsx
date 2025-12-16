
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom'; // Changed Link to NavLink
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

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
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md py-4 shadow-lg border-b border-white/10' : 'bg-gradient-to-b from-black/50 to-transparent py-6'}`}>
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <NavLink to="/" className="flex items-center gap-3 group">
                    <img
                        src="/images/assets/logo/白色長方形logo.png"
                        alt="BNI EverShine"
                        className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                </NavLink>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `text-sm font-medium tracking-wider transition-colors duration-300 hover:text-primary relative group ${isActive ? 'text-primary' : 'text-gray-300'}`
                            }
                        >
                            {link.name}
                            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                        </NavLink>
                    ))}

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

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2 focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `text-lg font-medium py-2 border-b border-white/5 ${isActive ? 'text-primary' : 'text-gray-300'}`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}

                            <div className="pt-4 border-t border-white/20">
                                {user ? (
                                    <div className="flex flex-col gap-4">
                                        <NavLink to="/member-edit" className="flex items-center gap-3 text-gray-300">
                                            <User size={20} />
                                            我的檔案
                                        </NavLink>
                                        <button onClick={handleSignOut} className="flex items-center gap-3 text-red-400">
                                            <LogOut size={20} />
                                            登出
                                        </button>
                                    </div>
                                ) : (
                                    <NavLink
                                        to="/login"
                                        className="flex items-center gap-3 text-primary font-medium"
                                    >
                                        <LogIn size={20} />
                                        會員登入
                                    </NavLink>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
