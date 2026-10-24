import { readFile, stat } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import { extname, join, normalize } from 'node:path';

const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

// Servidor estático mínimo cuja pasta servida pode ser trocada em tempo de execução
// (simula publicar uma versão nova com o app aberto). Rotas sem arquivo caem no index.html.
export async function startSwitchableServer(initialRoot: string, port: number) {
  let root = initialRoot;
  const server: Server = createServer((req, res) => {
    void (async () => {
      const path = normalize(decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname));
      let file = join(root, path);
      try {
        if (!(await stat(file)).isFile()) file = join(root, 'index.html');
      } catch {
        file = join(root, 'index.html');
      }
      const body = await readFile(file);
      res.writeHead(200, {
        'content-type': types[extname(file)] ?? 'application/octet-stream',
        'cache-control': 'no-cache',
      });
      res.end(body);
    })().catch(() => {
      res.writeHead(500);
      res.end();
    });
  });
  await new Promise<void>((resolve) => server.listen(port, 'localhost', resolve));
  return {
    url: `http://localhost:${port}`,
    switchTo(next: string) {
      root = next;
    },
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}
