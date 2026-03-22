
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import SEO from '../components/common/SEO';
import { siteConfig } from '../config/site.config';

declare global {
    interface Window {
        turnstile: any;
    }
}

// Dedicated Turnstile Component to handle its own lifecycle strictly
const TurnstileWidget: React.FC<{ siteKey: string, onVerify: (token: string) => void }> = ({ siteKey, onVerify }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const widgetIdRef = React.useRef<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const renderWidget = () => {
            if (window.turnstile && containerRef.current && !widgetIdRef.current && isMounted) {
                try {
                    // Force clear container to prevent multiple iframes
                    containerRef.current.innerHTML = '';
                    widgetIdRef.current = window.turnstile.render(containerRef.current, {
                        sitekey: siteKey,
                        callback: (token: string) => {
                            if (isMounted) onVerify(token);
                        },
                    });
                } catch (e) {
                    console.warn('Turnstile render failed:', e);
                }
            }
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(renderWidget, 300);

        return () => {
            isMounted = false;
            clearTimeout(timer);
            if (window.turnstile && widgetIdRef.current) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, [siteKey]); // Only re-run if siteKey changes

    return <div ref={containerRef} className="flex justify-center"></div>;
};

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'claim'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

    const [claimPassword, setClaimPassword] = useState('');
    const [unclaimedMembers, setUnclaimedMembers] = useState<any[]>([]);
    const [selectedMemberId, setSelectedMemberId] = useState<string | number | null>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    // Site Key Placeholder - User should replace this with their actual Cloudflare Turnstile Site Key
    const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'; // Testing key

    // Validation helpers
    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = async (password: string): Promise<{ valid: boolean; message: string }> => {
        // 基本驗證
        if (password.length < 8) {
            return { valid: false, message: '密碼至少需要 8 個字元' };
        }
        
        const hasNumber = /\d/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        
        if (!hasNumber || !hasLetter) {
            return { valid: false, message: '密碼需要包含英文字母與數字' };
        }
        
        // 檢查密碼是否洩漏（使用 HaveIBeenPwned API）
        try {
            const { checkPasswordLeaked } = await import('../lib/passwordSecurity');
            const isLeaked = await checkPasswordLeaked(password);
            
            if (isLeaked) {
                return { valid: false, message: '此密碼已在洩漏資料庫中，請使用更安全的密碼' };
            }
        } catch (error) {
            // 如果檢查失敗，不阻擋使用者（但記錄錯誤）
            console.warn('密碼洩漏檢查失敗，繼續驗證:', error);
        }
        
        return { valid: true, message: '密碼符合要求' };
    };

    useEffect(() => {
        // If logged in, check profile linkage
        if (user) {
            checkProfile();
        }
    }, [user]);

    // Cleanup token when switching modes
    useEffect(() => {
        setCaptchaToken(null);
    }, [mode]);

    const checkProfile = async () => {
        if (!user) return;

        try {
            // 1. Check if user already has a member profile
            const { data, error } = await supabase
                .from('members')
                .select('id, name')
                .eq('user_id', user.id)
                .single();

            if (error) {
                // If checking profile fails, we assume no profile linked yet (PGRST116)
                // Proceed to claim mode
                console.log('No profile linked, switching to claim mode:', error.message);
                loadUnclaimedMembers();
                setMode('claim');
                return;
            }

            if (data) {
                // Already matched, go to edit
                navigate('/member-edit');
            }
        } catch (err) {
            console.error('Unexpected error checking profile:', err);
            // Safety fallback
            loadUnclaimedMembers();
            setMode('claim');
        }
    };

    const loadUnclaimedMembers = async () => {
        // Fetch all members who don't have a user_id yet
        const { data } = await supabase
            .from('members')
            .select('id, name, industry, photo')
            .is('user_id', null)
            .order('id', { ascending: true });

        if (data) {
            setUnclaimedMembers(data);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (mode === 'signup') {
                // Validation checks
                if (!validateEmail(email)) {
                    throw new Error('請輸入有效的 Email 格式');
                }
                
                // 密碼驗證（包含洩漏檢查）
                const passwordValidation = await validatePassword(password);
                if (!passwordValidation.valid) {
                    throw new Error(passwordValidation.message);
                }
                
                if (password !== confirmPassword) {
                    throw new Error('兩次輸入的密碼不一致');
                }

                const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        captchaToken: captchaToken || undefined,
                    }
                });

                if (signUpErr) {
                    if (signUpErr.message.includes('already registered')) {
                        throw new Error('此 Email 已經註冊過囉！請直接使用「登入」功能，或使用「忘記密碼」重設。');
                    }
                    throw signUpErr;
                }

                // If signUpData.user is null but there was no error, it usually means 
                // the user already exists (Supabase security feature)
                if (signUpData?.user && signUpData.session === null && signUpData.user.identities?.length === 0) {
                    setMessage({ text: '此 Email 已被註冊，請直接登入。', type: 'error' });
                    setMode('login');
                    return;
                }

                setMessage({ text: '註冊成功！請檢查信箱並點擊驗證連結。', type: 'success' });
                setMode('login');
                setCaptchaToken(null); // Reset captcha on success
            } else if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                    options: {
                        captchaToken: captchaToken || undefined,
                    }
                });
                if (error) throw error;
                // useEffect will trigger checkProfile
            } else if (mode === 'forgot') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/member-edit?reset=true`,
                });
                if (error) throw error;
                setMessage({ text: '密碼重設信已發送，請檢查您的信箱。', type: 'success' });
            }
        } catch (err: any) {
            setMessage({ text: err.message, type: 'error' });
            setCaptchaToken(null);
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = async () => {
        if (!selectedMemberId || !user) return;
        setLoading(true);

        try {
            // Check division password
            if (claimPassword !== siteConfig.claimPassword) {
                throw new Error('分會認證密碼錯誤，請洽詢網站管理員 (魔術方塊教學 李孟一)。');
            }

            // Update the selected member with current user's UUID
            const { error } = await supabase
                .from('members')
                .update({ user_id: user.id })
                .eq('id', selectedMemberId);

            if (error) throw error;

            setMessage({ text: '綁定成功！', type: 'success' });
            setTimeout(() => navigate('/member-edit'), 1000);

        } catch (err: any) {
            setMessage({ text: '綁定失敗：' + err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100dvh-80px)] flex items-center justify-center py-12 pb-24 md:pb-12 px-4 container mx-auto">
            <SEO title="會員登入" noindex />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-bg-dark/80 backdrop-blur border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl"
            >
                <h1 className="text-2xl font-bold text-center text-white mb-6">
                    {mode === 'login' && '會員登入'}
                    {mode === 'signup' && '註冊新帳號'}
                    {mode === 'forgot' && '重設密碼'}
                    {mode === 'claim' && '認領您的會員檔案'}
                </h1>

                {/* Show warning for In-App Browsers */}
                {(() => {
                    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
                    const isLine = /Line\//i.test(ua);
                    const isFb = /FBAN|FBAV/i.test(ua);
                    const isIg = /Instagram/i.test(ua);

                    if ((isLine || isFb || isIg) && (mode === 'login' || mode === 'signup')) {
                        return (
                            <div className="mb-6 p-4 bg-amber-500/20 border border-amber-500/50 rounded-lg text-amber-200 text-sm flex items-start gap-3">
                                <AlertCircle size={20} className="shrink-0 mt-0.5 text-amber-400" />
                                <div>
                                    <p className="font-bold mb-1">偵測到 {isLine ? 'LINE' : isFb ? 'Facebook' : 'Instagram'} 內建瀏覽器</p>
                                    <p>Google 登入不支援此環境。請點擊右上角<strong>「...」</strong>並選擇 <strong>「使用預設瀏覽器開啟」</strong> (Safari/Chrome) 重新操作。</p>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })()}

                {message && (
                    <div className={`mb-6 p-3 rounded-lg text-sm text-center ${message.type === 'error' ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'}`}>
                        {message.text}
                    </div>
                )}

                {/* LOGIN / SIGNUP / FORGOT FORM */}
                {['login', 'signup', 'forgot'].includes(mode) && (
                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-black/30 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {mode !== 'forgot' && (
                            <>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">密碼</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="w-full bg-black/30 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none"
                                            placeholder="••••••••"
                                            required
                                            minLength={8}
                                        />
                                    </div>
                                    {mode === 'signup' && (
                                        <p className="text-xs text-gray-500 mt-1">至少 8 個字元，需包含英文字母與數字</p>
                                    )}
                                </div>

                                {mode === 'signup' && (
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1">確認密碼</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                                className="w-full bg-black/30 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none"
                                                placeholder="••••••••"
                                                required
                                                minLength={8}
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {(mode === 'login' || mode === 'signup') && (
                            <div className="my-4 flex justify-center min-h-[65px]">
                                <div id="turnstile-container-wrapper" key={mode}>
                                    {/* Using a key on the wrapper ensures a fresh start whenever mode changes */}
                                    <TurnstileWidget
                                        siteKey={TURNSTILE_SITE_KEY}
                                        onVerify={(token) => setCaptchaToken(token)}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || ((mode === 'login' || mode === 'signup') && !captchaToken)}
                            className="w-full bg-primary hover:bg-primary-dark text-bg-dark font-bold py-3 rounded-lg transition-colors mt-2 disabled:opacity-50"
                        >
                            {loading ? '處理中...' :
                                mode === 'login' ? '登入' :
                                    mode === 'signup' ? '註冊' : '發送重設信'}
                        </button>

                        {(mode === 'login' || mode === 'signup') && (
                            <>
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-bg-dark text-gray-400">或</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={async () => {
                                        const { error } = await supabase.auth.signInWithOAuth({
                                            provider: 'google',
                                            options: { redirectTo: window.location.origin }
                                        });
                                        if (error) setMessage({ text: error.message, type: 'error' });
                                    }}
                                    className="w-full bg-white text-gray-900 border border-gray-300 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-3"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    使用 Google 登入
                                </button>

                                <p className="text-xs text-center text-gray-500 mt-3">
                                    登入即代表您同意本站的
                                    <Link to="/privacy" className="text-primary hover:underline mx-1">
                                        隱私權政策與服務條款
                                    </Link>
                                </p>
                            </>
                        )}

                        <div className="text-center text-sm text-gray-400 mt-4 space-y-2">
                            {mode === 'login' && (
                                <>
                                    <p>
                                        還沒有帳號？
                                        <button type="button" onClick={() => setMode('signup')} className="text-primary hover:underline ml-1">
                                            立即註冊
                                        </button>
                                    </p>
                                    <p>
                                        <button type="button" onClick={() => setMode('forgot')} className="text-gray-500 hover:text-gray-300 text-xs">
                                            忘記密碼？
                                        </button>
                                    </p>
                                </>
                            )}
                            {mode === 'signup' && (
                                <p>
                                    已有帳號？
                                    <button type="button" onClick={() => setMode('login')} className="text-primary hover:underline ml-1">
                                        直接登入
                                    </button>
                                </p>
                            )}
                            {mode === 'forgot' && (
                                <p>
                                    想起密碼了？
                                    <button type="button" onClick={() => setMode('login')} className="text-primary hover:underline ml-1">
                                        返回登入
                                    </button>
                                </p>
                            )}
                        </div>
                    </form>
                )}

                {/* CLAIM PROFILE LIST */}
                {mode === 'claim' && (
                    <div className="space-y-4">
                        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg mb-4 flex gap-3 text-sm text-blue-200">
                            <AlertCircle className="shrink-0 text-blue-400" size={20} />
                            <div>
                                歡迎！請從下方選擇您的會員檔案進行綁定。<br />
                                <span className="text-xs opacity-70">綁定後，只有您能編輯此檔案。</span>
                            </div>
                        </div>

                        <div className="max-h-48 md:max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar -mx-1 px-1">
                            {unclaimedMembers.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    沒有可供認領的會員資料
                                </div>
                            ) : (
                                unclaimedMembers.map(m => (
                                    <div
                                        key={m.id}
                                        onClick={() => setSelectedMemberId(m.id)}
                                        className={`p-3 rounded-lg cursor-pointer border transition-all flex items-center justify-between ${selectedMemberId === m.id
                                            ? 'bg-primary/20 border-primary text-primary'
                                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono opacity-50">#{m.id}</span>
                                            <span className="font-medium">{m.name}</span>
                                            <span className="text-xs text-gray-500 bg-black/30 px-2 py-0.5 rounded">{m.industry}</span>
                                        </div>
                                        {selectedMemberId === m.id && <CheckCircle size={18} />}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-6 border-t border-white/10 pt-6">
                            <label className="block text-gray-400 text-sm mb-2">請輸入分會認證密碼</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    value={claimPassword}
                                    onChange={e => setClaimPassword(e.target.value)}
                                    className="w-full bg-black/30 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none"
                                    placeholder="分會密碼"
                                    required
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2">
                                * 為確保資料安全，認領帳號需輸入分會專屬密碼。
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleClaim}
                            disabled={!selectedMemberId || !claimPassword || loading}
                            className={`w-full font-bold py-3 rounded-lg transition-colors mt-4 ${(!selectedMemberId || !claimPassword)
                                ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                                : 'bg-green-600 hover:bg-green-500 text-white'
                                }`}
                        >
                            {loading ? '綁定中...' : '確認綁定'}
                        </button>

                        <button
                            type="button"
                            onClick={async () => {
                                await supabase.auth.signOut();
                                setMode('login');
                            }}
                            className="w-full text-gray-500 text-sm py-2 hover:text-gray-300 mt-2"
                        >
                            登出並切換帳號
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Login;
