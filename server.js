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

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // API: Upload Image
    if (req.method === 'POST' && req.url === '/api/upload-image') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                // Increase listener limit if needed or handle large body
                const data = JSON.parse(body);
                const { image, filename } = data;

                if (!image || !filename) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Missing image or filename' }));
                    return;
                }

                const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                if (!matches || matches.length !== 3) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Invalid base64 data' }));
                    return;
                }

                const buffer = Buffer.from(matches[2], 'base64');

                // Define both public and dist paths
                const targetDirPublic = path.join(__dirname, 'public', 'images', 'members');
                const targetDirDist = path.join(__dirname, 'dist', 'images', 'members');

                // Ensure directories exist
                [targetDirPublic, targetDirDist].forEach(dir => {
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                });

                // Helper to write file
                const writeFile = (dir, filename, content) => {
                    return new Promise((resolve, reject) => {
                        const filePath = path.join(dir, filename);
                        fs.writeFile(filePath, content, (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });
                };

                // Write to both locations
                Promise.allSettled([
                    writeFile(targetDirPublic, filename, buffer),
                    writeFile(targetDirDist, filename, buffer)
                ]).then((results) => {
                    const failed = results.filter(r => r.status === 'rejected');
                    if (failed.length === 2) {
                        console.error('Write error:', failed[0].reason);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, message: 'Failed to write file' }));
                    } else {
                        console.log(`File uploaded: ${filename}`);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, url: `/images/members/${filename}` }));
                    }
                });

            } catch (err) {
                console.error('Upload handling error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Server error' }));
            }
        });
        return;
    }

    // API: Save Member Data
    if (req.method === 'POST' && req.url === '/api/save-member') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const memberData = JSON.parse(body);
                const membersPathPublic = path.join(__dirname, 'public', 'data', 'members.json');
                const membersPathDist = path.join(__dirname, 'dist', 'data', 'members.json');

                // Helper to update members in a file
                const updateFile = (filePath, memberData) => {
                    return new Promise((resolve, reject) => {
                        fs.readFile(filePath, 'utf8', (err, data) => {
                            if (err) {
                                // If dist file doesn't exist, we might want to copy from public or ignore
                                if (filePath.includes('dist') && err.code === 'ENOENT') return resolve();
                                return reject(err);
                            }

                            try {
                                let json = JSON.parse(data);
                                let members = json.members || json; // Handle array or object wrapper

                                // Ensure it's an array if checking members
                                const membersArray = Array.isArray(members) ? members : (json.members || []);
                                const index = membersArray.findIndex(m => m.id === memberData.id);

                                if (index !== -1) {
                                    const currentEditCount = membersArray[index].editCount || 0;
                                    membersArray[index] = {
                                        ...membersArray[index],
                                        ...memberData,
                                        editCount: currentEditCount + 1,
                                        updatedAt: new Date().toISOString()
                                    };

                                    // Create output json structure based on input
                                    const outputJson = Array.isArray(members) ? membersArray : { ...json, members: membersArray };

                                    fs.writeFile(filePath, JSON.stringify(outputJson, null, 2), (writeErr) => {
                                        if (writeErr) return reject(writeErr);
                                        resolve();
                                    });
                                } else {
                                    reject(new Error('Member not found'));
                                }
                            } catch (parseErr) {
                                reject(parseErr);
                            }
                        });
                    });
                };

                // Update both locations
                Promise.allSettled([
                    updateFile(membersPathPublic, memberData),
                    updateFile(membersPathDist, memberData)
                ]).then((results) => {
                    const failed = results.filter(r => r.status === 'rejected');
                    if (failed.length === 2) {
                        // Both failed
                        console.error('Error updating members:', failed[0].reason);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, message: 'Server error saving data' }));
                    } else {
                        // At least one succeeded
                        console.log(`Member ${memberData.name} updated successfully.`);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, message: 'Member updated successfully' }));
                    }
                });

            } catch (parseErr) {
                console.error('Error parsing members.json:', parseErr);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Server error parsing data' }));
            }
        });
    } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid JSON body' }));
    }
});
return; // End request here for API
    }

// Normalize path and decode URL to handle Chinese filenames
let requestPath = decodeURIComponent(req.url.split('?')[0]);

// Default to index.html for root
if (requestPath === '/') {
    requestPath = '/index.html';
}

let filePath;
let extname = path.extname(requestPath);

// Check if request is for public assets (images, data, etc.)
if (requestPath.startsWith('/images/') || requestPath.startsWith('/data/')) {
    // Serve from public folder
    filePath = path.join(__dirname, 'public', requestPath);
} else if (!extname) {
    // If request has no extension (e.g. /about), treat as SPA route and serve index.html
    filePath = path.join(DIST, 'index.html');
    extname = '.html';
} else {
    // Serve from dist folder (built assets)
    filePath = path.join(DIST, requestPath);
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

        // Optimization: Add Cache-Control headers
        // Cache images for 7 days (604800 seconds)
        if (requestPath.startsWith('/images/')) {
            res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
        } else if (extname === '.css' || extname === '.js') {
            // Cache CSS/JS for 1 year (immutable) as they are hashed
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
            // Default no-cache for HTML (to ensure updates are seen)
            res.setHeader('Cache-Control', 'no-cache');
        }

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
