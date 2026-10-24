import { waitForServiceWorker } from './support/pwa.ts';
import { expect, test } from './support/test.ts';

// qa.md §4 · CA01.1: depois do 1º acesso, o app recarrega e navega entre todas as rotas sem conexão.
const routes = [
  { path: '/hoje', heading: 'Hoje' },
  { path: '/atividades', heading: 'Atividades' },
  { path: '/dashboard', heading: 'Dashboard' },
  { path: '/progresso', heading: 'Progresso' },
  { path: '/ajustes', heading: 'Ajustes' },
  { path: '/onboarding', heading: 'Boas-vindas' },
] as const;

test('CA01.1 · offline, o app recarrega e abre todas as rotas @e2e @offline', async ({
  page,
  context,
}) => {
  await page.goto('/hoje');
  await waitForServiceWorker(page);

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Hoje' })).toBeVisible();

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

  const nav = page.getByRole('navigation', { name: 'Navegação principal' });
  for (const { path, heading } of routes.filter((r) => r.path !== '/onboarding')) {
    await nav.getByRole('link', { name: heading }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  }
});
