import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, AlertCircle, RefreshCw, Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const MemberEdit: React.FC = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [searchParams] = useSearchParams();

    // Auth & Loading States
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

    // Member Data States
    const [memberId, setMemberId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [industry, setIndustry] = useState('');
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [title, setTitle] = useState('');
    const [shortIntro, setShortIntro] = useState('');
    const [fullIntro, setFullIntro] = useState('');
    const [services, setServices] = useState('');
    const [photo, setPhoto] = useState('');
    const [photoPosition, setPhotoPosition] = useState('top');
    const [links, setLinks] = useState<{ [key: string]: string }>({
        website: '',
        facebook: '',
        instagram: '',
        linkedin: '',
        line: ''
    });

    // Password Reset State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const CATEGORIES = [
        "工程裝修", "企業行銷", "企業顧問", "休閒教育",
        "投資理財", "美食餐飲", "健康美麗", "資訊系統"
    ];

    // Check Reset Password Mode
    useEffect(() => {
        const resetMode = searchParams.get('reset');
        if (resetMode === 'true') {
            setMessage({ text: '請在頁面下方設定您的新密碼', type: 'success' });
        }
    }, [searchParams]);

    // Load Data on Mount
    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/login');
            return;
        }
        loadMemberData();
    }, [user, authLoading, navigate]);

    const loadMemberData = async () => {
        if (!user) return;
        setIsLoadingData(true);

        try {
            const { data, error } = await supabase
                .from('members')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) {
                if (error.code !== 'PGRST116') {
                    throw error;
                }
                navigate('/login'); // No member data found for this user, redirect to login or create profile
                return;
            }

            if (data) {
                setMemberId(data.id);
                setName(data.name || '');
                setCategory(data.category || '');
                setIndustry(data.industry || '');
                setCompany(data.company || '');
                setPosition(data.position || '');
                setTitle(data.title || '');
                setShortIntro(data.shortIntro || '');
                setFullIntro(data.fullIntro || '');
                setServices(Array.isArray(data.services) ? data.services.join('\n') : (data.services || ''));
                setPhoto(data.photo || '');
                setPhotoPosition(data.photoPosition || 'top');

                // Merge existing links with default structure
                const defaultLinks: { [key: string]: string } = { website: '', facebook: '', instagram: '', linkedin: '', line: '' };
                const savedLinks = typeof data.links === 'object' ? data.links : {};

                if (Array.isArray(data.links)) {
                    data.links.forEach((l: any) => {
                        if (l.type && defaultLinks.hasOwnProperty(l.type)) {
                            defaultLinks[l.type] = l.url;
                        }
                    });
                    setLinks(defaultLinks);
                } else {
                    setLinks({ ...defaultLinks, ...savedLinks });
                }
            }
        } catch (err: any) {
            console.error(err);
            setMessage({ text: '無法載入會員資料：' + err.message, type: 'error' });
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !memberId) return;

        if (!file.type.startsWith('image/')) {
            setMessage({ text: '請上傳圖片檔案 (JPG, PNG)', type: 'error' });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ text: '圖片大小不能超過 5MB', type: 'error' });
            return;
        }

        try {
            setIsSaving(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${memberId}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('member-photos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('member-photos')
                .getPublicUrl(filePath);

            setPhoto(publicUrl);
            setMessage({ text: '圖片上傳成功', type: 'success' });
        } catch (err: any) {
            console.error(err);
            setMessage({ text: '上傳失敗：' + err.message, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword) return;
        if (newPassword !== confirmPassword) {
            setMessage({ text: '兩次密碼輸入不一致', type: 'error' });
            return;
        }
        if (newPassword.length < 6) {
            setMessage({ text: '密碼長度至少需 6 碼', type: 'error' });
            return;
        }

        try {
            setIsSaving(true);
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            setMessage({ text: '密碼更新成功！', type: 'success' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setMessage({ text: '密碼更新失敗：' + err.message, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = async () => {
        if (!memberId || !user) return;
        setIsSaving(true);
        setMessage(null);

        try {
            const updates = {
                category,
                industry,
                company,
                position,
                title,
                shortIntro,
                fullIntro,
                services: services.split('\n').filter(s => s.trim()),
                photo,
                photoPosition,
                links,
                updatedAt: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('members')
                .update(updates)
                .eq('id', memberId);

            if (error) throw error;

            setMessage({ text: '儲存成功！', type: 'success' });

            if (newPassword) {
                await handleUpdatePassword();
            }

        } catch (err: any) {
            console.error(err);
            setMessage({ text: '儲存失敗：' + err.message, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading || isLoadingData) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
                <div className="text-white flex items-center gap-2">
                    <RefreshCw className="animate-spin" />
                    載入中...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-bg-dark/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8"
                >
                    <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">編輯個人檔案</h1>
                        <div className="bg-primary/20 text-primary px-3 py-1 rounded text-sm">
                            {name} | 會員編號: {memberId}
                        </div>
                    </div>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'error' ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'
                                }`}
                        >
                            <AlertCircle size={20} />
                            {message.text}
                        </motion.div>
                    )}
                    <div className="mb-6">
                        <label className="block text-gray-300 mb-2">照片位置調整</label>
                        <select
                            value={photoPosition}
                            onChange={(e) => setPhotoPosition(e.target.value)}
                            className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                        >
                            <option value="top">上方 (Top) - 適合頭部特寫</option>
                            <option value="center">居中 (Center) - 預設</option>
                            <option value="bottom">下方 (Bottom)</option>
                        </select>
                        <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10 flex flex-col items-center">
                            <label className="text-gray-400 text-sm mb-2">預覽效果 (請確認頭部是否完整顯示)</label>
                            <div className="w-32 h-32 rounded-full border-2 border-primary overflow-hidden relative shadow-lg bg-gray-800">
                                {photo ? (
                                    <img
                                        key={photo}
                                        src={photo}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        style={{ objectPosition: photoPosition }}
                                        onError={(e) => {
                                            console.error('❌ 預覽圖片載入失敗:', photo);
                                            e.currentTarget.src = '/images/assets/logo/白色正方形logo.png';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs text-center p-2">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-2xl">👤</span>
                                            <span>無照片</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center">此預覽模擬在網站上的顯示圓框</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">公司名稱</label>
                        <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">產業類別 (最多選2項)</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => toggleCategory(cat)}
                                    className={`px-3 py-2 rounded-lg text-sm transition-all border ${selectedCategories.includes(cat)
                                        ? 'bg-primary text-bg-dark border-primary font-bold'
                                        : 'bg-black/30 text-gray-400 border-white/10 hover:bg-white/5'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">職稱</label>
                        <input
                            type="text"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                        />
                    </div>
            </div>


            <div className="bg-bg-dark/80 backdrop-blur border border-white/10 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-primary mb-6 border-b border-white/10 pb-4">✍️ 自我介紹</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-300 mb-2">簡短介紹 (100字內)</label>
                        <textarea
                            value={shortIntro}
                            onChange={(e) => setShortIntro(e.target.value)}
                            maxLength={100}
                            className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:outline-none h-24"
                        />
                        <div className="text-right text-xs text-gray-400">{shortIntro.length}/100</div>
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">完整介紹 (500字內)</label>
                        <textarea
                            value={fullIntro}
                            onChange={(e) => setFullIntro(e.target.value)}
                            maxLength={500}
                            className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:outline-none h-48"
                        />
                        <div className="text-right text-xs text-gray-400">{fullIntro.length}/500</div>
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">服務項目 (每行一項，最多5項)</label>
                        <textarea
                            value={services}
                            onChange={(e) => setServices(e.target.value)}
                            placeholder={`例如：\n房屋修繕\n水電工程`}
                            className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:outline-none h-32"
                        />
                        <div className="text-right text-xs text-gray-400 flex justify-between">
                            <span>請按 Enter 換行輸入下一項</span>
                            <span>目前: {services.split('\n').filter(s => s.trim()).length} / 5 項</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-bg-dark/80 backdrop-blur border border-white/10 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-primary mb-6 border-b border-white/10 pb-4">🔗 公司連結</h2>
                <div className="space-y-4">
                    {links.map((link, idx) => (
                        <div key={idx} className="flex gap-2">
                            <select
                                value={link.type}
                                onChange={(e) => {
                                    const newLinks = [...links];
                                    newLinks[idx].type = e.target.value;
                                    setLinks(newLinks);
                                }}
                                className="bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:outline-none w-1/3"
                            >
                                <option value="">選擇類型</option>
                                <option value="website">🌐 官網</option>
                                <option value="facebook">📘 Facebook</option>
                                <option value="instagram">📷 Instagram</option>
                                <option value="threads">🧵 Threads</option>
                                <option value="linkedin">💼 LinkedIn</option>
                                <option value="line">💬 LINE</option>
                                <option value="youtube">📺 YouTube</option>
                            </select>
                            <input
                                type="text"
                                value={link.url}
                                onChange={(e) => {
                                    const newLinks = [...links];
                                    newLinks[idx].url = e.target.value;
                                    setLinks(newLinks);
                                }}
                                placeholder="https://..."
                                className="flex-1 bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
                <button
                    type="button"
                    onClick={() => navigate('/members')}
                    className="px-6 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
                >
                    取消
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="animate-spin">⌛</span>
                            儲存中...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            儲存變更
                        </>
                    )}
                </button>
            </div>
        </motion.div >
    )
}

{/* Status Message */ }
{
    message && !message.text.includes('上傳成功') && !message.text.includes('驗證成功') && (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-lg text-center ${message.type === 'error' ? 'bg-red-500/20 text-red-200 border border-red-500/30' : 'bg-green-500/20 text-green-200 border border-green-500/30'}`}
        >
            {message.text}
        </motion.div>
    )
}
            </div >
        );
    };

export default MemberEdit;
