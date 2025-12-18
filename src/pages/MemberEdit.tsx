
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Upload, AlertCircle, X, Camera, ArrowLeft, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import imageCompression from 'browser-image-compression';
import { useAuth } from '../contexts/AuthContext';
import type { Member } from '../types';

const CATEGORIES = [
    '居住與空間工程',
    '企業營運與法稅',
    '金融財富與資產',
    '品牌整合與行銷',
    '數位AI與創新科技',
    '身心健康與醫療',
    '飲食文化與食品',
    '教育學習與休閒',
    '永續發展與製造'
];

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
                // ... (rest of mapping is same)
                setCompany(m.company || '');
                setPosition(m.position || m.title || '');
                setIndustry(m.industry || '');
                setShortIntro(m.shortIntro || '');
                setFullIntro(m.fullIntro || '');
                setPhoto((m.photo || '').trim());
                setPhotoPosition(m.photoPosition || 'center');

                // Handle Arrays
                if (m.category) {
                    const loadedCats = m.category.split(',').map(c => c.trim()).filter(Boolean);
                    // Normalize legacy categories (remove '生態圈' suffix if it matches new list)
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

                // Handle Links (Convert Object/Array to State)
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
            }
        } catch (err: any) {
            console.error('Error fetching member:', err);
            // If no rows found (PGRST116) or Not Acceptable (406), it means user hasn't claimed a profile yet.
            if (err.code === 'PGRST116' || err.code === '406' || err.status === 406) {
                // Redirect to login page which handles claiming
                navigate('/login');
                return;
            }
            setMessage({ text: '無法載入會員資料', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Add import at the top (I'll add it in a separate block if needed, but here I assume I can edit the whole function block and top imports effectively with multi-replace or just careful replacing. Wait, this tool is replace_file_content. I need to add import. I'll do two edits or one big one.)
    // Actually, I should use multi_replace for import + function change. But let's stay simple.
    // I will replace handleFileUpload and add the import in a subsequent or prior call? 
    // No, I can't add import easily without context.
    // Let's assume I will add import in a separate step or I use a larger range.
    // The user wants: 50MB limit + compression.

    // Step 1: Update handleFileUpload to use compression.
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Limit to 50MB before compression
            if (file.size > 50 * 1024 * 1024) {
                setMessage({ text: '圖片原始大小不能超過 50MB', type: 'error' });
                return;
            }

            try {
                // Compress image
                const options = {
                    maxSizeMB: 1, // Compress to ~1MB
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    initialQuality: 0.8
                };

                const compressedFile = await imageCompression(file, options);

                setPhotoFile(compressedFile);
                setPreviewUrl(URL.createObjectURL(compressedFile));
            } catch (error) {
                console.error('Compression error:', error);
                setMessage({ text: '圖片處理失敗，請重試', type: 'error' });
            }
        }
    };

    const toggleCategory = (cat: string) => {
        const currentIndex = selectedCategories.indexOf(cat);
        if (currentIndex !== -1) {
            // Deselect
            const newCategories = selectedCategories.filter(c => c !== cat);
            setSelectedCategories(newCategories);
            setMessage(null);
        } else {
            // Select
            if (selectedCategories.length >= 2) {
                setMessage({ text: '最多只能選擇 2 個產業類別', type: 'error' });
                return;
            }
            setSelectedCategories([...selectedCategories, cat]);
            setMessage(null);
        }
    };

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);
        setMessage(null);

        try {
            let currentPhotoUrl = photo;

            // 1. Upload Photo if changed
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

            // 2. Prepare Links Object
            const linksObject: { [key: string]: string } = {};
            links.forEach(l => {
                if (l.url.trim()) linksObject[l.type] = l.url.trim();
            });

            // 3. Update Database
            const updates = {
                name,
                company,
                position, // Column name is 'position'
                industry,
                category: selectedCategories.join(','),
                shortIntro,
                fullIntro,
                services: services.filter(s => s.trim()),
                hashtags: hashtags.filter(h => h.trim()),
                links: linksObject,
                photo: currentPhotoUrl,
                photoPosition,
                updatedAt: new Date().toISOString(),
                editCount: 1 // Increment or set to 1 to show edited
            };

            const { error } = await supabase
                .from('members')
                .update(updates)
                .eq('id', memberId); // Update by Primary Key ID

            if (error) throw error;

            setMessage({ text: '資料儲存成功！', type: 'success' });
            setPhoto(currentPhotoUrl);
            setPhotoFile(null); // Reset file input

        } catch (err: any) {
            console.error('Error saving:', err);
            setMessage({ text: '儲存失敗：' + err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <div className="min-h-screen text-white flex items-center justify-center">載入中...</div>;

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-32 md:pb-12 px-4 container mx-auto max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8 relative z-10 mt-8 md:mt-0">
                    <button onClick={() => navigate('/members')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <ArrowLeft size={20} /> <span className="hidden sm:inline">返回列表</span><span className="sm:hidden">返回</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg md:text-2xl font-bold text-white">編輯檔案</h1>
                        <button
                            onClick={async () => { await signOut(); navigate('/'); }}
                            className="md:hidden flex items-center gap-1 text-red-400 border border-red-400/30 px-3 py-1.5 rounded-full text-xs hover:bg-red-400/10 transition-colors"
                        >
                            <LogOut size={14} /> 登出
                        </button>
                    </div>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className={`fixed top-28 md:top-24 left-1/2 z-50 w-[90%] max-w-lg p-4 rounded-xl flex items-center gap-3 shadow-2xl backdrop-blur-md border ${message.type === 'error'
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
                                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
                                    <div className="text-center text-white">
                                        <Camera className="mx-auto mb-1" />
                                        <span className="text-xs">更換照片</span>
                                    </div>
                                </label>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-400 text-xs mb-1">照片位置</label>
                                <select
                                    value={photoPosition}
                                    onChange={(e) => setPhotoPosition(e.target.value)}
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
                                    <label className="block text-gray-300 mb-2">真實姓名</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-base text-white focus:border-primary focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 mb-2">公司名稱</label>
                                        <input
                                            type="text"
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                            className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-base text-white focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">職稱</label>
                                        <input
                                            type="text"
                                            value={position}
                                            onChange={(e) => setPosition(e.target.value)}
                                            className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-base text-white focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">
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
                                                    className="hover:text-white focus:outline-none"
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
                                                    ? 'bg-primary text-bg-dark border-primary font-bold'
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
                                    <label className="block text-gray-300 mb-2">簡短介紹 (列表頁顯示)</label>
                                    <textarea
                                        value={shortIntro}
                                        onChange={(e) => setShortIntro(e.target.value)}
                                        maxLength={100}
                                        className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-base text-white focus:border-primary focus:outline-none h-24 resize-none"
                                        placeholder="一句話介紹您的專業..."
                                    />
                                    <div className="text-right text-xs text-gray-500">{shortIntro.length}/100</div>
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">完整介紹 (詳細頁顯示)</label>
                                    <textarea
                                        value={fullIntro}
                                        onChange={(e) => setFullIntro(e.target.value)}
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
                                <label className="block text-gray-300 mb-2">主要服務 (最多3項)</label>
                                <div className="space-y-2">
                                    {services.map((service, idx) => (
                                        <input
                                            key={idx}
                                            type="text"
                                            value={service}
                                            onChange={(e) => {
                                                const newServices = [...services];
                                                newServices[idx] = e.target.value;
                                                setServices(newServices);
                                            }}
                                            className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-base text-white focus:border-primary focus:outline-none"
                                            placeholder={`服務項目 ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2">Hashtags (標籤)</label>
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
                                                    setHashtags(newTags);
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
                                        <div className="w-24 text-gray-400 capitalize text-sm">{link.type}</div>
                                        <input
                                            type="text"
                                            value={link.url}
                                            onChange={(e) => {
                                                const newLinks = [...links];
                                                newLinks[idx].url = e.target.value;
                                                setLinks(newLinks);
                                            }}
                                            className="flex-1 bg-black/30 border border-white/20 rounded-lg p-3 text-base text-white focus:border-primary focus:outline-none"
                                            placeholder="https://..."
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions - Sticky on Mobile */}
                <div className="fixed bottom-[74px] left-0 right-0 p-4 bg-bg-dark/95 backdrop-blur-xl border-t border-white/10 z-[100] flex justify-end gap-3 md:static md:bg-transparent md:border-0 md:p-0 md:pt-4 md:border-t-0">
                    <button
                        onClick={() => navigate('/members')}
                        className="px-6 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-8 py-3 rounded-lg bg-primary text-bg-dark font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                        {loading ? '儲存中...' : (
                            <>
                                <Save size={20} />
                                儲存變更
                            </>
                        )}
                    </button>
                </div>

                <div className="h-20 md:hidden"></div> {/* Extra space for overlap prevention */}

                {/* Floating Save Button - Only for Mobile */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="md:hidden fixed bottom-24 right-6 z-[60] flex items-center justify-center w-14 h-14 bg-primary text-bg-dark rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-50"
                    title="儲存變更"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-bg-dark/30 border-t-bg-dark rounded-full animate-spin" />
                    ) : (
                        <Save size={24} />
                    )}
                </button>

            </motion.div>
        </div>
    );
};

export default MemberEdit;
