import { waitForServiceWorker } from './support/pwa.ts';
import { pt } from './support/i18n.ts';
import { expect, test } from './support/test.ts';

// Criado pelo QA na T01.12 e adaptado na T01.14 (mundo "Álbum da semana"): as fontes do mundo
// visual são servidas pelo app e funcionam offline (INV12 e CA01.1), os estados vazios levam ao
// próximo passo, a figurinha de exemplo não é salva e respeita o movimento reduzido.

const FONT_FAMILY = 'Barlow Condensed';

test('T01.14 · fonte do título vem da origem, entra no precache e é usada offline @e2e @offline', async ({
  page,
  context,
  baseURL,
}) => {
  await page.goto('/hoje');
  await waitForServiceWorker(page);

  const cachedFonts = await page.evaluate(async () => {
    const urls: string[] = [];
    for (const name of await caches.keys()) {
      const cache = await caches.open(name);
      for (const request of await cache.keys()) {
        if (new URL(request.url).pathname.endsWith('.woff2')) urls.push(request.url);
      }
    }
    return urls;
  });
  expect(cachedFonts.length, 'woff2 no precache').toBeGreaterThan(0);
  const origin = new URL(baseURL ?? 'http://localhost').origin;
  for (const url of cachedFonts) expect(new URL(url).origin).toBe(origin);

  await context.setOffline(true);
  await page.reload();
  const heading = page.getByRole('heading', { level: 1, name: pt.today.title });
  await expect(heading).toBeVisible();

  const family = await heading.evaluate((el) => getComputedStyle(el).fontFamily);
  expect(family.replaceAll('"', '').split(',')[0]?.trim()).toBe(FONT_FAMILY);
  await expect
    .poll(() =>
      page.evaluate(async (wanted) => {
        await document.fonts.ready;
        return [...document.fonts].some(
          (face) => face.family.replaceAll('"', '') === wanted && face.status === 'loaded',
        );
      }, FONT_FAMILY),
    )
    .toBe(true);
});

test('T01.14 · estados vazios levam ao próximo passo @e2e', async ({ page }) => {
  const h1 = (name: string) => page.getByRole('heading', { level: 1, name });

  await page.goto('/hoje');
  await page.getByRole('link', { name: pt.today.create }).click();
  await expect(page).toHaveURL(/\/album$/);
  await expect(h1(pt.album.title)).toBeVisible();

  await page.goto('/hoje');
  await page.getByRole('link', { name: pt.today.guided }).click();
  await expect(page).toHaveURL(/\/onboarding$/);
  await expect(h1(pt.onboarding.title)).toBeVisible();

  await page.getByRole('link', { name: pt.onboarding.goToday }).click();
  await expect(page).toHaveURL(/\/hoje$/);
  await expect(h1(pt.today.title)).toBeVisible();

  await page.goto('/album');
  await page.getByRole('link', { name: pt.album.start }).click();
  await expect(page).toHaveURL(/\/onboarding$/);

  await page.goto('/album');
  await page.getByRole('link', { name: pt.album.goToday }).click();
  await expect(page).toHaveURL(/\/hoje$/);
  await expect(h1(pt.today.title)).toBeVisible();
});

test('T01.12 · ações do estado vazio de Hoje empilham abaixo de 640 px @e2e', async ({ page }) => {
  await page.goto('/hoje');
  const create = await page.getByRole('link', { name: pt.today.create }).boundingBox();
  const guided = await page.getByRole('link', { name: pt.today.guided }).boundingBox();
  expect(create && guided).toBeTruthy();
  const width = page.viewportSize()?.width ?? 0;
  if (width < 640) {
    // Empilhadas: uma abaixo da outra, sem sobreposição, e cabendo na tela.
    expect(guided!.y).toBeGreaterThanOrEqual(create!.y + create!.height);
    expect(create!.x + create!.width).toBeLessThanOrEqual(width);
    expect(guided!.x + guided!.width).toBeLessThanOrEqual(width);
  } else {
    expect(Math.round(guided!.y)).toBe(Math.round(create!.y));
  }
});

test('T01.12 · título justo (entrelinha 0,95) só em textos ≥ 36 px @e2e', async ({ page }) => {
  for (const path of ['/hoje', '/album', '/ajustes', '/onboarding']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const tight = await page.evaluate(() =>
      [...document.querySelectorAll('body *')]
        .map((el) => {
          const style = getComputedStyle(el);
          const size = parseFloat(style.fontSize);
          const lineHeight = parseFloat(style.lineHeight);
          return { tag: el.tagName, size, ratio: lineHeight / size, text: el.textContent ?? '' };
        })
        .filter(({ ratio, text }) => text.trim() && Math.abs(ratio - 0.95) < 0.01),
    );
    expect(tight.length, `${path}: algum título justo`).toBeGreaterThan(0);
    for (const item of tight) expect(item.size, `${path} · ${item.tag}`).toBeGreaterThanOrEqual(36);
  }
});

test('T01.14 · figurinha de exemplo cola em 1 toque e não fica salva @e2e', async ({ page }) => {
  await page.goto('/hoje');
  const storageBefore = await page.evaluate(() => JSON.stringify({ ...localStorage }));
  const sticker = page.getByRole('button', {
    name: pt.sticker.label.replace('{{count}}', '1').replace('{{name}}', pt.today.exampleName),
  });
  await expect(sticker).toHaveAttribute('aria-pressed', 'false');
  await expect(sticker).toContainText(pt.sticker.stick);

  await sticker.click();
  // O nome acessível não muda; o estado vai para aria-pressed e para o texto visível.
  await expect(sticker).toHaveAttribute('aria-pressed', 'true');
  await expect(sticker).toContainText(pt.sticker.number);
  await expect(page.getByText(pt.today.exampleMeta)).toBeVisible();
  expect(await page.evaluate(() => JSON.stringify({ ...localStorage }))).toBe(storageBefore);
  const databases = await page.evaluate(async () =>
    'databases' in indexedDB ? (await indexedDB.databases()).length : 0,
  );
  expect(databases, 'nenhum banco criado pelo exemplo').toBe(0);

  await page.reload();
  await expect(sticker).toHaveAttribute('aria-pressed', 'false');
});

test('T01.14 · com movimento reduzido a figurinha não anima ao colar @e2e', async ({ page }) => {
  const label = pt.sticker.label
    .replace('{{count}}', '1')
    .replace('{{name}}', pt.today.exampleName);
  const animation = (sticker: import('@playwright/test').Locator) =>
    sticker.evaluate((el) => {
      const style = getComputedStyle(el);
      return { name: style.animationName, duration: style.animationDuration };
    });

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/hoje');
  const sticker = page.getByRole('button', { name: label });
  await sticker.click();
  await expect(sticker).toHaveAttribute('aria-pressed', 'true');
  expect((await animation(sticker)).name).toBe('none');

  // Controle: sem a preferência, colar de novo dispara a queda de 320 ms.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await sticker.click();
  await expect(sticker).toHaveAttribute('aria-pressed', 'false');
  await sticker.click();
  expect(await animation(sticker)).toEqual({ name: 'sticker-in', duration: '0.32s' });
});
