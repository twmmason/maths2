const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PROGRESS_FILE = path.join(__dirname, 'progress.json');
const STATIC_DIR = __dirname;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function readProgress() {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  } catch {
    const empty = { xp: 0, streak: 0, lastDate: null, completed: {}, scores: {} };
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(empty, null, 2));
    return empty;
  }
}

function writeProgress(data) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2));
}

function sendJSON(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // API: GET progress
  if (req.method === 'GET' && req.url === '/api/progress') {
    return sendJSON(res, 200, readProgress());
  }

  // API: POST progress
  if (req.method === 'POST' && req.url === '/api/progress') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        writeProgress(data);
        sendJSON(res, 200, { ok: true });
      } catch {
        sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }

  // Static files
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(STATIC_DIR, filePath);

  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    } else {
      res.writeHead(200, { 'Content-Type': mime });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Maths Pathway running at http://localhost:${PORT}`);
});
