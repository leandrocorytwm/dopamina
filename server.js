// DOPAMINA server: serves the game + a tiny global leaderboard API.
// No external deps. Run:  node server.js   ->  http://localhost:8765
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8765;
const DIR = __dirname;
const DATA = path.join(DIR, 'scores.json');
const LIVE_MS = 15 * 60 * 1000; // "agora" = last 15 minutes

let scores = [];
try { scores = JSON.parse(fs.readFileSync(DATA, 'utf8')); } catch (e) { scores = []; }
function persist() { try { fs.writeFileSync(DATA, JSON.stringify(scores)); } catch (e) {} }

const MIME = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.json':'application/json', '.css':'text/css', '.png':'image/png' };

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  // ---- API: global board ----
  if (url === '/api/board' && req.method === 'GET') {
    const now = Date.now();
    const allTime = scores.slice().sort((a,b)=>b.score-a.score).slice(0,20);
    const live = scores.filter(s => now - s.ts < LIVE_MS).sort((a,b)=>b.score-a.score).slice(0,20);
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify({ allTime, live }));
    return;
  }

  // ---- API: submit score ----
  if (url === '/api/score' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const d = JSON.parse(body);
        const name = String(d.name || 'VOCÊ').slice(0,12).replace(/[<>&"]/g,'');
        const score = Math.max(0, Math.floor(Number(d.score) || 0));
        const mode = String(d.mode || '').slice(0,6);
        scores.push({ name, score, mode, ts: Date.now() });
        if (scores.length > 1000) scores = scores.slice(-1000);
        persist();
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ ok: true }));
      } catch (e) { res.writeHead(400); res.end('bad'); }
    });
    return;
  }

  // ---- static files ----
  let file = url === '/' ? '/index.html' : url;
  const fp = path.join(DIR, path.normalize(file).replace(/^(\.\.[/\\])+/, ''));
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'text/plain' });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => console.log('DOPAMINA rodando em http://localhost:' + PORT));
