import React, { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { sanitizeText } from '../../lib/sanitize';
import type { ReferralRow } from '../../types/admin';

interface Props {
    open: boolean;
    mode: 'create' | 'edit';
    initial: ReferralRow | null;
    memberNames: string[];
    onClose: () => void;
    onSaved: () => void;
}

const emptyForm = () => ({
    title: '',
    description: '',
    referrer_name: '',
    referee_name: '',
    referrer_story: '',
    referee_story: '',
    metric_amount: '洽談中',
    metric_type: '專案合作',
});

const ReferralFormModal: React.FC<Props> = ({
    open,
    mode,
    initial,
    memberNames,
    onClose,
    onSaved,
}) => {
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;
        setFormError(null);
        if (mode === 'edit' && initial) {
            const m = initial.metrics || {};
            setForm({
                title: initial.title || '',
                description: initial.description || '',
                referrer_name: initial.referrer_name || '',
                referee_name: initial.referee_name || '',
                referrer_story: initial.referrer_story || '',
                referee_story: initial.referee_story || '',
                metric_amount: m.amount ?? '洽談中',
                metric_type: m.type ?? '專案合作',
            });
        } else {
            setForm(emptyForm());
        }
    }, [open, mode, initial]);

    if (!open) return null;

    const setField = (key: keyof ReturnType<typeof emptyForm>, value: string) => {
        setForm((f) => ({ ...f, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const title = sanitizeText(form.title, 200);
        const referrer_name = sanitizeText(form.referrer_name, 50);
        const referee_name = sanitizeText(form.referee_name, 50);
        if (!title || !referrer_name || !referee_name) {
            setFormError('請填寫標題、引薦人與被引薦人姓名');
            return;
        }

        const payload = {
            title,
            description: sanitizeText(form.description, 500),
            referrer_name,
            referee_name,
            referrer_story: sanitizeText(form.referrer_story, 8000),
            referee_story: sanitizeText(form.referee_story, 8000),
            metrics: {
                amount: sanitizeText(form.metric_amount, 80),
                type: sanitizeText(form.metric_type, 80),
            },
        };

        setSaving(true);
        setFormError(null);
        try {
            if (mode === 'create') {
                const { error } = await supabase.from('referrals').insert(payload);
                if (error) throw error;
            } else if (initial?.id) {
                const { error } = await supabase.from('referrals').update(payload).eq('id', initial.id);
                if (error) throw error;
            } else {
                throw new Error('缺少案例 ID');
            }
            onSaved();
            onClose();
        } catch (err: unknown) {
            const msg = err && typeof err === 'object' && 'message' in err ? String((err as Error).message) : '儲存失敗';
            setFormError(msg);
        } finally {
            setSaving(false);
        }
    };

    const sortedNames = [...memberNames].filter(Boolean).sort((a, b) => a.localeCompare(b, 'zh-Hant'));

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="absolute inset-0" aria-hidden onClick={() => !saving && onClose()} />
            <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-bg-dark shadow-2xl max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-bg-dark/95 backdrop-blur z-10">
                    <h2 className="text-lg font-bold text-white">
                        {mode === 'create' ? '新增引薦案例' : '編輯引薦案例'}
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
                    <p className="text-sm text-amber-200/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                        姓名請與「會員」名錄完全一致，引薦頁才會顯示正確頭像與產業。
                    </p>
                    {formError && (
                        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                            {formError}
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-gray-400 text-sm mb-1">案例標題＊</label>
                            <input
                                value={form.title}
                                onChange={(e) => setField('title', e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:border-primary focus:outline-none"
                                placeholder="例：【💼 合作共創新價值】"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-gray-400 text-sm mb-1">簡短描述</label>
                            <input
                                value={form.description}
                                onChange={(e) => setField('description', e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:border-primary focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">引薦人姓名＊</label>
                            <input
                                value={form.referrer_name}
                                onChange={(e) => setField('referrer_name', e.target.value)}
                                list="admin-referrer-names"
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:border-primary focus:outline-none"
                            />
                            <datalist id="admin-referrer-names">
                                {sortedNames.map((n) => (
                                    <option key={n} value={n} />
                                ))}
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">被引薦人姓名＊</label>
                            <input
                                value={form.referee_name}
                                onChange={(e) => setField('referee_name', e.target.value)}
                                list="admin-referee-names"
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:border-primary focus:outline-none"
                            />
                            <datalist id="admin-referee-names">
                                {sortedNames.map((n) => (
                                    <option key={`r-${n}`} value={n} />
                                ))}
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">成效標籤（左）</label>
                            <input
                                value={form.metric_amount}
                                onChange={(e) => setField('metric_amount', e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:border-primary focus:outline-none"
                                placeholder="例：洽談中、兩張合約"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">成效類型（右）</label>
                            <input
                                value={form.metric_type}
                                onChange={(e) => setField('metric_type', e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:border-primary focus:outline-none"
                                placeholder="例：專案合作"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-gray-400 text-sm mb-1">引薦人自述</label>
                            <textarea
                                value={form.referrer_story}
                                onChange={(e) => setField('referrer_story', e.target.value)}
                                rows={4}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:border-primary focus:outline-none resize-y min-h-[100px]"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-gray-400 text-sm mb-1">被引薦人自述</label>
                            <textarea
                                value={form.referee_story}
                                onChange={(e) => setField('referee_story', e.target.value)}
                                rows={4}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:border-primary focus:outline-none resize-y min-h-[100px]"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2 sticky bottom-0 bg-bg-dark pb-1">
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
                            className="flex-1 py-2.5 rounded-lg bg-primary text-bg-dark font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            {saving ? '儲存中…' : '儲存'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReferralFormModal;
