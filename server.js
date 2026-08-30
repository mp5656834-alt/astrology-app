/**
 * PROPHECY — Local Development & Full-Stack Server
 * Serves static frontend assets and handles /api/send-report requests
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const sendReportHandler = require('./api/send-report.js');

const PORT = process.env.PORT || 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

const server = http.createServer(async (req, res) => {
  // Handle API routes
  if (req.url.startsWith('/api/send-report')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        req.body = body ? JSON.parse(body) : {};
      } catch (e) {
        req.body = {};
      }

      // Emulate express/vercel response methods
      const vercelRes = {
        statusCode: 200,
        headers: {},
        setHeader(k, v) { res.setHeader(k, v); this.headers[k] = v; return this; },
        status(code) { this.statusCode = code; res.statusCode = code; return this; },
        json(data) {
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(this.statusCode);
          res.end(JSON.stringify(data));
          return this;
        },
        end(data) {
          res.writeHead(this.statusCode);
          res.end(data);
          return this;
        }
      };

      try {
        await sendReportHandler(req, vercelRes);
      } catch (err) {
        console.error('[API Error]', err);
        vercelRes.status(500).json({ error: 'Internal server error: ' + err.message });
      }
    });
    return;
  }

  // Handle Static Files
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

function startServer(port) {
  server.listen(port, () => {
    console.log(`✨ PROPHECY server is active at http://localhost:${port}/#get-started`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);
