import { expectNoA11yViolations } from './support/a11y.ts';
import { expectNoHorizontalScroll, expectTouchTargets } from './support/touch.ts';
import { pt } from './support/i18n.ts';
import { expect, test } from './support/test.ts';

// qa.md §4 · CA01.2: convite próprio "Instalar app" quando o navegador permite instalar
// (Chrome Android/desktop) e instrução "Adicionar à Tela de Início" no iOS. O convite fica em
// Ajustes. A instalação real no iOS é verificação manual (reports/qa/evidencias/).

const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const ANDROID_UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36';

type Win = Window & { __promptCalls?: number };

// Dispara um beforeinstallprompt sintético, como o Chrome faz quando o app é instalável.
async function fireBeforeInstallPrompt(
  page: import('@playwright/test').Page,
  outcome = 'accepted',
) {
  return page.evaluate((choice) => {
    const event = new Event('beforeinstallprompt', { cancelable: true }) as Event & {
      prompt: () => Promise<void>;
      userChoice: Promise<{ outcome: string }>;
    };
    event.prompt = () => {
      const w = window as Win;
      w.__promptCalls = (w.__promptCalls ?? 0) + 1;
      return Promise.resolve();
    };
    event.userChoice = Promise.resolve({ outcome: choice });
    window.dispatchEvent(event);
    return event.defaultPrevented;
  }, outcome);
}

test.describe('Chrome Android/desktop', () => {
  test.use({ userAgent: ANDROID_UA });

  test('CA01.2 · sem critérios de instalação, não há convite @e2e', async ({ page }) => {
    await page.goto('/ajustes');
    await expect(page.getByRole('heading', { level: 1, name: pt.settings.title })).toBeVisible();
    await expect(page.getByRole('button', { name: pt.install.button })).toHaveCount(0);
    await expect(page.getByText(pt.install.ios.title)).toHaveCount(0);
  });

  test('CA01.2 · com beforeinstallprompt, "Instalar app" aparece e chama prompt() @e2e', async ({
    page,
  }) => {
    await page.goto('/ajustes');
    await fireBeforeInstallPrompt(page);
    const button = page.getByRole('button', { name: pt.install.button });
    await expect(button).toBeVisible();

    await button.click();
    expect(await page.evaluate(() => (window as Win).__promptCalls)).toBe(1);
    // O evento só pode ser usado uma vez: o convite some depois da resposta.
    await expect(button).toHaveCount(0);
  });

  test('CA01.2 · o app intercepta o beforeinstallprompt para usar o convite próprio @e2e', async ({
    page,
  }) => {
    await page.goto('/ajustes');
    await expect(page.getByRole('heading', { level: 1, name: pt.settings.title })).toBeVisible();
    // preventDefault: o navegador não mostra a própria mini barra; vale o convite "Instalar app".
    expect(await fireBeforeInstallPrompt(page)).toBe(true);
    await expect(page.getByRole('button', { name: pt.install.button })).toBeVisible();
  });

  test('CA01.2 · recusado no diálogo, o convite some e prompt() não é chamado de novo @e2e', async ({
    page,
  }) => {
    await page.goto('/ajustes');
    await fireBeforeInstallPrompt(page, 'dismissed');
    const button = page.getByRole('button', { name: pt.install.button });
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveCount(0);
    expect(await page.evaluate(() => (window as Win).__promptCalls)).toBe(1);
  });

  test('CA01.2 · depois de instalado (appinstalled), o convite some @e2e', async ({ page }) => {
    await page.goto('/ajustes');
    await fireBeforeInstallPrompt(page);
    await expect(page.getByRole('button', { name: pt.install.button })).toBeVisible();
    await page.evaluate(() => window.dispatchEvent(new Event('appinstalled')));
    await expect(page.getByRole('button', { name: pt.install.button })).toHaveCount(0);
  });

  test('CA01.2 · evento capturado antes da tela de Ajustes abrir continua valendo @e2e', async ({
    page,
  }) => {
    await page.goto('/hoje');
    await fireBeforeInstallPrompt(page);
    await page
      .getByRole('navigation', { name: pt.nav.label })
      .getByRole('link', { name: pt.nav.settings })
      .click();
    await expect(page.getByRole('button', { name: pt.install.button })).toBeVisible();
  });

  for (const colorScheme of ['light', 'dark'] as const) {
    test(`CA01.2 · convite acessível no tema ${colorScheme} @e2e @axe`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto('/ajustes');
      await fireBeforeInstallPrompt(page);
      await expect(page.getByRole('button', { name: pt.install.button })).toBeVisible();
      await expectNoA11yViolations(page);
      await expectTouchTargets(page);
      await expectNoHorizontalScroll(page);
    });
  }
});

test.describe('iOS', () => {
  test.use({ userAgent: IPHONE_UA });

  test('CA01.2 · no iOS aparece a instrução "Adicionar à Tela de Início" @e2e', async ({
    page,
  }) => {
    await page.goto('/ajustes');
    const region = page.getByRole('region', { name: pt.install.ios.title });
    await expect(region).toBeVisible();
    await expect(region.getByText(pt.install.ios.step1)).toBeVisible();
    await expect(page.getByRole('button', { name: pt.install.button })).toHaveCount(0);
  });

  test('CA01.2 · no iOS com o app já instalado, a instrução não aparece @e2e', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'standalone', { value: true });
    });
    await page.goto('/ajustes');
    await expect(page.getByRole('heading', { level: 1, name: pt.settings.title })).toBeVisible();
    await expect(page.getByText(pt.install.ios.title)).toHaveCount(0);
  });

  for (const colorScheme of ['light', 'dark'] as const) {
    test(`CA01.2 · instrução do iOS acessível no tema ${colorScheme} @e2e @axe`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto('/ajustes');
      await expect(page.getByRole('region', { name: pt.install.ios.title })).toBeVisible();
      await expectNoA11yViolations(page);
      await expectTouchTargets(page);
      await expectNoHorizontalScroll(page);
    });
  }
});
