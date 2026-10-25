import { expectNoA11yViolations } from './support/a11y.ts';
import { expectNoHorizontalScroll, expectTouchTargets } from './support/touch.ts';
import { expect, test } from './support/test.ts';

// Adicionado pelo QA (qa.md §6 e §7): alvos de toque ≥ 44 px e sem rolagem horizontal
// em todas as rotas criadas por T01.1, nos 3 projetos (webkit-mobile = 320 px).
const routes = [
  { path: '/hoje', heading: 'Hoje' },
  { path: '/atividades', heading: 'Atividades' },
  { path: '/dashboard', heading: 'Dashboard' },
  { path: '/progresso', heading: 'Progresso' },
  { path: '/ajustes', heading: 'Ajustes' },
  { path: '/onboarding', heading: 'Boas-vindas' },
] as const;

for (const { path, heading } of routes) {
  test(`T01.1 · NFR · rota ${path} tem alvos de toque ≥ 44×44 px @e2e`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    await expectTouchTargets(page);
  });

  test(`T01.1 · NFR · rota ${path} não rola na horizontal @e2e`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    await expectNoHorizontalScroll(page);
  });
}

test('T01.1 · NFR · recarregar numa rota interna mantém a tela (deep link) @e2e', async ({
  page,
}) => {
  for (const { path, heading } of routes) {
    await page.goto(path);
    await page.reload();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  }
});

test('T01.1 · NFR · voltar e avançar do navegador seguem o histórico da navegação @e2e', async ({
  page,
}) => {
  await page.goto('/hoje');
  const nav = page.getByRole('navigation', { name: 'Navegação principal' });
  await nav.getByRole('link', { name: 'Dashboard' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/hoje$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Hoje' })).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL(/\/dashboard$/);
});

// Adicionado pelo QA (qa feature F01 · Definição de Pronto, product 4.9.1 e qa.md §7): axe completo
// (WCAG 2.1 AA, não só contraste) em toda rota × tema × projeto. Antes, o tema escuro só tinha
// `color-contrast` fora de Ajustes e /onboarding não tinha axe completo em nenhum tema.
for (const colorScheme of ['light', 'dark'] as const) {
  for (const { path, heading } of routes) {
    test(`F01 · DoD · axe WCAG 2.1 AA em ${path} no tema ${colorScheme} @e2e @axe`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('data-theme', colorScheme);
      await expectNoA11yViolations(page);
    });
  }
}
