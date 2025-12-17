
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, User as UserIcon, AlertCircle, CheckCircle } from 'lucide-react';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'claim'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

    // Claim States
    const [unclaimedMembers, setUnclaimedMembers] = useState<any[]>([]);
    const [selectedMemberId, setSelectedMemberId] = useState<string | number | null>(null);

    // Validation helpers
    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (password: string) => {
        // At least 8 characters, contains number and letter
        const hasNumber = /\d/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        return password.length >= 8 && hasNumber && hasLetter;
    };

    useEffect(() => {
        // If logged in, check profile linkage
        if (user) {
            checkProfile();
        }
    }, [user]);

    const checkProfile = async () => {
        if (!user) return;

        // 1. Check if user already has a member profile
        const { data, error } = await supabase
            .from('members')
            .select('id, name')
            .eq('user_id', user.id)
            .single();

        if (data) {
            // Already matched, go to edit
            navigate('/member-edit');
        } else {
            // Logged in but no profile, load unclaimed members list
            loadUnclaimedMembers();
            setMode('claim');
        }
    };

    const loadUnclaimedMembers = async () => {
        // Fetch all members who don't have a user_id yet
        const { data, error } = await supabase
            .from('members')
            .select('id, name, industry, photo')
            .is('user_id', null)
            .order('id', { ascending: true }); // ID is now integer/number

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
                if (!validatePassword(password)) {
                    throw new Error('密碼至少需要 8 個字元，並包含英文字母與數字');
                }
                if (password !== confirmPassword) {
                    throw new Error('兩次輸入的密碼不一致');
                }

                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage({ text: '註冊成功！請檢查信箱並點擊驗證連結。', type: 'success' });
                setMode('login');
            } else if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
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
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = async () => {
        if (!selectedMemberId || !user) return;
        setLoading(true);

        try {
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
        <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-bg-dark/80 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-xl"
            >
                <h1 className="text-2xl font-bold text-center text-white mb-6">
                    {mode === 'login' && '會員登入'}
                    {mode === 'signup' && '註冊新帳號'}
                    {mode === 'forgot' && '重設密碼'}
                    {mode === 'claim' && '認領您的會員檔案'}
                </h1>

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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-dark text-bg-dark font-bold py-3 rounded-lg transition-colors mt-2"
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

                        <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
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

                        <button
                            type="button"
                            onClick={handleClaim}
                            disabled={!selectedMemberId || loading}
                            className={`w-full font-bold py-3 rounded-lg transition-colors mt-4 ${!selectedMemberId
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
