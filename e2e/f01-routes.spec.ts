import { expectNoA11yViolations } from './support/a11y.ts';
import { expect, test } from './support/test.ts';

// T01.1 · Roteamento SPA e navegação principal. Base do CA01.1, cuja parte offline chega com T01.6.
const screens = [
  { path: '/hoje', heading: 'Hoje', nav: 'Hoje' },
  { path: '/atividades', heading: 'Atividades', nav: 'Atividades' },
  { path: '/dashboard', heading: 'Dashboard', nav: 'Dashboard' },
  { path: '/progresso', heading: 'Progresso', nav: 'Progresso' },
  { path: '/ajustes', heading: 'Ajustes', nav: 'Ajustes' },
] as const;

for (const { path, heading } of screens) {
  test(`T01.1 · rota ${path} abre a tela "${heading}" @e2e @axe`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    await expectNoA11yViolations(page);
  });
}

test('T01.1 · rota /onboarding abre fora da navegação principal @e2e', async ({ page }) => {
  await page.goto('/onboarding');
  await expect(page.getByRole('heading', { level: 1, name: 'Boas-vindas' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toHaveCount(0);
});

test('T01.1 · / e rotas desconhecidas levam à tela Hoje @e2e', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/hoje$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Hoje' })).toBeVisible();

  await page.goto('/rota-que-nao-existe');
  await expect(page).toHaveURL(/\/hoje$/);
});

test('T01.1 · navegação principal troca de tela sem recarregar e marca a atual @e2e', async ({
  page,
}) => {
  await page.goto('/hoje');
  await page.evaluate(() => {
    (window as unknown as { __semReload: boolean }).__semReload = true;
  });
  const nav = page.getByRole('navigation', { name: 'Navegação principal' });

  for (const { path, heading, nav: label } of screens) {
    const link = nav.getByRole('link', { name: label });
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    await expect(link).toHaveAttribute('aria-current', 'page');
  }

  // SPA: a página não recarregou durante a navegação.
  expect(
    await page.evaluate(() => (window as unknown as { __semReload?: boolean }).__semReload),
  ).toBe(true);
});

test('T01.1 · navegação principal funciona só com teclado @e2e', async ({ page, browserName }) => {
  // No WebKit do macOS, Tab só passa por links com Option (preferência padrão do sistema).
  const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  await page.goto('/hoje');
  const link = page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Atividades' });
  for (let i = 0; i < 10 && !(await link.evaluate((el) => el === document.activeElement)); i++) {
    await page.keyboard.press(tab);
  }
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1, name: 'Atividades' })).toBeVisible();
});
