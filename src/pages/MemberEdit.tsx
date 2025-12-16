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

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setMessage({
                text: '❌ 檔案格式錯誤：請選擇圖片檔案（支援 JPG、PNG、GIF、WebP）',
                type: 'error'
            });
            e.target.value = '';
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            setMessage({
                text: `❌ 檔案過大：目前檔案 ${sizeMB}MB，請選擇小於 10MB 的圖片`,
                type: 'error'
            });
            e.target.value = '';
            return;
        }

        // Check if file is too small (likely corrupted)
        if (file.size < 100) {
            setMessage({
                text: '❌ 檔案異常：檔案大小過小，可能已損壞，請選擇其他圖片',
                type: 'error'
            });
            e.target.value = '';
            return;
        }

        // Compression Helper
        const compressImage = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onerror = () => {
                    reject(new Error('檔案讀取失敗：無法讀取此檔案，請確認檔案未損壞'));
                };

                reader.onload = (event) => {
                    if (!event.target?.result) {
                        reject(new Error('檔案內容為空'));
                        return;
                    }

                    const img = new Image();
                    img.src = event.target.result as string;

                    img.onerror = () => {
                        reject(new Error('圖片格式錯誤：此檔案無法被識別為有效的圖片格式，請嘗試其他圖片'));
                    };

                    img.onload = () => {
                        try {
                            // Validate image dimensions
                            if (img.width < 50 || img.height < 50) {
                                reject(new Error('圖片尺寸過小：建議使用至少 200x200 像素的圖片以確保清晰度'));
                                return;
                            }

                            if (img.width > 10000 || img.height > 10000) {
                                reject(new Error('圖片尺寸過大：請使用尺寸小於 10000x10000 的圖片'));
                                return;
                            }

                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');

                            if (!ctx) {
                                reject(new Error('瀏覽器不支援圖片處理功能，請更新瀏覽器或使用其他瀏覽器'));
                                return;
                            }

                            let width = img.width;
                            let height = img.height;
                            const MAX_WIDTH = 800;
                            const MAX_HEIGHT = 800;

                            // Calculate new dimensions while maintaining aspect ratio
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

                            // Use better image smoothing
                            ctx.imageSmoothingEnabled = true;
                            ctx.imageSmoothingQuality = 'high';

                            ctx.drawImage(img, 0, 0, width, height);

                            // Convert to JPEG with 85% quality for good balance
                            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

                            // Validate output
                            if (!dataUrl || dataUrl.length < 100) {
                                reject(new Error('圖片壓縮失敗，請嘗試其他圖片'));
                                return;
                            }

                            resolve(dataUrl);
                        } catch (canvasError: any) {
                            reject(new Error(`圖片處理失敗: ${canvasError.message}`));
                        }
                    };
                };

                reader.readAsDataURL(file);
            });
        };

        try {
            setMessage({ text: '🔄 正在壓縮並上傳圖片...', type: 'success' });
            setLoading(true);

            // Compress image with timeout
            const compressionPromise = compressImage(file);
            const timeoutPromise = new Promise<string>((_, reject) => {
                setTimeout(() => reject(new Error('處理超時：圖片處理時間過長，請嘗試較小的圖片')), 30000);
            });

            const base64 = await Promise.race([compressionPromise, timeoutPromise]);

            // Upload to server
            const res = await fetch('/api/upload-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: base64,
                    filename: `${name.replace(/\s+/g, '_')}_${Date.now()}.jpg`
                })
            });

            if (!res.ok) {
                if (res.status === 413) {
                    throw new Error('檔案過大：壓縮後的檔案仍然過大，請選擇較小的圖片');
                } else if (res.status === 500) {
                    throw new Error('伺服器錯誤：無法儲存圖片，請稍後再試');
                } else {
                    throw new Error(`上傳失敗 (錯誤代碼: ${res.status})，請稍後再試`);
                }
            }

            const data = await res.json();

            if (data.success && data.url) {
                // Add timestamp to force browser to reload the image
                const imageUrl = data.url.startsWith('/') ? data.url : `/${data.url}`;
                const urlWithTimestamp = `${imageUrl}?t=${Date.now()}`;

                console.log('✅ 照片上傳成功:', {
                    originalUrl: data.url,
                    finalUrl: urlWithTimestamp
                });

                setPhoto(imageUrl); // Store without timestamp for saving
                setMessage({ text: '✅ 照片上傳成功！請確認預覽效果', type: 'success' });

                // Auto-clear success message after 3 seconds
                setTimeout(() => {
                    setMessage(null);
                }, 3000);
            } else {
                throw new Error(data.message || '上傳失敗：伺服器未回傳有效的圖片網址');
            }
        } catch (err: any) {
            console.error('Upload error:', err);

            // Provide user-friendly error messages
            let errorMessage = err.message;

            // Network errors
            if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
                errorMessage = '網路連線失敗：請檢查網路連線後重試';
            }

            setMessage({ text: `❌ ${errorMessage}`, type: 'error' });
        } finally {
            setLoading(false);
            // Reset file input to allow re-uploading the same file
            e.target.value = '';
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
                                <label className="block text-gray-300 mb-2">照片上傳</label>
                                <div className="space-y-2">
                                    <div className="p-6 border-2 border-dashed border-white/20 rounded-lg bg-black/20 text-center hover:border-primary/50 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="photo-upload"
                                            disabled={loading}
                                        />
                                        <label htmlFor="photo-upload" className={`cursor-pointer flex flex-col items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            <div className="p-3 bg-primary/20 rounded-full text-primary">
                                                📤
                                            </div>
                                            <span className="text-gray-300 font-medium">點擊選擇照片上傳</span>
                                            <span className="text-xs text-gray-500">支援 JPG, PNG（自動壓縮至 800x800，品質 85%）</span>
                                        </label>
                                    </div>
                                    {photo && (
                                        <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-400">✓</span>
                                                <span className="text-sm text-gray-300">已上傳: <span className="text-primary font-mono text-xs">{photo.split('/').pop()}</span></span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (confirm('確定要移除此照片嗎？')) {
                                                        setPhoto('');
                                                        setMessage({ text: '照片已移除', type: 'success' });
                                                    }
                                                }}
                                                className="text-red-400 hover:text-red-300 text-sm px-2 py-1 hover:bg-red-500/10 rounded transition-colors"
                                            >
                                                🗑️ 移除
                                            </button>
                                        </div>
                                    )}
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
                                    <div className="w-32 h-32 rounded-full border-2 border-primary overflow-hidden relative shadow-lg bg-gray-800">
                                        {photo ? (
                                            <img
                                                key={photo}
                                                src={photo}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                style={{ objectPosition: photoPosition }}
                                                onLoad={() => console.log('✅ 預覽圖片載入成功:', photo)}
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
