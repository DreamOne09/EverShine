import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { sanitizeText } from '../../lib/sanitize';
import { siteConfig } from '../../config/site.config';

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}

const AdminMemberModal: React.FC<Props> = ({ open, onClose, onCreated }) => {
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [industry, setIndustry] = useState(siteConfig.industries[0] ?? '');
    const [position, setPosition] = useState('');
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    if (!open) return null;

    const reset = () => {
        setName('');
        setCompany('');
        setIndustry(siteConfig.industries[0] ?? '');
        setPosition('');
        setFormError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanName = sanitizeText(name, 50);
        if (!cleanName) {
            setFormError('請填寫姓名');
            return;
        }
        setSaving(true);
        setFormError(null);
        try {
            const cleanCompany = sanitizeText(company, 100) || '待補充';
            const cleanIndustry = sanitizeText(industry, 50) || '未分類';
            const cleanPosition = sanitizeText(position, 50);

            const payload: Record<string, unknown> = {
                name: cleanName,
                company: cleanCompany,
                industry: cleanIndustry,
                photo: siteConfig.defaultPhoto,
                shortIntro: '',
                fullIntro: '',
                services: [],
                hashtags: [],
                links: {},
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            if (cleanPosition) {
                payload.position = cleanPosition;
                payload.title = cleanPosition;
            }

            const { data, error } = await supabase.from('members').insert(payload).select('id').single();

            if (error) throw error;
            reset();
            onCreated();
            onClose();
            const id = data?.id;
            if (id != null && window.confirm(`已新增「${cleanName}」。要立即開啟完整編輯頁嗎？`)) {
                window.location.href = `/member-edit?id=${encodeURIComponent(String(id))}`;
            }
        } catch (err: unknown) {
            const msg = err && typeof err === 'object' && 'message' in err ? String((err as Error).message) : '新增失敗';
            setFormError(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div
                className="absolute inset-0"
                aria-hidden
                onClick={() => !saving && onClose()}
            />
            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-bg-dark shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <UserPlus className="text-primary" size={22} />
                        新增會員
                    </h2>
                    <button
                        type="button"
                        onClick={() => !saving && onClose()}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400"
                        aria-label="關閉"
                    >
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <p className="text-sm text-gray-400">
                        先填基本資料即可建立；建立後建議到編輯頁補齊介紹、連結與照片。
                    </p>
                    {formError && (
                        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                            {formError}
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">姓名＊</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:border-primary focus:outline-none"
                            placeholder="與名片相同"
                            required
                            maxLength={50}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">公司</label>
                        <input
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:border-primary focus:outline-none"
                            placeholder="可稍後再補"
                            maxLength={100}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">產業類別</label>
                        <select
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:border-primary focus:outline-none"
                        >
                            {siteConfig.industries.map((ind) => (
                                <option key={ind} value={ind} className="bg-bg-dark">
                                    {ind}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">職稱</label>
                        <input
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:border-primary focus:outline-none"
                            placeholder="例：總經理"
                            maxLength={50}
                        />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => !saving && onClose()}
                            className="flex-1 py-2.5 rounded-lg border border-white/20 text-gray-300 hover:bg-white/5"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-2.5 rounded-lg bg-primary text-bg-dark font-bold hover:bg-primary/90 disabled:opacity-50"
                        >
                            {saving ? '建立中…' : '建立會員'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminMemberModal;
