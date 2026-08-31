const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const STATIC_DIR = __dirname;

// Profiles live in ~/.maths-pathway/profiles/ so they survive rebuilds
const PROFILES_DIR = path.join(require('os').homedir(), '.maths-pathway', 'profiles');
fs.mkdirSync(PROFILES_DIR, { recursive: true });

function profilePath(id) { return path.join(PROFILES_DIR, id + '.json'); }

function listProfiles() {
  try {
    return fs.readdirSync(PROFILES_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        try {
          const data = JSON.parse(fs.readFileSync(path.join(PROFILES_DIR, f), 'utf8'));
          return { id: f.replace('.json', ''), name: data.name || 'Unknown', xp: data.xp || 0, lastDate: data.lastDate || null };
        } catch { return null; }
      })
      .filter(Boolean);
  } catch { return []; }
}

function createProfile(id, name) {
  const data = {
    id, name, xp: 0, streak: 0, lastDate: null,
    completed: {}, scores: {}, mastery: {},
    teachCount: 0, reviewCursor: 0, taughtOrder: [],
    createdAt: new Date().toISOString()
  };
  fs.writeFileSync(profilePath(id), JSON.stringify(data, null, 2));
  return data;
}

function readProgress(id) {
  // Try profile-based storage first
  if (id) {
    try { return JSON.parse(fs.readFileSync(profilePath(id), 'utf8')); } catch {}
  }
  // Legacy fallback
  const legacyPath = path.join(__dirname, 'progress.json');
  try { return JSON.parse(fs.readFileSync(legacyPath, 'utf8')); } catch {}
  return null;
}

function writeProgress(id, data) {
  if (id) {
    fs.writeFileSync(profilePath(id), JSON.stringify(data, null, 2));
  }
}

// Load Gemini API key from .env
const ENV_FILE = path.join(__dirname, '..', '.env');
let GEMINI_API_KEY = '';
try {
  const envContent = fs.readFileSync(ENV_FILE, 'utf8');
  const match = envContent.match(/GEMINI_API_KEY=(.+)/);
  if (match) GEMINI_API_KEY = match[1].trim();
} catch {}
const GEMINI_MODEL = 'gemini-3.7-flash';

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function sendJSON(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise(resolve => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body));
  });
}

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // ── Profile APIs ──

  // GET /api/profiles — list all profiles
  if (req.method === 'GET' && req.url === '/api/profiles') {
    return sendJSON(res, 200, { profiles: listProfiles() });
  }

  // POST /api/profiles — create a new profile
  if (req.method === 'POST' && req.url === '/api/profiles') {
    try {
      const { name } = JSON.parse(await readBody(req));
      if (!name || !name.trim()) return sendJSON(res, 400, { error: 'Name required' });
      const id = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      if (!id) return sendJSON(res, 400, { error: 'Invalid name' });
      // Check if profile already exists
      if (fs.existsSync(profilePath(id))) {
        return sendJSON(res, 200, { profile: readProgress(id), existed: true });
      }
      const profile = createProfile(id, name.trim());
      return sendJSON(res, 201, { profile });
    } catch { return sendJSON(res, 400, { error: 'Invalid JSON' }); }
  }

  // GET /api/profiles/:id — load a specific profile
  const profileMatch = req.url.match(/^\/api\/profiles\/([a-z0-9-]+)$/);
  if (req.method === 'GET' && profileMatch) {
    const data = readProgress(profileMatch[1]);
    if (!data) return sendJSON(res, 404, { error: 'Profile not found' });
    return sendJSON(res, 200, data);
  }

  // POST /api/profiles/:id — save progress to a specific profile
  if (req.method === 'POST' && profileMatch) {
    try {
      const data = JSON.parse(await readBody(req));
      writeProgress(profileMatch[1], data);
      return sendJSON(res, 200, { ok: true });
    } catch { return sendJSON(res, 400, { error: 'Invalid JSON' }); }
  }

  // DELETE /api/profiles/:id — delete a profile
  if (req.method === 'DELETE' && profileMatch) {
    try {
      fs.unlinkSync(profilePath(profileMatch[1]));
      return sendJSON(res, 200, { ok: true });
    } catch { return sendJSON(res, 404, { error: 'Profile not found' }); }
  }

  // ── Legacy progress API (backwards compat) ──

  // GET /api/progress?profile=id
  if (req.method === 'GET' && req.url.startsWith('/api/progress')) {
    const url = new URL(req.url, 'http://localhost');
    const id = url.searchParams.get('profile');
    const data = readProgress(id);
    if (!data) return sendJSON(res, 404, { error: 'No profile' });
    return sendJSON(res, 200, data);
  }

  // POST /api/progress?profile=id
  if (req.method === 'POST' && req.url.startsWith('/api/progress')) {
    const url = new URL(req.url, 'http://localhost');
    const id = url.searchParams.get('profile');
    if (!id) return sendJSON(res, 400, { error: 'profile param required' });
    try {
      const data = JSON.parse(await readBody(req));
      writeProgress(id, data);
      return sendJSON(res, 200, { ok: true });
    } catch { return sendJSON(res, 400, { error: 'Invalid JSON' }); }
  }

  // API: POST generate-quiz
  if (req.method === 'POST' && req.url === '/api/generate-quiz') {
    try {
      const { topicCode, topicName, strand, difficulty, examples } = JSON.parse(await readBody(req));
      if (!GEMINI_API_KEY) return sendJSON(res, 500, { error: 'No API key' });
      generateQuiz(topicCode, topicName, strand, difficulty, examples)
        .then(quiz => sendJSON(res, 200, { quiz }))
        .catch(e => {
          console.error('Gemini error:', e.message);
          sendJSON(res, 500, { error: e.message });
        });
    } catch {
      sendJSON(res, 400, { error: 'Invalid JSON' });
    }
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
  console.log(`Gemini API: ${GEMINI_API_KEY ? 'loaded' : 'MISSING'}`);
});

