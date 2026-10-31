import seoRoutes from '../seo-routes.js';

const NOINDEX_PREFIXES = ['/login', '/admin', '/member-edit'];

function injectSeoMeta(html, routePath) {
    const seo = seoRoutes[routePath];
    if (!seo) return html;

    let result = html;
    result = result.replace(/<title>[^<]*<\/title>/, `<title>${seo.title}</title>`);
    result = result.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${seo.description}"`);
    result = result.replace(/<meta name="keywords" content="[^"]*"/, `<meta name="keywords" content="${seo.keywords}"`);
    result = result.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${seo.canonical}"`);
    result = result.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${seo.canonical}"`);
    result = result.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${seo.title}"`);
    result = result.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${seo.description}"`);
    result = result.replace(/<meta name="twitter:url" content="[^"]*"/, `<meta name="twitter:url" content="${seo.canonical}"`);
    result = result.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${seo.title}"`);
    result = result.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${seo.description}"`);
    return result;
}

function injectNoindex(html) {
    return html.replace(
        '</head>',
        '  <meta name="robots" content="noindex, nofollow" />\n</head>'
    );
}

export async function onRequest(context) {
    const { request, next } = context;
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, '') || '/';

    // 靜態資源、檔案副檔名、或已由專屬 Function 處理的路由直接放行
    if (
        pathname.startsWith('/assets/') ||
        pathname.startsWith('/images/') ||
        pathname.startsWith('/data/') ||
        pathname.startsWith('/member/') ||
        pathname === '/sitemap.xml' ||
        pathname === '/robots.txt' ||
        /\.[a-zA-Z0-9]+$/.test(pathname)
    ) {
        return next();
    }

    const response = await next();
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
        return response;
    }

    let html = await response.text();
    const headers = new Headers(response.headers);

    if (NOINDEX_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
        html = injectNoindex(html);
        headers.set('X-Robots-Tag', 'noindex, nofollow');
        headers.set('Cache-Control', 'no-store');
        return new Response(html, { status: response.status, headers });
    }

    if (seoRoutes[pathname]) {
        html = injectSeoMeta(html, pathname);
    }

    return new Response(html, { status: response.status, headers });
}
