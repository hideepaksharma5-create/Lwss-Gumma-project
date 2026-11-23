const http = require('http');
const fs = require('fs');
const path = require('path');

const PREFERRED_PORTS = [3000, 8080, 8000, 5500];
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') {
    reqPath = '/index.html';
  }

  const filePath = path.normalize(path.join(PUBLIC_DIR, reqPath));

  // Security: prevent path traversal out of PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

let portIndex = 0;
function startServer() {
  const port = process.env.PORT || PREFERRED_PORTS[portIndex];
  server.listen(port, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 LWSS Gumma Portal is running!`);
    console.log(`👉 Open: http://localhost:${port}/`);
    console.log(`=================================================\n`);
    console.log(`Press Ctrl+C to stop.`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE' && !process.env.PORT && portIndex < PREFERRED_PORTS.length - 1) {
    console.log(`Port ${PREFERRED_PORTS[portIndex]} is in use or reserved by Windows.`);
    portIndex++;
    console.log(`Retrying on port ${PREFERRED_PORTS[portIndex]}...`);
    setTimeout(startServer, 200);
  } else {
    console.error('Server error:', err);
  }
});

startServer();
