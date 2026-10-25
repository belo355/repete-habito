import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './support/test.ts';

// qa.md §4 · CA01.4: zero violações `color-contrast` do axe em cada rota × tema.
// O tema vem do sistema operacional (prefers-color-scheme); o tema escolhido em Ajustes contra o
// SO é auditado em e2e/f01-theme.spec.ts (CA01.4 · contraste AA em /ajustes com …).
const routes = ['/hoje', '/album', '/ajustes', '/onboarding'];
const themes = ['light', 'dark'] as const;

for (const colorScheme of themes) {
  for (const route of routes) {
    test(`CA01.4 · contraste AA em ${route} no tema ${colorScheme} @e2e @axe`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

      // O tema realmente aplicado é o pedido: o fundo muda entre claro e escuro.
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      const [r = 0, g = 0, b = 0] = (bg.match(/\d+/g) ?? []).map(Number);
      const luminance = (r + g + b) / 3;
      if (colorScheme === 'dark') expect(luminance).toBeLessThan(64);
      else expect(luminance).toBeGreaterThan(192);

      const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
      expect(results.violations).toEqual([]);
    });
  }
}
