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

const server = http.createServer((req, res) => {
    console.log(`Request: ${req.method} ${req.url}`);

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
