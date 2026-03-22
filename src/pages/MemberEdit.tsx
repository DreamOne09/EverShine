
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, AlertCircle, X, Camera, ArrowLeft, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import imageCompression from 'browser-image-compression';
import { useAuth } from '../contexts/AuthContext';
import type { Member } from '../types';
import SEO from '../components/common/SEO';
import { sanitizeText, sanitizeUrl } from '../lib/sanitize';
import { siteConfig } from '../config/site.config';

const CATEGORIES = [...siteConfig.industries];

interface MemberLink {
    type: string;
    url: string;
    icon: string;
}

const MemberEdit: React.FC = () => {
    const { user, loading: authLoading, signOut } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

    // Form States
    const [memberId, setMemberId] = useState('');
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState(''); // Title/Position
    const [industry, setIndustry] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [shortIntro, setShortIntro] = useState('');
    const [fullIntro, setFullIntro] = useState('');
    const [services, setServices] = useState<string[]>(['', '', '']);
    const [hashtags, setHashtags] = useState<string[]>(['', '', '']);
    const [links, setLinks] = useState<MemberLink[]>([
        { type: 'website', url: '', icon: 'website' },
        { type: 'facebook', url: '', icon: 'facebook' },
        { type: 'instagram', url: '', icon: 'instagram' },
        { type: 'line', url: '', icon: 'line' },
        { type: 'linkedin', url: '', icon: 'linkedin' }
    ]);

    // Photo
    const [photo, setPhoto] = useState('');
    const [photoPosition, setPhotoPosition] = useState('center');
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    // Track if there are unsaved changes
    const [hasChanges, setHasChanges] = useState(false);

    // Helper to update state and mark as dirty
    const updateField = (setter: (val: any) => void, value: any) => {
        setter(value);
        setHasChanges(true);
        if (message?.type === 'success') setMessage(null);
    };

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }
        if (user) {
            fetchMemberData();
        }
    }, [user, authLoading, navigate]);

    const fetchMemberData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // 1. Check if current user is Admin
            const { data: currentUserData } = await supabase
                .from('members')
                .select('is_admin')
                .eq('user_id', user.id)
                .single();

            const isAdmin = currentUserData?.is_admin === true;

            // 2. Check URL params for target ID
            const searchParams = new URLSearchParams(window.location.search);
            const targetId = searchParams.get('id');

            let query = supabase.from('members').select('*');

            if (targetId && isAdmin) {
                // Admin editing another member by ID
                query = query.eq('id', targetId);
            } else {
                // Normal user editing self
                query = query.eq('user_id', user.id);
            }

            const { data, error } = await query.single();

            if (error) throw error;
            if (data) {
                const m = data as Member;
                setMemberId(m.id.toString());
                setName(m.name);
                setCompany(m.company || '');
                setPosition(m.position || m.title || '');
                setIndustry(m.industry || '');
                setShortIntro(m.shortIntro || '');
                setFullIntro(m.fullIntro || '');
                setPhoto((m.photo || '').trim());
                setPhotoPosition(m.photoPosition || 'center');
                setPhone(m.phone || '');
                setEmail(m.email || '');

                // Handle Arrays
                if (m.category) {
                    const loadedCats = m.category.split(',').map(c => c.trim()).filter(Boolean);
                    const normalizedCats = loadedCats.map(c => {
                        if (CATEGORIES.includes(c)) return c;
                        const stripped = c.replace('生態圈', '');
                        if (CATEGORIES.includes(stripped)) return stripped;
                        return c;
                    });
                    setSelectedCategories(normalizedCats);
                }
                if (m.services && Array.isArray(m.services)) {
                    setServices([...m.services, '', '', ''].slice(0, 3));
                }
                if (m.hashtags && Array.isArray(m.hashtags)) {
                    setHashtags([...m.hashtags, '', '', ''].slice(0, 3));
                }

                // Handle Links
                const newLinks = [...links];
                if (m.links) {
                    if (Array.isArray(m.links)) {
                        m.links.forEach(l => {
                            const idx = newLinks.findIndex(nl => nl.type === l.type);
                            if (idx !== -1) newLinks[idx].url = l.url;
                        });
                    } else if (typeof m.links === 'object') {
                        Object.entries(m.links).forEach(([key, url]) => {
                            const idx = newLinks.findIndex(nl => nl.type === key);
                            if (idx !== -1) newLinks[idx].url = url as string;
                        });
                    }
                }
                setLinks(newLinks);

                // After initial load, we have no changes
                setHasChanges(false);
            }
        } catch (err: any) {
            console.error('Error fetching member:', err);
            if (err.code === 'PGRST116' || err.code === '406' || err.status === 406) {
                navigate('/login');
                return;
            }
            setMessage({ text: '無法載入會員資料', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (file.size > 50 * 1024 * 1024) {
                setMessage({ text: '圖片原始大小不能超過 50MB', type: 'error' });
                return;
            }

            try {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    initialQuality: 0.8
                };

                const compressedFile = await imageCompression(file, options);
                setPhotoFile(compressedFile);
                setPreviewUrl(URL.createObjectURL(compressedFile));
                setHasChanges(true); // Mark as dirty
                if (message?.type === 'success') setMessage(null);
            } catch (error) {
                console.error('Compression error:', error);
                setMessage({ text: '圖片處理失敗，請重試', type: 'error' });
            }
        }
    };

    const toggleCategory = (cat: string) => {
        const currentIndex = selectedCategories.indexOf(cat);
        let newCategories = [];
        if (currentIndex !== -1) {
            newCategories = selectedCategories.filter(c => c !== cat);
        } else {
            if (selectedCategories.length >= 2) {
                setMessage({ text: '最多只能選擇 2 個產業類別', type: 'error' });
                return;
            }
            newCategories = [...selectedCategories, cat];
        }
        setSelectedCategories(newCategories);
        setHasChanges(true);
        if (message?.type === 'success') setMessage(null);
    };

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);
        setMessage(null);

        try {
            let currentPhotoUrl = photo;

            if (photoFile) {
                const fileExt = photoFile.name.split('.').pop();
                const fileName = `${user.id}-${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('member-photos')
                    .upload(filePath, photoFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('member-photos')
                    .getPublicUrl(filePath);

                currentPhotoUrl = publicUrl;
            }

            const linksObject: { [key: string]: string } = {};
            links.forEach(l => {
                const cleanUrl = sanitizeUrl(l.url);
                if (cleanUrl) linksObject[l.type] = cleanUrl;
            });

            const updates = {
                name: sanitizeText(name, 50),
                company: sanitizeText(company, 100),
                position: sanitizeText(position, 50),
                industry: sanitizeText(industry, 50),
                category: selectedCategories.map(c => sanitizeText(c, 30)).join(','),
                shortIntro: sanitizeText(shortIntro, 200),
                fullIntro: sanitizeText(fullIntro, 3000),
                services: services.filter(s => s.trim()).map(s => sanitizeText(s, 100)),
                hashtags: hashtags.filter(h => h.trim()).map(h => sanitizeText(h, 30)),
                links: linksObject,
                photo: currentPhotoUrl,
                photoPosition,
                phone: sanitizeText(phone, 20),
                email: sanitizeText(email, 100),
                updatedAt: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('members')
                .update(updates)
                .eq('id', memberId);

            if (error) throw error;

            setMessage({ text: '資料儲存成功！', type: 'success' });
            setPhoto(currentPhotoUrl);
            setPhotoFile(null);
            setHasChanges(false); // SUCCESS -> Hide bar

        } catch (err: any) {
            console.error('Error saving:', err);
            setMessage({ text: '儲存失敗：' + err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <div className="min-h-screen text-white flex items-center justify-center">載入中...</div>;

    return (
        <div className="min-h-dvh pt-24 md:pt-32 pb-32 md:pb-12 px-4 container mx-auto max-w-4xl">
            <SEO title="編輯會員資料" noindex />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sticky top-20 z-[40] bg-bg-dark/80 backdrop-blur-lg p-4 -mx-4 rounded-b-2xl border-b border-white/5 md:bg-transparent md:backdrop-blur-none md:border-none md:static md:p-0 md:mx-0">
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                        <button onClick={() => navigate('/members')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0">
                            <ArrowLeft size={20} /> <span className="hidden sm:inline">返回列表</span><span className="sm:hidden text-sm">返回</span>
                        </button>
                        <h1 className="text-xl md:text-2xl font-bold text-white truncate">編輯檔案</h1>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all duration-300 ${hasChanges
                                ? 'bg-primary text-bg-dark shadow-[0_0_20px_rgba(76,168,223,0.3)] hover:scale-105 active:scale-95'
                                : 'bg-white/10 text-gray-400 border border-white/10'
                                } disabled:opacity-50`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>{hasChanges ? '儲存修改' : '已儲存'}</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={async () => { await signOut(); navigate('/'); }}
                            className="flex items-center gap-1 text-red-400 border border-red-400/30 px-4 py-2.5 rounded-full text-sm hover:bg-red-400/10 transition-colors shrink-0"
                            title="登出"
                        >
                            <LogOut size={16} /> <span className="hidden sm:inline">登出</span>
                        </button>
                    </div>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className={`fixed top-24 md:top-24 left-1/2 z-[60] w-[90%] max-w-lg p-4 rounded-xl flex items-center gap-3 shadow-2xl backdrop-blur-md border ${message.type === 'error'
                            ? 'bg-red-900/90 text-red-100 border-red-500/50'
                            : 'bg-green-900/90 text-green-100 border-green-500/50'
                            }`}
                    >
                        <AlertCircle size={24} className="flex-shrink-0" />
                        <span className="font-medium">{message.text}</span>
                        <button onClick={() => setMessage(null)} className="ml-auto p-1 hover:bg-white/20 rounded-full">
                            <X size={16} />
                        </button>
                    </motion.div>
                )}

                {/* Main Form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left Column: Photo & Basic Info */}
                    <div className="space-y-6 md:col-span-1">
                        <div className="bg-bg-dark/80 backdrop-blur border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-primary mb-4">大頭貼</h3>

                            <div className="aspect-square rounded-full border-4 border-primary/30 overflow-hidden relative group mb-4 bg-black">
                                <img
                                    src={previewUrl || (photo ? photo.trim() : '') || '/images/assets/logo/白色正方形logo.png'}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    style={{ objectPosition: photoPosition }}
                                />
                                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-opacity cursor-pointer md:opacity-0">
                                    <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
                                    <div className="text-center text-white">
                                        <Camera className="mx-auto mb-1" />
                                        <span className="text-xs">更換照片</span>
                                    </div>
                                </label>
                            </div>
                            <label className="md:hidden flex items-center justify-center gap-2 w-full py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-gray-300 active:bg-primary/20 active:text-primary transition-colors cursor-pointer mb-4">
                                <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
                                <Camera size={16} />
                                <span>更換大頭貼</span>
                            </label>

                            <div className="mb-4">
                                <label className="block text-gray-400 text-xs mb-1">照片位置</label>
                                <select
                                    value={photoPosition}
                                    onChange={(e) => updateField(setPhotoPosition, e.target.value)}
                                    className="w-full bg-black/30 border border-white/20 rounded-lg p-2 text-sm text-white focus:border-primary focus:outline-none"
                                >
                                    <option value="top">上方 (Top)</option>
                                    <option value="center">居中 (Center)</option>
                                    <option value="bottom">下方 (Bottom)</option>
                                </select>
                            </div>

                            <div className="text-center">
                                <p className="text-xl font-bold text-white mb-1">{name || '您的名字'}</p>
                                <p className="text-sm text-primary">{industry || '行業別'}</p>
                                <div className="mt-2 inline-block px-3 py-1 bg-white/10 rounded-full text-xs text-gray-400">
                                    會員編號: {memberId || '-'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Detailed Info */}
                    <div className="space-y-6 md:col-span-2">

                        {/* Basic Info Section */}
                        <div className="bg-bg-dark/80 backdrop-blur border border-white/10 rounded-2xl p-6 md:p-8">
                            <h2 className="text-xl font-bold text-primary mb-6 border-b border-white/10 pb-4">📝 基本資料</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">真實姓名</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => updateField(setName, e.target.value)}
                                        className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-base text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 mb-2 font-medium">公司名稱</label>
                                        <input
                                            type="text"
                                            value={company}
                                            onChange={(e) => updateField(setCompany, e.target.value)}
                                            className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-base text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2 font-medium">職稱</label>
                                        <input
                                            type="text"
                                            value={position}
                                            onChange={(e) => updateField(setPosition, e.target.value)}
                                            className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-base text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 mb-2 font-medium">聯絡電話</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => updateField(setPhone, e.target.value)}
                                            placeholder="例：0912-345-678"
                                            className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-base text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2 font-medium">公開信箱</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => updateField(setEmail, e.target.value)}
                                            placeholder="例：name@example.com"
                                            className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-base text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">
                                        產業類別 (已選 {selectedCategories.length}/2)
                                    </label>

                                    {/* Selected Tags Display */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {selectedCategories.map(cat => (
                                            <span key={cat} className="px-3 py-1 bg-primary text-bg-dark font-bold rounded-full text-sm flex items-center gap-2">
                                                {cat}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCategory(cat)}
                                                    className="hover:text-white focus:outline-none cursor-pointer"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap gap-2 relative z-20">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => toggleCategory(cat)}
                                                className={`px-3 py-1.5 rounded-full text-sm border transition-all cursor-pointer ${selectedCategories.includes(cat)
                                                    ? 'bg-primary text-bg-dark border-primary font-bold shadow-[0_0_15px_rgba(76,168,223,0.3)]'
                                                    : 'bg-transparent text-gray-400 border-white/20 hover:border-white/50 hover:text-white'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Intro Section */}
                        <div className="bg-bg-dark/80 backdrop-blur border border-white/10 rounded-2xl p-6 md:p-8">
                            <h2 className="text-xl font-bold text-primary mb-6 border-b border-white/10 pb-4">📣 自我介紹</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">簡短介紹 (列表頁顯示)</label>
                                    <textarea
                                        value={shortIntro}
                                        onChange={(e) => updateField(setShortIntro, e.target.value)}
                                        maxLength={100}
                                        className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-base text-white focus:border-primary focus:outline-none h-24 resize-none"
                                        placeholder="一句話介紹您的專業..."
                                    />
                                    <div className="text-right text-xs text-gray-500">{shortIntro.length}/100</div>
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">完整介紹 (詳細頁顯示)</label>
                                    <textarea
                                        value={fullIntro}
                                        onChange={(e) => updateField(setFullIntro, e.target.value)}
                                        className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-base text-white focus:border-primary focus:outline-none h-48"
                                        placeholder="詳細說明您的服務內容、經歷與優勢..."
                                    />
                                    <p className="mt-2 text-xs text-primary/70 leading-relaxed italic">
                                        💡 <strong>AI 搜尋優化小提醒：</strong>建議使用自然語言描述。例如：「我是一位專門協助電商企業處理節稅問題的專業會計師...」這能幫助 AI 搜尋引擎 (如 ChatGPT/Perplexity) 更精準地將您推薦給目標客戶。
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Services & Hashtags */}
                        <div className="bg-bg-dark/80 backdrop-blur border border-white/10 rounded-2xl p-6 md:p-8">
                            <h2 className="text-xl font-bold text-primary mb-6 border-b border-white/10 pb-4">✨ 服務與標籤</h2>

                            <div className="mb-6">
                                <label className="block text-gray-300 mb-2 font-medium">主要服務 (最多3項)</label>
                                <div className="space-y-2">
                                    {services.map((service, idx) => (
                                        <input
                                            key={idx}
                                            type="text"
                                            value={service}
                                            onChange={(e) => {
                                                const newServices = [...services];
                                                newServices[idx] = e.target.value;
                                                updateField(setServices, newServices);
                                            }}
                                            className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-base text-white focus:border-primary focus:outline-none"
                                            placeholder={`服務項目 ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">Hashtags (標籤)</label>
                                <div className="flex gap-2">
                                    {hashtags.map((tag, idx) => (
                                        <div key={idx} className="relative flex-1">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">#</span>
                                            <input
                                                type="text"
                                                value={tag}
                                                onChange={(e) => {
                                                    const newTags = [...hashtags];
                                                    newTags[idx] = e.target.value;
                                                    updateField(setHashtags, newTags);
                                                }}
                                                className="w-full bg-black/30 border border-white/20 rounded-lg p-3 pl-7 text-base text-white focus:border-primary focus:outline-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-bg-dark/80 backdrop-blur border border-white/10 rounded-2xl p-6 md:p-8">
                            <h2 className="text-xl font-bold text-primary mb-6 border-b border-white/10 pb-4">🔗 社群連結</h2>
                            <div className="space-y-3">
                                {links.map((link, idx) => (
                                    <div key={link.type} className="flex gap-2 items-center">
                                        <div className="w-24 text-gray-400 capitalize text-sm font-medium">{link.type}</div>
                                        <input
                                            type="text"
                                            value={link.url}
                                            onChange={(e) => {
                                                const newLinks = [...links];
                                                newLinks[idx].url = e.target.value;
                                                updateField(setLinks, newLinks);
                                            }}
                                            className="flex-1 bg-black/30 border border-white/20 rounded-lg p-3 text-base text-white focus:border-primary focus:outline-none"
                                            placeholder="https://..."
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Actions for Mobile convenience */}
                        <div className="pt-8 flex flex-col gap-4">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all duration-300 ${hasChanges
                                    ? 'bg-primary text-bg-dark shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]'
                                    : 'bg-white/10 text-gray-400'
                                    }`}
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Save size={24} />
                                        <span>儲存所有修改</span>
                                    </>
                                )}
                            </button>

                            {hasChanges && (
                                <button
                                    onClick={() => { fetchMemberData(); setHasChanges(false); }}
                                    className="w-full py-3 text-gray-400 hover:text-white transition-colors text-sm"
                                >
                                    放棄目前修改
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Spacer for bottom nav on mobile */}
                <div className="h-24 md:hidden"></div>
            </motion.div>
        </div>
    );
};

export default MemberEdit;
