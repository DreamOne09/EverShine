
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

    // Claim States
    const [unclaimedMembers, setUnclaimedMembers] = useState<any[]>([]);
    const [selectedMemberId, setSelectedMemberId] = useState<string | number | null>(null);

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
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">密碼</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full bg-black/30 border border-white/20 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none"
                                        placeholder="••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
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
