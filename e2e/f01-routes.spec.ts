import { expectNoA11yViolations } from './support/a11y.ts';
import { pt } from './support/i18n.ts';
import { expect, test } from './support/test.ts';

// T01.1 · Roteamento SPA e navegação principal. Base do CA01.1, cuja parte offline chega com T01.6.
const screens = [
  { path: '/hoje', heading: pt.today.title, nav: pt.nav.today },
  { path: '/album', heading: pt.album.title, nav: pt.nav.album },
  { path: '/ajustes', heading: pt.settings.title, nav: pt.nav.settings },
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
  await expect(page.getByRole('heading', { level: 1, name: pt.onboarding.title })).toBeVisible();
  await expect(page.getByRole('navigation', { name: pt.nav.label })).toHaveCount(0);
});

test('T01.1 · / e rotas desconhecidas levam à tela Hoje @e2e', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/hoje$/);
  await expect(page.getByRole('heading', { level: 1, name: pt.today.title })).toBeVisible();

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
  const nav = page.getByRole('navigation', { name: pt.nav.label });

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
    .getByRole('navigation', { name: pt.nav.label })
    .getByRole('link', { name: pt.nav.album });
  for (let i = 0; i < 10 && !(await link.evaluate((el) => el === document.activeElement)); i++) {
    await page.keyboard.press(tab);
  }
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1, name: pt.album.title })).toBeVisible();
});

test('T01.11 · título e descrição do documento vêm do i18n @e2e', async ({ page }) => {
  await page.goto('/hoje');
  await expect(page).toHaveTitle(pt.app.name);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    pt.app.description,
  );
});

test('T01.14 · navegação principal tem 3 abas e Progresso não é mais aba @e2e', async ({
  page,
}) => {
  await page.goto('/hoje');
  const nav = page.getByRole('navigation', { name: pt.nav.label });
  await expect(nav.getByRole('link')).toHaveCount(3);
  await page.goto('/progresso');
  await expect(page).toHaveURL(/\/hoje$/);
});

test('T01.14 · endereços antigos de Atividades e Dashboard abrem o Álbum @e2e', async ({
  page,
}) => {
  for (const path of ['/atividades', '/dashboard']) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/album$/);
    await expect(page.getByRole('heading', { level: 1, name: pt.album.title })).toBeVisible();
  }
});
