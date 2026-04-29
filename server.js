import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import seoRoutes from './seo-routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 8080;
const DIST = path.join(__dirname, 'dist');

console.log('Starting simple node server (v2.0 - SEO Enhanced)...');
console.log(`PORT: ${PORT}`);
console.log(`DIST directory: ${DIST}`);

if (!fs.existsSync(DIST)) {
    console.error('CRITICAL ERROR: DIST folder not found! Build process failed or output directory is wrong.');
    console.log('Current directory contents:', fs.readdirSync(__dirname));
    process.exit(1);
}

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.xml': 'application/xml',
    '.txt': 'text/plain'
};

const indexHtmlCache = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');

function injectSeoMeta(html, routePath) {
    const seo = seoRoutes[routePath];
    if (!seo) return html;

    let result = html;

    result = result.replace(
        /<title>[^<]*<\/title>/,
        `<title>${seo.title}</title>`
    );

    result = result.replace(
        /<meta name="description" content="[^"]*"/,
        `<meta name="description" content="${seo.description}"`
    );

    result = result.replace(
        /<meta name="keywords" content="[^"]*"/,
        `<meta name="keywords" content="${seo.keywords}"`
    );

    result = result.replace(
        /<link rel="canonical" href="[^"]*"/,
        `<link rel="canonical" href="${seo.canonical}"`
    );

    result = result.replace(
        /<meta property="og:url" content="[^"]*"/,
        `<meta property="og:url" content="${seo.canonical}"`
    );

    result = result.replace(
        /<meta property="og:title" content="[^"]*"/,
        `<meta property="og:title" content="${seo.title}"`
    );

    result = result.replace(
        /<meta property="og:description" content="[^"]*"/,
        `<meta property="og:description" content="${seo.description}"`
    );

    result = result.replace(
        /<meta name="twitter:url" content="[^"]*"/,
        `<meta name="twitter:url" content="${seo.canonical}"`
    );

    result = result.replace(
        /<meta name="twitter:title" content="[^"]*"/,
        `<meta name="twitter:title" content="${seo.title}"`
    );

    result = result.replace(
        /<meta name="twitter:description" content="[^"]*"/,
        `<meta name="twitter:description" content="${seo.description}"`
    );

    return result;
}

const NOINDEX_ROUTES = ['/login', '/admin', '/member-edit'];

function injectNoindex(html) {
    return html.replace(
        '</head>',
        '  <meta name="robots" content="noindex, nofollow" />\n</head>'
    );
}

// 正式品牌域名：用於 HTTP→HTTPS 與非品牌域名的標準化 redirect
const PRIMARY_HOST = 'evershine.tw';
// 允許不重新導向（仍視為 HTTPS）的內部網域，避免 Zeabur 健康檢查或內部呼叫被誤導
const ALLOWED_INTERNAL_HOSTS = new Set([
    'localhost',
    '127.0.0.1',
]);

function isHttpsRequest(req) {
    // Zeabur / Cloudflare / 一般反向代理會用 x-forwarded-proto 帶原始協定
    const xfp = (req.headers['x-forwarded-proto'] || '').split(',')[0].trim().toLowerCase();
    if (xfp) return xfp === 'https';
    // node http server 沒走 TLS 時 socket.encrypted 會是 undefined
    return Boolean(req.socket && req.socket.encrypted);
}

function applySecurityHeaders(res) {
    // 強制 HTTPS（瀏覽器一年內自動把 http 升級為 https）。
    // 注意：HSTS 一旦下發很難撤回；先用 1 年但 preload 不開，安全可控。
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    // 防點擊劫持（不允許他站 iframe 嵌入本站）
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    // 防 MIME sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // 跨站來源政策：對外連結僅送出 origin（不漏路徑）
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // 預設關閉危險瀏覽器 API；如未來要用相機/位置可在前端 request 時再 prompt
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
}

const server = http.createServer((req, res) => {
    console.log(`Request: ${req.method} ${req.url}`);

    // 1) 強制 HTTPS：若上游是 http 一律 301 redirect 到 https://evershine.tw 對應路徑
    const hostHeader = (req.headers.host || '').toLowerCase().split(':')[0];
    const isInternal = ALLOWED_INTERNAL_HOSTS.has(hostHeader);
    if (!isInternal && !isHttpsRequest(req)) {
        const targetHost = hostHeader || PRIMARY_HOST;
        res.writeHead(301, {
            Location: `https://${targetHost}${req.url}`,
            'Cache-Control': 'no-cache',
        });
        res.end();
        return;
    }

    // 2) 為所有回應加上安全 headers
    applySecurityHeaders(res);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    let requestPath = decodeURIComponent(req.url.split('?')[0]);

    if (requestPath === '/') {
        requestPath = '/index.html';
    }

    let filePath;
    let extname = path.extname(requestPath);

    if (requestPath.startsWith('/images/') || requestPath.startsWith('/data/')) {
        filePath = path.join(__dirname, 'public', requestPath);
    } else if (!extname) {
        const routePath = requestPath;
        let html = indexHtmlCache;

        if (NOINDEX_ROUTES.some(r => routePath.startsWith(r))) {
            html = injectNoindex(html);
        } else {
            html = injectSeoMeta(html, routePath);
        }

        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
        });
        res.end(html);
        return;
    } else if (requestPath === '/index.html') {
        const html = injectSeoMeta(indexHtmlCache, '/');
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
        });
        res.end(html);
        return;
    } else {
        filePath = path.join(DIST, requestPath);
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                if (path.extname(requestPath)) {
                    console.error(`404 Not Found: ${requestPath}`);
                    res.writeHead(404);
                    res.end(`File not found: ${requestPath}`);
                    return;
                }

                const html = injectSeoMeta(indexHtmlCache, requestPath);
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Cache-Control': 'no-cache'
                });
                res.end(html);
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            const contentType = mimeTypes[extname] || 'application/octet-stream';

            if (requestPath.startsWith('/images/')) {
                res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
            } else if (extname === '.css' || extname === '.js') {
                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            } else {
                res.setHeader('Cache-Control', 'no-cache');
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully started on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Serving Static Files from: ${DIST}`);
    console.log(`SEO routes configured: ${Object.keys(seoRoutes).join(', ')}`);
    console.log('Ready to handle requests!');
});
