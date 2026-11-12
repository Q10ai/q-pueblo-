import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const args = process.argv.slice(2);
const value = (key, fallback) => args.includes(key) ? args[args.indexOf(key) + 1] : fallback;
const host = value('--host', '0.0.0.0');
const port = Number(value('--port', '4173'));
const root = await realpath('public');
const types = { '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.txt':'text/plain; charset=utf-8','.csv':'text/csv; charset=utf-8','.md':'text/plain; charset=utf-8' };
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://terminal.local');
    if (url.pathname === '/__responsive') {
      const requested = Number(url.searchParams.get('width'));
      const width = [320,390,768,1536].includes(requested) ? requested : 390;
      response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
      response.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Q-Pueblo responsive review</title><style>body{margin:0;background:#080d29;color:#fff;font:16px system-ui}p{margin:12px}iframe{display:block;border:0;margin:0 auto;background:#080d29}</style></head><body><p>Q-Pueblo · ${width}px responsive viewport</p><iframe src="/index.html" title="Q-Pueblo responsive preview" width="${width}" height="900"></iframe></body></html>`);
      return;
    }
    let path = resolve(root, '.' + decodeURIComponent(url.pathname));
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    path = await realpath(path);
    if (!path.startsWith(root + sep)) throw new Error('Path outside public assets');
    response.writeHead(200, {'Content-Type':types[extname(path)] ?? 'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    response.end(await readFile(path));
  } catch { response.writeHead(404, {'Content-Type':'text/plain'}); response.end('Not found'); }
}).listen(port, host, () => console.log(`Q-Pueblo preview listening on ${host}:${port}`));
