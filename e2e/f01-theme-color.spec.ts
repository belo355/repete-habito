import { pt } from './support/i18n.ts';
import { expect, test } from './support/test.ts';

// T01.6 · theme_color dos dois temas: a barra do sistema acompanha o tema efetivo do app.
// O CSS minificado pode encurtar #ffffff para #fff; compara sempre na forma longa.
const longHex = (hex: string | null) =>
  hex && /^#[0-9a-f]{3}$/i.test(hex) ? `#${[...hex.slice(1)].map((c) => c + c).join('')}` : hex;
const meta = async (page: import('@playwright/test').Page) =>
  longHex(await page.locator('meta[name="theme-color"]').getAttribute('content'));
const bg = async (page: import('@playwright/test').Page) =>
  longHex(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim(),
    ),
  );

for (const colorScheme of ['light', 'dark'] as const) {
  test(`T01.6 · theme-color igual ao fundo do tema ${colorScheme} do sistema @e2e`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/hoje');
    expect(await meta(page)).toBe(await bg(page));
    expect(await meta(page)).toBe(colorScheme === 'dark' ? '#16181d' : '#ffffff');
  });
}

test('T01.6 · theme-color acompanha a escolha manual de tema @e2e', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/ajustes');
  await page.getByRole('radio', { name: pt.settings.theme.dark }).check();
  await expect.poll(() => meta(page)).toBe('#16181d');
  await page.reload();
  expect(await meta(page)).toBe('#16181d');
});
