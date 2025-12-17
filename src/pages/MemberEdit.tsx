
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Upload, AlertCircle, X, Camera, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Member } from '../types';

const CATEGORIES = [
    '行銷聯盟', '企業顧問', '工廠改造', '健足教育',
    '工程裝修', '甜點美食', '健康產業'
];

interface MemberLink {
    type: string;
    url: string;
    icon: string;
}

const MemberEdit: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
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
            const { data, error } = await supabase
                .from('members')
                .select('*')
                .eq('user_id', user.id)
                .single();

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

                // Handle Arrays
                if (m.category) {
                    setSelectedCategories(m.category.split(',').map(c => c.trim()).filter(Boolean));
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

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ text: '圖片大小不能超過 5MB', type: 'error' });
                return;
            }
            setPhotoFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const toggleCategory = (cat: string) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(prev => prev.filter(c => c !== cat));
        } else {
            if (selectedCategories.length >= 2) return;
            setSelectedCategories(prev => [...prev, cat]);
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
                .eq('user_id', user.id);

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
        <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => navigate('/members')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} /> 返回列表
                    </button>
                    <h1 className="text-2xl font-bold text-white">編輯個人檔案</h1>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'error' ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'}`}
                    >
                        <AlertCircle size={20} />
                        {message.text}
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
                                        className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        <label className="block text-gray-300 mb-2">職稱</label>
                                        <input
                                            type="text"
                                            value={position}
                                            onChange={(e) => setPosition(e.target.value)}
                                            className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">產業類別 (最多選2項)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => toggleCategory(cat)}
                                                className={`px-3 py-1.5 rounded-full text-sm border transition-all ${selectedCategories.includes(cat)
                                                    ? 'bg-primary text-bg-dark border-primary font-bold'
                                                    : 'bg-transparent text-gray-400 border-white/20 hover:border-white/50'
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
                                        className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:outline-none h-24 resize-none"
                                        placeholder="一句話介紹您的專業..."
                                    />
                                    <div className="text-right text-xs text-gray-500">{shortIntro.length}/100</div>
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">完整介紹 (詳細頁顯示)</label>
                                    <textarea
                                        value={fullIntro}
                                        onChange={(e) => setFullIntro(e.target.value)}
                                        className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:outline-none h-40"
                                        placeholder="詳細說明您的服務內容、經歷與優勢..."
                                    />
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
                                            className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
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
                                                className="w-full bg-black/30 border border-white/20 rounded-lg p-3 pl-7 text-white focus:border-primary focus:outline-none"
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
                                            className="flex-1 bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                            placeholder="https://..."
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                    <button
                        onClick={() => navigate('/members')}
                        className="px-6 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-8 py-3 rounded-lg bg-primary text-bg-dark font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? '儲存中...' : (
                            <>
                                <Save size={20} />
                                儲存變更
                            </>
                        )}
                    </button>
                </div>

            </motion.div>
        </div>
    );
};

export default MemberEdit;
