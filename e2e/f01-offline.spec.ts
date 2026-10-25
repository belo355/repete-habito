import { waitForServiceWorker } from './support/pwa.ts';
import { pt } from './support/i18n.ts';
import { expect, test } from './support/test.ts';

// qa.md §4 · CA01.1: depois do 1º acesso, o app recarrega e navega entre todas as rotas sem conexão.
const routes = [
  { path: '/hoje', heading: pt.today.title },
  { path: '/atividades', heading: pt.activities.title },
  { path: '/dashboard', heading: pt.dashboard.title },
  { path: '/ajustes', heading: pt.settings.title },
  { path: '/onboarding', heading: pt.onboarding.title },
] as const;

test('CA01.1 · offline, o app recarrega e abre todas as rotas @e2e @offline', async ({
  page,
  context,
}) => {
  await page.goto('/hoje');
  await waitForServiceWorker(page);

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: pt.today.title })).toBeVisible();

  // Carga direta de cada rota (sem rede): o service worker devolve o app shell.
  for (const { path, heading } of routes) {
    const response = await page.goto(path);
    expect(response?.ok() ?? true).toBe(true);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  }
});

test('CA01.1 · offline, a navegação principal troca de tela @e2e @offline', async ({
  page,
  context,
}) => {
  await page.goto('/hoje');
  await waitForServiceWorker(page);
  await context.setOffline(true);
  await page.reload();

  const nav = page.getByRole('navigation', { name: pt.nav.label });
  for (const { path, heading } of routes.filter((r) => r.path !== '/onboarding')) {
    await nav.getByRole('link', { name: heading }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  }
});
