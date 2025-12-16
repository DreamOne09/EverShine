
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
                                `text-base font-medium tracking-wider transition-colors duration-300 hover:text-primary relative group ${isActive ? 'text-primary' : 'text-gray-300'}`
                            }
                        >
                            {link.name}
                            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                        </NavLink>
                    ))}

                    {/* Social Icons */}
                    <div className="flex items-center gap-3 border-l border-white/20 pl-6 mr-2">
                        <a href="https://www.facebook.com/BNIEverShine" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E4405F] transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.315 2zm-3.196 1.983c0 .245.2.445.445.445h.001a.446.446 0 01.445-.445v-.001a.446.446 0 01-.445-.445h-.001a.446.446 0 01-.445.445zm8.903.01c-1.068-.048-1.795-.216-2.432-.463a3.916 3.916 0 00-1.417-.922 3.916 3.916 0 00-1.418.922c-.637.247-1.364.415-2.431.463C9.043 4.09 8.707 4.103 6.096 4.103h-.08c-2.61 0-2.946-.013-4.014-.061-1.068-.049-1.795-.216-2.432-.463a3.916 3.916 0 00-1.418-.922 3.916 3.916 0 00-1.417.922c-.637.247-1.363.415-2.432.463-1.067.049-1.403.06-4.013.06h-.08c-2.611 0-2.946-.012-4.014-.06z" clipRule="evenodd" />
                            </svg>
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
