import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expectNoA11yViolations } from './support/a11y.ts';
import { waitForServiceWorker } from './support/pwa.ts';
import { startSwitchableServer } from './support/static-server.ts';
import { expect, test as base } from './support/test.ts';
import { expectNoHorizontalScroll, expectTouchTargets } from './support/touch.ts';

// qa.md §4 · CA01.5: com o app aberto, uma versão nova publicada mostra "Nova versão disponível";
// o app só recarrega se o usuário aceitar.
// Gera dois builds (A e B) com versões diferentes e troca a pasta servida no meio do teste.
// Cada worker tem o próprio servidor (porta 4174 + índice), e o baseURL do spec aponta para ele:
// assim a fixture do INV12 continua tratando como externa qualquer outra origem.
const portFor = (parallelIndex: number) => 4174 + parallelIndex;
const test = base.extend({
  baseURL: async ({}, use, testInfo) => use(`http://localhost:${portFor(testInfo.parallelIndex)}`),
});
test.describe.configure({ mode: 'serial' });

let buildsDir: string;
let server: Awaited<ReturnType<typeof startSwitchableServer>>;

function build(version: string) {
  const outDir = join(buildsDir, version);
  execFileSync('pnpm', ['exec', 'vite', 'build', '--outDir', outDir, '--emptyOutDir'], {
    env: { ...process.env, APP_VERSION: version },
    stdio: 'ignore',
  });
  return outDir;
}

test.beforeAll(async ({}, testInfo) => {
  test.setTimeout(120_000);
  buildsDir = mkdtempSync(join(tmpdir(), 'repete-habito-update-'));
  build('versao-a');
  build('versao-b');
  server = await startSwitchableServer(
    join(buildsDir, 'versao-a'),
    portFor(testInfo.parallelIndex),
  );
});

test.afterAll(async () => {
  await server?.close();
  rmSync(buildsDir, { recursive: true, force: true });
});

async function openVersionA(page: import('@playwright/test').Page) {
  server.switchTo(join(buildsDir, 'versao-a'));
  await page.goto('/ajustes');
  await waitForServiceWorker(page);
  await expect(page.getByText('Versão versao-a')).toBeVisible();
  await page.evaluate(() => {
    (window as unknown as { __semReload: boolean }).__semReload = true;
  });
}

async function publishVersionB(page: import('@playwright/test').Page) {
  server.switchTo(join(buildsDir, 'versao-b'));
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    await registration?.update();
  });
}

const stillSamePage = (page: import('@playwright/test').Page) =>
  page.evaluate(() => (window as unknown as { __semReload?: boolean }).__semReload === true);

test('CA01.5 · versão nova mostra o aviso e o app não recarrega sozinho @e2e', async ({ page }) => {
  await openVersionA(page);
  await publishVersionB(page);

  const notice = page.getByRole('status').filter({ hasText: 'Nova versão disponível' });
  await expect(notice).toBeVisible({ timeout: 15_000 });

  // Espera um pouco: nada recarrega e a versão em uso continua a A.
  await page.waitForTimeout(1500);
  expect(await stillSamePage(page)).toBe(true);
  await expect(page.getByText('Versão versao-a')).toBeVisible();
});

test('CA01.5 · ao aceitar, o app recarrega e mostra a versão nova @e2e', async ({ page }) => {
  await openVersionA(page);
  await publishVersionB(page);
  await page.getByRole('button', { name: 'Atualizar agora' }).click({ timeout: 15_000 });

  await expect(page.getByText('Versão versao-b')).toBeVisible({ timeout: 15_000 });
  expect(await stillSamePage(page)).toBe(false);
});

test('CA01.5 · "Agora não" fecha o aviso sem recarregar @e2e', async ({ page }) => {
  await openVersionA(page);
  await publishVersionB(page);
  await page.getByRole('button', { name: 'Agora não' }).click({ timeout: 15_000 });

  await expect(page.getByText('Nova versão disponível')).toHaveCount(0);
  // Janela de espera: dispensar não pode aplicar a versão nova depois.
  await page.waitForTimeout(1500);
  expect(await stillSamePage(page)).toBe(true);
  await expect(page.getByText('Versão versao-a')).toBeVisible();
});

test('CA01.5 · quem volta ao app (SW já no controle) vê o aviso e só recarrega ao aceitar @e2e', async ({
  page,
}) => {
  await openVersionA(page);
  // Caminho real de quem já usa o app: o SW controla a página desde o carregamento.
  await page.reload();
  await expect(page.getByText('Versão versao-a')).toBeVisible();
  await page.evaluate(() => {
    (window as unknown as { __semReload: boolean }).__semReload = true;
  });
  await publishVersionB(page);

  await expect(page.getByRole('status').filter({ hasText: 'Nova versão disponível' })).toBeVisible({
    timeout: 15_000,
  });
  await page.waitForTimeout(1500);
  expect(await stillSamePage(page)).toBe(true);
  await expect(page.getByText('Versão versao-a')).toBeVisible();

  await page.getByRole('button', { name: 'Atualizar agora' }).click();
  await expect(page.getByText('Versão versao-b')).toBeVisible({ timeout: 15_000 });
  expect(await stillSamePage(page)).toBe(false);
});

test('CA01.5 · aviso na tela real, nos 2 temas: zero violações axe, alvos ≥ 44 px, sem rolagem horizontal @e2e @axe', async ({
  page,
}) => {
  await openVersionA(page);
  await publishVersionB(page);
  const notice = page.getByRole('status').filter({ hasText: 'Nova versão disponível' });
  await expect(notice).toBeVisible({ timeout: 15_000 });

  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    await expect(page.locator('html')).toHaveAttribute('data-theme', colorScheme);
    await expectNoA11yViolations(page);
    await expectTouchTargets(page);
    await expectNoHorizontalScroll(page);
  }
});