// ── Gemini quiz generation ──
function generateQuiz(topicCode, topicName, strand, difficulty, examples) {
  const diffLabel = difficulty < 0.35 ? 'easy' : difficulty < 0.55 ? 'medium' : 'hard';
  const examplesText = (examples || []).map((e, i) =>
    `Example ${i+1}: ${e.problem} → ${e.solution.replace(/<[^>]+>/g, '')}`
  ).join('\n');

  const prompt = `You are a UK maths curriculum quiz generator for Year 6 to Key Stage 3 students.

Topic: ${topicName} (${topicCode})
Strand: ${strand}
Difficulty: ${diffLabel}

Here are example problems for this topic:
${examplesText}

Generate exactly 4 NEW quiz questions for this topic. Each must be DIFFERENT from the examples above. Vary the numbers and contexts.

Return ONLY valid JSON — no markdown, no backticks, no explanation. The format must be:
[
  {"q": "question text", "type": "mc", "options": ["A", "B", "C", "D"], "answer": 0},
  {"q": "question text", "type": "input", "answer": "42"}
]

Rules:
- Mix 2 multiple choice ("mc") and 2 typed input ("input") questions
- For "mc": "answer" is the 0-based index of the correct option (0, 1, 2, or 3)
- For "input": "answer" is a string the student types (just the number, no units)
- Questions must match UK curriculum level for this topic
- Use different numbers than the examples
- Keep questions clear and concise`;

  function parseQuizResponse(text) {
    let cleaned = text.trim();
    cleaned = cleaned.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '');
    // Try to repair truncated JSON: find last complete object
    try { return JSON.parse(cleaned); } catch {}
    // Try closing the array
    try { return JSON.parse(cleaned + ']'); } catch {}
    try { return JSON.parse(cleaned + '"}]'); } catch {}
    try { return JSON.parse(cleaned + '"}]}]'); } catch {}
    // Extract whatever complete objects we can find
    const objs = [];
    const re = /\{[^{}]*\}/g;
    let m;
    while ((m = re.exec(cleaned)) !== null) {
      try { objs.push(JSON.parse(m[0])); } catch {}
    }
    if (objs.length > 0) return objs;
    throw new Error('Could not parse Gemini quiz response');
  }

  // Try up to 2 times
  async function tryGenerate() {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const text = await callGemini(prompt);
        const quiz = parseQuizResponse(text);
        if (!Array.isArray(quiz) || quiz.length === 0) continue;
        return quiz.map(q => {
          if (q.type === 'mc') {
            return { q: String(q.q), type: 'mc', options: (q.options || []).map(String), answer: typeof q.answer === 'number' ? q.answer : 0 };
          } else {
            return { q: String(q.q), type: 'input', answer: String(q.answer) };
          }
        });
      } catch (e) {
        if (attempt === 1) throw e;
      }
    }
    throw new Error('Failed after 2 attempts');
  }

  return tryGenerate();
}

function callGemini(prompt) {
  return new Promise((resolve, reject) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const payload = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 2048 }
    });

    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) return reject(new Error(json.error.message));
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) return reject(new Error('No text in Gemini response'));
          resolve(text);
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}
