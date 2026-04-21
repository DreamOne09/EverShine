import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlockNoteViewRaw } from '@blocknote/react';
import { useCreateBlockNote } from '@blocknote/react';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/react/style.css';
import { supabase } from '../lib/supabase';
import SEO from '../components/common/SEO';
import { ArrowLeft } from 'lucide-react';
import { ModalContentSkeleton, TopProgressBar } from '../components/loading';

const evershineBnTheme = `
.bn-container[data-color-scheme="dark"] {
  --bn-colors-editor-background: #06203a;
  --bn-colors-editor-text: #f3f4f6;
  --bn-colors-menu-background: #0a2744;
  --bn-colors-menu-text: #e5e7eb;
  --bn-colors-border: rgba(255,255,255,0.12);
  --bn-colors-side-menu: #0a2744;
}
`;

const CmsPageView: React.FC = () => {
    const { slug: slugParam } = useParams<{ slug: string }>();
    const slug = (slugParam || 'site').trim() || 'site';
    const [title, setTitle] = useState('');
    const [ready, setReady] = useState(false);
    const [missing, setMissing] = useState(false);

    const editor = useCreateBlockNote(
        {
            initialContent: [{ type: 'paragraph', content: '' }],
        },
        [slug]
    );

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setReady(false);
            setMissing(false);
            const { data, error } = await supabase.from('cms_pages').select('title, content').eq('slug', slug).maybeSingle();
            if (cancelled) return;
            if (error) {
                setMissing(true);
                return;
            }
            if (!data) {
                setMissing(true);
                return;
            }
            setTitle(data.title || slug);
            const blocks = data.content;
            if (Array.isArray(blocks) && blocks.length > 0) {
                editor.replaceBlocks(editor.document, blocks as Parameters<typeof editor.replaceBlocks>[1]);
            }
            setReady(true);
        })();
        return () => {
            cancelled = true;
        };
    }, [slug, editor]);

    if (missing) {
        return (
            <div className="min-h-dvh pt-28 pb-16 px-4 container mx-auto max-w-2xl text-center">
                <SEO title="頁面不存在" />
                <p className="text-gray-400 mb-6">找不到此頁面內容，或尚未發佈。</p>
                <Link to="/" className="text-primary hover:underline inline-flex items-center gap-2">
                    <ArrowLeft size={18} /> 返回首頁
                </Link>
            </div>
        );
    }

    if (!ready) {
        return (
            <div className="min-h-dvh pt-24 md:pt-28 px-4 container mx-auto max-w-3xl">
                <SEO title={title || '內容頁'} />
                <TopProgressBar active />
                <div className="rounded-2xl border border-white/10 bg-bg-dark/80 p-6 mt-4">
                    <ModalContentSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh pt-24 md:pt-28 pb-16 px-4 container mx-auto max-w-3xl">
            <SEO title={title} />
            <style>{evershineBnTheme}</style>
            <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm mb-6">
                <ArrowLeft size={18} /> 返回首頁
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">{title}</h1>
            <div className="rounded-2xl border border-white/10 overflow-hidden bg-bg-dark/80">
                <BlockNoteViewRaw editor={editor} theme="dark" editable={false} />
            </div>
        </div>
    );
};

export default CmsPageView;
