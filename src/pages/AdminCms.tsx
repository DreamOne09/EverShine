import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlockNoteViewRaw } from '@blocknote/react';
import { useCreateBlockNote } from '@blocknote/react';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/react/style.css';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Save } from 'lucide-react';
import SEO from '../components/common/SEO';
import { sanitizeText } from '../lib/sanitize';
import { LoadingButton, ModalContentSkeleton, TopProgressBar } from '../components/loading';

const DEFAULT_SLUG = 'site';

/** EverShine 站內深色主題：對齊 bg-dark / primary */
const evershineBnTheme = `
.bn-container[data-color-scheme="dark"] {
  --bn-colors-editor-background: #06203a;
  --bn-colors-editor-text: #f3f4f6;
  --bn-colors-menu-background: #0a2744;
  --bn-colors-menu-text: #e5e7eb;
  --bn-colors-border: rgba(255,255,255,0.12);
  --bn-colors-side-menu: #0a2744;
  --bn-font-family: ui-sans-serif, system-ui, sans-serif;
}
`;

function defaultBlocks() {
    return [
        {
            type: 'paragraph' as const,
            content: '在此編輯站內公告或補充內容…',
        },
    ];
}

const AdminCms: React.FC = () => {
    const { slug: slugParam } = useParams<{ slug: string }>();
    const slug = (slugParam || DEFAULT_SLUG).trim() || DEFAULT_SLUG;
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    const [title, setTitle] = useState('');
    const [pageId, setPageId] = useState<string | null>(null);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
    const [saving, setSaving] = useState(false);

    const editor = useCreateBlockNote(
        {
            initialContent: defaultBlocks(),
        },
        [slug]
    );

    const loadPage = useCallback(async () => {
        if (!user) return;
        setFetching(true);
        setMessage(null);
        try {
            const { data: adminRow } = await supabase
                .from('members')
                .select('is_admin')
                .eq('user_id', user.id)
                .single();

            if (!adminRow?.is_admin) {
                navigate('/');
                return;
            }

            const { data, error } = await supabase.from('cms_pages').select('*').eq('slug', slug).maybeSingle();

            if (error) throw error;

            const blocks = data?.content;
            if (Array.isArray(blocks) && blocks.length > 0) {
                editor.replaceBlocks(editor.document, blocks as Parameters<typeof editor.replaceBlocks>[1]);
            } else {
                editor.replaceBlocks(editor.document, defaultBlocks() as Parameters<typeof editor.replaceBlocks>[1]);
            }
            setTitle(sanitizeText(data?.title || '', 120) || slug);
            setPageId(data?.id ?? null);
        } catch (e) {
            const msg = e instanceof Error ? e.message : '無法載入頁面';
            if (msg.includes('relation') || msg.includes('does not exist')) {
                setMessage({
                    text: '資料表 cms_pages 尚未建立，請在 Supabase 執行 scripts/migration_cms_pages_and_members_unbind.sql',
                    type: 'error',
                });
            } else {
                setMessage({ text: msg, type: 'error' });
            }
        } finally {
            setFetching(false);
        }
    }, [user, slug, navigate, editor]);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/login');
            return;
        }
        loadPage();
    }, [authLoading, user, navigate, loadPage]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        setMessage(null);
        try {
            const payload = {
                slug,
                title: sanitizeText(title, 120) || slug,
                content: editor.document,
                updated_at: new Date().toISOString(),
                updated_by: user.id,
            };

            const { data, error } = await supabase
                .from('cms_pages')
                .upsert(payload, { onConflict: 'slug' })
                .select('id')
                .single();

            if (error) throw error;
            if (data?.id) setPageId(data.id);
            setMessage({ text: '已儲存', type: 'success' });
        } catch (e) {
            setMessage({
                text: e instanceof Error ? e.message : '儲存失敗',
                type: 'error',
            });
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || fetching) {
        return (
            <div className="min-h-dvh pt-24 md:pt-28 px-4 container mx-auto max-w-4xl">
                <SEO title="CMS 編輯" noindex />
                <TopProgressBar active />
                <div className="rounded-2xl border border-white/10 bg-bg-dark/80 p-6 mt-4">
                    <ModalContentSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh pt-24 md:pt-28 pb-16 px-4 container mx-auto max-w-4xl">
            <SEO title="CMS 編輯" noindex />
            <style>{evershineBnTheme}</style>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} /> 返回後台
                </button>
                <LoadingButton
                    type="button"
                    onClick={handleSave}
                    isLoading={saving}
                    loadingLabel="儲存中…"
                    className="bg-primary text-bg-dark px-6 py-3 rounded-xl font-bold hover:bg-primary/90"
                >
                    <>
                        <Save size={18} />
                        儲存
                    </>
                </LoadingButton>
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">CMS（BlockNote）</h1>
            <p className="text-sm text-gray-400 mb-4">
                路徑 slug：<span className="font-mono text-primary">{slug}</span> · 公開預覽：{' '}
                <a href={`/p/${encodeURIComponent(slug)}`} className="text-primary hover:underline" target="_blank" rel="noreferrer">
                    /p/{slug}
                </a>
            </p>

            {message && (
                <div
                    className={`mb-4 p-3 rounded-lg text-sm ${
                        message.type === 'error' ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'
                    }`}
                >
                    {message.text}
                </div>
            )}

            <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-1">頁面標題</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded-lg py-3 px-4 text-white focus:border-primary focus:outline-none"
                    maxLength={120}
                />
            </div>

            <div className="rounded-2xl border border-white/10 overflow-hidden bg-bg-dark/80 min-h-[420px]">
                <BlockNoteViewRaw editor={editor} theme="dark" className="min-h-[400px]" />
            </div>

            {pageId && <p className="text-xs text-gray-500 mt-3 font-mono">頁面 ID: {pageId}</p>}
        </div>
    );
};

export default AdminCms;
