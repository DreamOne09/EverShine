function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

async function fetchMemberBySlug(slug, supabaseUrl, supabaseAnonKey) {
    if (!supabaseUrl || !supabaseAnonKey || !slug) return null;
    const decoded = (() => {
        try {
            return decodeURIComponent(slug).trim();
        } catch {
            return String(slug).trim();
        }
    })();
    if (!decoded) return null;

    const headers = {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Accept: 'application/json',
    };

    const isNumericId = /^\d+$/.test(decoded);
    const baseQuery =
        'select=id,name,industry,company,position,shortIntro,fullIntro,photo,status&or=(status.is.null,status.eq.active)&limit=2';

    try {
        const filter = isNumericId
            ? `id=eq.${encodeURIComponent(decoded)}`
            : `name=eq.${encodeURIComponent(decoded)}`;
        const res = await fetch(`${supabaseUrl}/rest/v1/members?${filter}&${baseQuery}`, { headers });
        if (!res.ok) return null;
        const arr = await res.json();
        const m = Array.isArray(arr) && arr.length === 1 ? arr[0] : null;
        if (!m) return null;
        if (m.status && m.status !== 'active') return null;
        return m;
    } catch {
        return null;
    }
}

function buildMemberSeoMeta(member, primarySiteUrl) {
    const name = escapeHtml(member.name || '');
    const industry = escapeHtml(member.industry || '');
    const company = escapeHtml(member.company || '');
    const positionRaw = member.position || member.title || '';
    const position = escapeHtml(positionRaw);

    const introRaw = (member.shortIntro || member.fullIntro || '')
        .replace(/\\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const introTrimmed = introRaw.length > 180 ? introRaw.slice(0, 180) + '…' : introRaw;
    const description = escapeHtml(
        introTrimmed || `${member.name}｜${member.industry || ''}｜${member.company || ''} — BNI 長輝白金分會獨家專業代表。`
    );

    const title = `${name}｜${industry || '會員'}｜BNI 長輝白金分會`;
    const canonical = `${primarySiteUrl}/member/${String(member.id)}`;
    const keywords = [name, industry, company, position, 'BNI', 'BNI 長輝白金分會', '長輝會員']
        .filter(Boolean)
        .join(', ');

    const rawPhoto = (member.photo || '').trim();
    const ogImage = rawPhoto
        ? rawPhoto.startsWith('http')
            ? rawPhoto
            : `${primarySiteUrl}${rawPhoto.startsWith('/') ? '' : '/'}${rawPhoto}`
        : `${primarySiteUrl}/images/assets/og-evershine-1200.png`;

    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        url: canonical,
        name: `${member.name || ''} — BNI 長輝白金分會`,
        mainEntity: {
            '@type': 'Person',
            '@id': `${canonical}#person`,
            name: member.name || '',
            jobTitle: positionRaw || undefined,
            worksFor: member.company ? { '@type': 'Organization', name: member.company } : undefined,
            memberOf: {
                '@type': 'Organization',
                '@id': `${primarySiteUrl}/#organization`,
                name: 'BNI 長輝白金分會',
                url: `${primarySiteUrl}/`,
            },
            description:
                introTrimmed || `${member.name || ''} — BNI 長輝白金分會（${member.industry || ''}）專業代表`,
            image: ogImage,
            url: canonical,
        },
    };

    return {
        title,
        description,
        canonical,
        keywords,
        ogImage: escapeHtml(ogImage),
        personSchemaJson: JSON.stringify(personSchema),
    };
}

function applyMemberSeoMeta(html, meta) {
    let result = html;
    result = result.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
    result = result.replace(
        /<meta name="description" content="[^"]*"/,
        `<meta name="description" content="${meta.description}"`
    );
    result = result.replace(
        /<meta name="keywords" content="[^"]*"/,
        `<meta name="keywords" content="${meta.keywords}"`
    );
    result = result.replace(
        /<link rel="canonical" href="[^"]*"/,
        `<link rel="canonical" href="${meta.canonical}"`
    );
    result = result.replace(
        /<meta property="og:url" content="[^"]*"/,
        `<meta property="og:url" content="${meta.canonical}"`
    );
    result = result.replace(
        /<meta property="og:title" content="[^"]*"/,
        `<meta property="og:title" content="${meta.title}"`
    );
    result = result.replace(
        /<meta property="og:description" content="[^"]*"/,
        `<meta property="og:description" content="${meta.description}"`
    );
    result = result.replace(
        /<meta property="og:image" content="[^"]*"/,
        `<meta property="og:image" content="${meta.ogImage}"`
    );
    result = result.replace(
        /<meta property="og:image:secure_url" content="[^"]*"/,
        `<meta property="og:image:secure_url" content="${meta.ogImage}"`
    );
    result = result.replace(
        /<meta name="twitter:url" content="[^"]*"/,
        `<meta name="twitter:url" content="${meta.canonical}"`
    );
    result = result.replace(
        /<meta name="twitter:title" content="[^"]*"/,
        `<meta name="twitter:title" content="${meta.title}"`
    );
    result = result.replace(
        /<meta name="twitter:description" content="[^"]*"/,
        `<meta name="twitter:description" content="${meta.description}"`
    );
    result = result.replace(
        /<meta name="twitter:image" content="[^"]*"/,
        `<meta name="twitter:image" content="${meta.ogImage}"`
    );
    if (meta.personSchemaJson) {
        result = result.replace(
            '</head>',
            `  <script type="application/ld+json" data-ssr-member-schema="true">${meta.personSchemaJson}</script>\n</head>`
        );
    }
    return result;
}

export async function onRequestGet(context) {
    const { request, env, params } = context;
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

    // 向 Cloudflare Pages 靜態資產層取得 SPA index.html
    const assetUrl = new URL('/index.html', request.url);
    const baseRes = await env.ASSETS.fetch(assetUrl);
    const baseHtml = await baseRes.text();

    const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;
    const primarySiteUrl = env.PRIMARY_SITE_URL || 'https://evershine.tw';

    const member = await fetchMemberBySlug(slug, supabaseUrl, supabaseAnonKey);
    const headers = new Headers(baseRes.headers);
    headers.set('Content-Type', 'text/html; charset=utf-8');

    if (!member) {
        headers.set('Cache-Control', 'no-cache');
        return new Response(baseHtml, { status: 200, headers });
    }

    const meta = buildMemberSeoMeta(member, primarySiteUrl);
    const html = applyMemberSeoMeta(baseHtml, meta);
    headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
    return new Response(html, { status: 200, headers });
}
