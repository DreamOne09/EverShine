const BASE_URLS = [
    { loc: 'https://evershine.tw/', changefreq: 'weekly', priority: '1.0' },
    { loc: 'https://evershine.tw/bni', changefreq: 'monthly', priority: '0.9' },
    { loc: 'https://evershine.tw/members', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://evershine.tw/referrals', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://evershine.tw/privacy', changefreq: 'yearly', priority: '0.3' },
];

export async function onRequestGet(context) {
    const { request, env } = context;
    const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;
    const primarySiteUrl = env.PRIMARY_SITE_URL || 'https://evershine.tw';

    if (!supabaseUrl || !supabaseAnonKey) {
        return env.ASSETS.fetch(request);
    }

    try {
        const res = await fetch(
            `${supabaseUrl}/rest/v1/members?select=id,name,status&or=(status.is.null,status.eq.active)&order=id.asc`,
            {
                headers: {
                    apikey: supabaseAnonKey,
                    Authorization: `Bearer ${supabaseAnonKey}`,
                    Accept: 'application/json',
                },
            }
        );
        if (!res.ok) {
            return env.ASSETS.fetch(request);
        }
        const rows = await res.json();
        if (!Array.isArray(rows) || rows.length === 0) {
            return env.ASSETS.fetch(request);
        }

        const today = new Date().toISOString().slice(0, 10);
        const lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ];

        for (const u of BASE_URLS) {
            lines.push(
                '  <url>',
                `    <loc>${u.loc}</loc>`,
                `    <lastmod>${today}</lastmod>`,
                `    <changefreq>${u.changefreq}</changefreq>`,
                `    <priority>${u.priority}</priority>`,
                '  </url>'
            );
        }

        for (const m of rows) {
            if (!m || m.id == null || m.name === '系統管理員') continue;
            lines.push(
                '  <url>',
                `    <loc>${primarySiteUrl}/member/${encodeURIComponent(String(m.id))}</loc>`,
                `    <lastmod>${today}</lastmod>`,
                '    <changefreq>monthly</changefreq>',
                '    <priority>0.7</priority>',
                '  </url>'
            );
        }

        lines.push('</urlset>');
        return new Response(lines.join('\n') + '\n', {
            status: 200,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        });
    } catch {
        return env.ASSETS.fetch(request);
    }
}
