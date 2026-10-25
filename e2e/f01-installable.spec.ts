import { waitForServiceWorker } from './support/pwa.ts';
import { pt } from './support/i18n.ts';
import { expect, test } from './support/test.ts';

// qa.md §4 · CA01.6, parte "instalável como PWA" (DV05): o Lighthouse 12 não tem mais esse audit,
// então a prova é a própria checagem de instalabilidade do Chromium (a mesma que o Lighthouse usava).
// Roda só nos projetos Chromium (playwright.config.ts): é uma API do Chrome DevTools Protocol.

// QA (qa task T01.6): o headless shell padrão do Playwright não implementa essa checagem e devolve
// sempre `[]`, mesmo sem manifest. O Chromium completo (`channel: 'chromium'`) faz a checagem real.
test.use({ channel: 'chromium' });
// Artefato do contexto não persistente do Playwright; o perfil de um usuário real não é anônimo.
const ignoredInstallabilityErrors = ['in-incognito'];

type Manifest = {
  name?: string;
  short_name?: string;
  lang?: string;
  start_url?: string;
  display?: string;
  theme_color?: string;
  background_color?: string;
  icons?: Array<{ src: string; sizes: string; type?: string; purpose?: string }>;
};

test('CA01.6 · manifest pt-BR com ícones 192, 512 e maskable @e2e', async ({ page, request }) => {
  await page.goto('/hoje');
  const href = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(href).toBeTruthy();
  const manifest = (await (await request.get(href!)).json()) as Manifest;

  expect(manifest.name).toBe(pt.app.name);
  expect(manifest.short_name).toBeTruthy();
  expect(manifest.lang).toBe('pt-BR');
  expect(manifest.start_url).toBe('/');
  expect(manifest.display).toBe('standalone');
  expect(manifest.theme_color).toMatch(/^#[0-9a-f]{6}$/i);
  expect(manifest.background_color).toMatch(/^#[0-9a-f]{6}$/i);

  const icons = manifest.icons ?? [];
  expect(icons.some((i) => i.sizes === '192x192' && i.purpose !== 'maskable')).toBe(true);
  expect(icons.some((i) => i.sizes === '512x512' && i.purpose !== 'maskable')).toBe(true);
  expect(icons.some((i) => i.sizes === '512x512' && i.purpose === 'maskable')).toBe(true);
  for (const icon of icons) {
    const res = await request.get(new URL(icon.src, page.url()).toString());
    expect(res.ok(), icon.src).toBe(true);
    expect(res.headers()['content-type']).toContain('image/png');
  }
});

test('CA01.6 · app instalável: service worker controla a página e o Chromium não aponta erros @e2e', async ({
  page,
}) => {
  await page.goto('/hoje');
  await waitForServiceWorker(page);
  expect(await page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);

  const cdp = await page.context().newCDPSession(page);
  const { installabilityErrors } = (await cdp.send('Page.getInstallabilityErrors')) as {
    installabilityErrors: Array<{ errorId: string }>;
  };
  expect(
    installabilityErrors
      .map((e) => e.errorId)
      .filter((id) => !ignoredInstallabilityErrors.includes(id)),
  ).toEqual([]);
});

test('T01.6 · manifest não trava a orientação e o precache não tem entradas repetidas @e2e', async ({
  page,
  request,
}) => {
  await page.goto('/hoje');
  const href = await page.locator('link[rel="manifest"]').getAttribute('href');
  const manifest = (await (await request.get(href!)).json()) as Manifest & { orientation?: string };
  expect(manifest.orientation).toBeUndefined();

  const sw = await (await request.get('/sw.js')).text();
  const urls = [...sw.matchAll(/url:"([^"]+)"/g)].map((m) => m[1]);
  expect(urls.length).toBeGreaterThan(0);
  expect(urls.filter((url, i) => urls.indexOf(url) !== i)).toEqual([]);
});
