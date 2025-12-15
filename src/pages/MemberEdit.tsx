import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

const MemberEdit: React.FC = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [name, setName] = useState('');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
    const [memberData, setMemberData] = useState<any>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [photo, setPhoto] = useState('');
    const [photoPosition, setPhotoPosition] = useState('top');

    const CATEGORIES = [
        "工程裝修",
        "企業行銷",
        "企業顧問",
        "休閒教育",
        "投資理財",
        "美食餐飲",
        "健康美麗",
        "資訊系統"
    ];

    // Form states
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [shortIntro, setShortIntro] = useState('');
    const [fullIntro, setFullIntro] = useState('');
    const [services, setServices] = useState(''); // Added services state
    const [links, setLinks] = useState<any[]>([
        { type: '', url: '' }, { type: '', url: '' }, { type: '', url: '' }
    ]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // Fetch members.json to verify
            const response = await fetch('/data/members.json');
            if (!response.ok) throw new Error('無法讀取會員資料');
            const data = await response.json();

            const member = data.members.find((m: any) => m.name === name);
            if (!member) throw new Error('找不到此會員');

            // In a real app, verify hash. 
            // Here, for client-side restoration without backend, we just verify name exists for now, 
            // OR if we can replicate the hash logic. 
            // The user wants 'restore', implying the 'edit' worked.
            // The pinHash verification requires crypto.subtle.

            const encoder = new TextEncoder();
            const dataBuffer = encoder.encode(pin);
            const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            if (member.pinHash && member.pinHash !== hashHex) {
                throw new Error('PIN 碼錯誤');
            }

            setMemberData(member);
            setCompany(member.company || '');
            setPosition(member.position || '');
            setShortIntro(member.shortIntro || '');
            setFullIntro(member.fullIntro || '');
            setServices(member.services ? member.services.join('\n') : ''); // Updated handleAuth to set services
            setPhoto(member.photo || '');
            setPhotoPosition(member.photoPosition || 'center');

            // Handle categories
            if (member.category) {
                const cats = member.category.split(/[,|、]/).map((c: string) => c.trim()).filter(Boolean);
                setSelectedCategories(cats);
            } else {
                setSelectedCategories([]);
            }

            const currentLinks = member.links || [];
            const newLinks = [...links];
            currentLinks.forEach((l: any, i: number) => {
                if (i < 3) newLinks[i] = { type: l.type, url: l.url };
            });
            setLinks(newLinks);

            setIsAuthenticated(true);
            setMessage({ text: '驗證成功', type: 'success' });
        } catch (err: any) {
            console.error(err);
            setMessage({ text: err.message || '驗證失敗', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Handling Category Toggle
    const toggleCategory = (cat: string) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(prev => prev.filter(c => c !== cat));
        } else {
            if (selectedCategories.length < 2) {
                setSelectedCategories(prev => [...prev, cat]);
            } else {
                alert('最多只能選擇兩個類別');
            }
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Compression Helper
        const compressImage = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target?.result as string;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        if (!ctx) { resolve(img.src); return; }

                        let width = img.width;
                        let height = img.height;
                        const MAX_WIDTH = 800;
                        const MAX_HEIGHT = 800;

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                        resolve(dataUrl);
                    };
                    img.onerror = error => reject(error);
                };
                reader.onerror = error => reject(error);
            });
        };

        try {
            setMessage({ text: '處理中，請稍候...', type: 'success' });
            setLoading(true);

            let base64 = '';
            if (file.size > 1024 * 1024) {
                base64 = await compressImage(file);
            } else {
                base64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.readAsDataURL(file);
                });
            }

            const res = await fetch('/api/upload-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: base64,
                    filename: `${name}_${Date.now()}.jpg`
                })
            });
            const data = await res.json();
            if (data.success) {
                setPhoto(data.url);
                setMessage({ text: '照片上傳成功', type: 'success' });
            } else {
                throw new Error(data.message);
            }
        } catch (err: any) {
            console.error(err);
            setMessage({ text: `上傳失敗: ${err.message}`, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!memberData) {
            setMessage({ text: '會員資料未載入，無法提交。', type: 'error' });
            return;
        }

        setLoading(true);
        setMessage(null);

        // Basic validation
        if (!name || !company) {
            setMessage({ text: '姓名和公司名稱為必填欄位。', type: 'error' });
            setLoading(false);
            return;
        }

        const serviceList = services.split('\n').map(s => s.trim()).filter(Boolean);
        if (serviceList.length > 5) {
            setMessage({ text: '服務項目不能超過 5 項', type: 'error' });
            setLoading(false);
            return;
        }

        const formData = {
            id: memberData.id,
            name: name,
            company: company,
            position: position,
            category: selectedCategories.join(', '),
            title: `${position} - ${company}`,
            shortIntro: shortIntro,
            fullIntro: fullIntro,
            services: services.split('\n').map(s => s.trim()).filter(Boolean), // Updated handleSubmit for services
            photo: photo,
            photoPosition: photoPosition,
            links: links.filter(l => l.type && l.url).map(l => ({ ...l, icon: l.type }))
        };

        try {
            const response = await fetch('/api/save-member', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                setMessage({ text: '更新成功！您的資料已直接更新到伺服器。', type: 'success' });
                // Optional: Reload or redirect
            } else {
                setMessage({ text: '更新失敗：' + result.message, type: 'error' });
            }
        } catch (error) {
            console.error('Submit error:', error);
            setMessage({ text: '網路錯誤，無法送出更新。請確認您的網路連線或稍後再試。', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold text-center mb-8 text-white">會員資料編輯</h1>

            {!isAuthenticated ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-bg-dark/80 backdrop-blur border border-white/10 rounded-2xl p-8"
                >
                    <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">🔐 身份驗證</h2>
                    <form onSubmit={handleAuth} className="space-y-6">
                        <div>
                            <label className="block text-gray-300 mb-2">姓名</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                placeholder="請輸入姓名"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">PIN 碼</label>
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                placeholder="請輸入 PIN 碼"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-dark text-bg-dark font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
                        >
                            {loading ? '驗證中...' : '載入我的資料'}
                        </button>
                    </form>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                >
                    <div className="bg-bg-dark/80 backdrop-blur border border-white/10 rounded-2xl p-8">
                        <h2 className="text-xl font-bold text-primary mb-6 border-b border-white/10 pb-4">💼 基本資料</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">姓名 (唯讀)</label>
                                <input type="text" value={name} disabled className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-400 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">照片 (上傳或網址)</label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={photo}
                                        onChange={(e) => setPhoto(e.target.value)}
                                        placeholder="例如: images/members/您的名字.jpg"
                                        className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    />
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <span className="text-sm text-gray-400 shrink-0">或直接上傳:</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="text-gray-300 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-bg-dark hover:file:bg-primary-dark cursor-pointer w-full"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">上傳後將自動儲存到伺服器並更新上方路徑 (支援 jpg, png, max 5MB)。</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">照片裁切對齊</label>
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
                                    <div className="w-32 h-32 rounded-full border-2 border-primary overflow-hidden relative shadow-lg">
                                        {photo ? (
                                            <img
                                                src={photo}
                                                alt="Preview"
                                                className="w-full h-full object-cover bg-gray-800"
                                                style={{ objectPosition: photoPosition }}
                                                onError={(e) => (e.currentTarget.src = '/images/assets/logo/白色正方形logo.png')}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-500 text-xs text-center p-2">無照片</div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">此預覽模擬在網站上的顯示圓框。</p>
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
                                        <option value="website">官網</option>
                                        <option value="facebook">Facebook</option>
                                        <option value="instagram">Instagram</option>
                                        <option value="linkedin">LinkedIn</option>
                                        <option value="line">LINE</option>
                                        <option value="youtube">YouTube</option>
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
                </motion.div>
            )}

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 p-4 rounded-lg text-center ${message.type === 'error' ? 'bg-red-500/20 text-red-200 border border-red-500/30' : 'bg-green-500/20 text-green-200 border border-green-500/30'}`}
                >
                    {message.text}
                </motion.div>
            )}
        </div>
    );
};

export default MemberEdit;
