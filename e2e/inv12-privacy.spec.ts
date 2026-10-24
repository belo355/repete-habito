import { waitForServiceWorker } from './support/pwa.ts';
import { expect, test } from './support/test.ts';

// qa.md §5 · INV12. A fixture automática de ./support/test.ts já falha o spec em caso de
// requisição externa; este teste deixa a verificação explícita e com o ID no título.
test('INV12 · abrir o app não faz nenhuma requisição fora da origem @e2e', async ({
  page,
  externalRequests,
}) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(externalRequests).toEqual([]);
});

// Adicionado pelo QA (qa task T01.6): com o service worker, parte do tráfego sai do próprio SW
// (precache). A fixture escuta o contexto; aqui se prova que esse tráfego é visto e fica na origem.
test('INV12 · com o service worker ativo, nem a página nem o SW pedem nada fora da origem @e2e @offline', async ({
  page,
  context,
  baseURL,
  browserName,
  externalRequests,
}) => {
  const appOrigin = new URL(baseURL ?? 'http://localhost').origin;
  const fromServiceWorker: string[] = [];
  context.on('request', (request) => {
    if (request.serviceWorker()) fromServiceWorker.push(request.url());
  });

  await page.goto('/hoje');
  await waitForServiceWorker(page);
  await page.reload();
  await page.goto('/ajustes');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // Só o Chromium expõe as requisições do service worker ao Playwright.
  if (browserName === 'chromium') expect(fromServiceWorker.length).toBeGreaterThan(0);
  for (const url of fromServiceWorker) expect(new URL(url).origin).toBe(appOrigin);
  expect(externalRequests).toEqual([]);
});
