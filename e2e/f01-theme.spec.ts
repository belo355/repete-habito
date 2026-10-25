import { expectNoA11yViolations } from './support/a11y.ts';
import { expectTouchTargets } from './support/touch.ts';
import { pt } from './support/i18n.ts';
import { expect, test } from './support/test.ts';

// qa.md §4 · CA01.3: tema do sistema sem preferência salva; escolha em Ajustes persiste após recarregar.
const html = (page: import('@playwright/test').Page) => page.locator('html');

test('CA01.3 · sistema escuro sem preferência salva aplica o tema escuro na 1ª carga @e2e', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/hoje');
  await expect(html(page)).toHaveAttribute('data-theme', 'dark');
});

test('CA01.3 · sistema claro sem preferência salva aplica o tema claro na 1ª carga @e2e', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/hoje');
  await expect(html(page)).toHaveAttribute('data-theme', 'light');
});

test('CA01.3 · escolher "Claro" em Ajustes mantém o tema claro após recarregar com SO escuro @e2e', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/ajustes');
  await expect(html(page)).toHaveAttribute('data-theme', 'dark');

  await page.getByRole('radio', { name: pt.settings.theme.light }).check();
  await expect(html(page)).toHaveAttribute('data-theme', 'light');

  await page.reload();
  await expect(html(page)).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('radio', { name: pt.settings.theme.light })).toBeChecked();

  // A escolha vale em todas as telas, não só em Ajustes.
  await page.goto('/hoje');
  await expect(html(page)).toHaveAttribute('data-theme', 'light');
});

test('CA01.3 · escolher "Escuro" com SO claro persiste; voltar para "Sistema" segue o SO @e2e', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/ajustes');
  await page.getByRole('radio', { name: pt.settings.theme.dark }).check();
  await page.reload();
  await expect(html(page)).toHaveAttribute('data-theme', 'dark');

  await page.getByRole('radio', { name: pt.settings.theme.system }).check();
  await expect(html(page)).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(html(page)).toHaveAttribute('data-theme', 'dark');
});

test('CA01.3 · o tema certo já está aplicado antes do React montar (sem piscar) @e2e', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/ajustes');
  await page.getByRole('radio', { name: pt.settings.theme.light }).check();

  // Registra o data-theme no primeiro momento em que o <body> existe, antes do bundle rodar.
  await page.addInitScript(() => {
    document.addEventListener('readystatechange', () => {
      if (document.readyState === 'interactive' && !('__temaInicial' in window)) {
        (window as unknown as { __temaInicial: string | null }).__temaInicial =
          document.documentElement.getAttribute('data-theme');
      }
    });
  });
  await page.reload();
  expect(
    await page.evaluate(() => (window as unknown as { __temaInicial?: string }).__temaInicial),
  ).toBe('light');
});

for (const colorScheme of ['light', 'dark'] as const) {
  test(`T01.3 · seletor de tema em Ajustes é acessível no tema ${colorScheme} @e2e @axe`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/ajustes');
    await expect(page.getByRole('radiogroup', { name: pt.settings.theme.title })).toBeVisible();
    await expectNoA11yViolations(page);
    await expectTouchTargets(page);
  });
}

// Testes adicionados pelo QA (qa task T01.3): o "então" é o tema aplicado de fato, não só o atributo.
const bodyLuminance = async (page: import('@playwright/test').Page) => {
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const [r = 0, g = 0, b = 0] = (bg.match(/\d+/g) ?? []).map(Number);
  return (r + g + b) / 3;
};

const overrides = [
  { system: 'dark', choice: pt.settings.theme.light, expected: 'light' },
  { system: 'light', choice: pt.settings.theme.dark, expected: 'dark' },
] as const;

for (const { system, choice, expected } of overrides) {
  test(`CA01.3 · "${choice}" com SO ${system} muda as cores da tela e mantém após recarregar @e2e`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: system });
    await page.goto('/ajustes');
    if (system === 'dark') expect(await bodyLuminance(page)).toBeLessThan(64);
    else expect(await bodyLuminance(page)).toBeGreaterThan(192);

    await page.getByRole('radio', { name: choice }).check();
    const check = async () => {
      if (expected === 'dark') expect(await bodyLuminance(page)).toBeLessThan(64);
      else expect(await bodyLuminance(page)).toBeGreaterThan(192);
    };
    await check();
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await check();
  });

  test(`CA01.4 · contraste AA em /ajustes com "${choice}" escolhido e SO ${system} @e2e @axe`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: system });
    await page.goto('/ajustes');
    await page.getByRole('radio', { name: choice }).check();
    await expect(html(page)).toHaveAttribute('data-theme', expected);
    await expectNoA11yViolations(page);
  });
}

// O WebKit do Playwright (como o Safari no macOS, por padrão) não move o foco com Tab para
// links e controles; nele o foco entra pelo próprio controle e o resto do teste é igual.
test('T01.3 · seletor de tema operável só pelo teclado, com foco visível @e2e', async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/ajustes');
  const system = page.getByRole('radio', { name: pt.settings.theme.system });

  if (browserName === 'webkit') {
    await system.focus();
  } else {
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      if (await system.evaluate((el) => el === document.activeElement)) break;
    }
  }
  await expect(system).toBeFocused();

  // O input é invisível (opacity 0); o anel de foco tem de aparecer no indicador desenhado.
  const outline = await system.evaluate((el) => {
    const indicator = el.nextElementSibling as HTMLElement;
    const s = getComputedStyle(indicator);
    return { style: s.outlineStyle, width: parseFloat(s.outlineWidth) };
  });
  expect(outline.style).not.toBe('none');
  expect(outline.width).toBeGreaterThanOrEqual(2);

  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio', { name: pt.settings.theme.light })).toBeChecked();
  await expect(page.getByRole('radio', { name: pt.settings.theme.light })).toBeFocused();
  await expect(html(page)).toHaveAttribute('data-theme', 'light');
});

test('T01.11 · preferência salva inválida volta a seguir o sistema @e2e', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('repete-habito:tema', '{"state":{"preference":"azul"},"version":0}');
  });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/ajustes');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('radio', { name: pt.settings.theme.system })).toBeChecked();
});

test('T01.11 · preferência salva inválida já sai como tema do sistema antes do React montar @e2e', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem('repete-habito:tema', '{"state":{"preference":"azul"},"version":0}');
    // Registra o data-theme no primeiro momento em que o <body> existe, antes do bundle rodar.
    document.addEventListener('readystatechange', () => {
      if (document.readyState === 'interactive' && !('__temaInicial' in window)) {
        (window as unknown as { __temaInicial: string | null }).__temaInicial =
          document.documentElement.getAttribute('data-theme');
      }
    });
  });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/ajustes');
  expect(
    await page.evaluate(() => (window as unknown as { __temaInicial?: string }).__temaInicial),
  ).toBe('dark');
});
