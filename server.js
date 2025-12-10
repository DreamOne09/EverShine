import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 8080;
const DIST = path.join(__dirname, 'dist');

console.log('Starting simple node server...');
console.log(`PORT: ${PORT}`);
console.log(`DIST directory: ${DIST}`);

if (!fs.existsSync(DIST)) {
    console.error('CRITICAL ERROR: DIST folder not found! Build process failed or output directory is wrong.');
    // List current directory
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
    '.woff': 'font/woff'
};

const server = http.createServer((req, res) => {
    console.log(`Request: ${req.method} ${req.url}`);

    // Normalize path
    let requestPath = req.url.split('?')[0]; // Ignore query string

    // Default to index.html for root
    if (requestPath === '/') {
        requestPath = '/index.html';
    }

    let filePath = path.join(DIST, requestPath);
    let extname = path.extname(filePath);

    // If request has no extension (e.g. /about), treat as SPA route and serve index.html
    // But check if file exists first (maybe it's a file without extension?) - unlikely for web assets
    if (!extname) {
        filePath = path.join(DIST, 'index.html');
        extname = '.html';
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found. 
                // If it was looking for a specific asset (has extension), return 404
                if (path.extname(requestPath)) {
                    console.error(`404 Not Found: ${requestPath}`);
                    res.writeHead(404);
                    res.end(`File not found: ${requestPath}`);
                    return;
                }

                // Otherwise, it's a route, serve index.html (SPA Fallback)
                fs.readFile(path.join(DIST, 'index.html'), (error, indexData) => {
                    if (error) {
                        console.error('Fatal: index.html not found for SPA fallback');
                        res.writeHead(500);
                        res.end('Server Error');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(indexData);
                    }
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            const contentType = mimeTypes[extname] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server successfully started on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📍 GitHub Repo: ${process.env.GITHUB_OWNER || 'Unknown'}/${process.env.GITHUB_REPO || 'Unknown'}`);
    console.log(`🔑 GitHub Token: ${process.env.GITHUB_TOKEN ? '✓ Set' : '✗ Missing'}`);
    console.log(`📂 Serving Static Files from: ${DIST}`);
    console.log('🚀 Ready to handle requests!');
});
