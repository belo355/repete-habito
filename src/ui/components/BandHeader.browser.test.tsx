import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectNoA11yViolations, pressTab, setTheme, type Theme } from '../test/a11y.ts';
import { BandHeader } from './BandHeader.tsx';

describe.each<Theme>(['light', 'dark'])('BandHeader no tema %s', (theme) => {
  it('CA01.4 · texto sobre a faixa com contraste AA e sem violações do axe', async () => {
    setTheme(theme);
    const screen = await render(
      <BandHeader>
        <p>Semana 43 · domingo, 25 de outubro</p>
        <h1>Hoje</h1>
        <p>Você apareceu 4 de 5 dias planejados.</p>
      </BandHeader>,
    );
    await expect.element(screen.getByRole('heading', { name: 'Hoje' })).toBeVisible();
    await expectNoA11yViolations();
  });

  it('T01.14 · foco dentro da faixa usa o anel claro, visível sobre o azul', async () => {
    setTheme(theme);
    const screen = await render(
      <BandHeader>
        <button type="button">Hoje</button>
      </BandHeader>,
    );
    await pressTab();
    const button = screen.getByRole('button', { name: 'Hoje' });
    await expect.element(button).toHaveFocus();
    const root = getComputedStyle(document.documentElement);
    const expected = root.getPropertyValue('--color-focus-on-shell').trim();
    const probe = document.createElement('span');
    probe.style.color = expected;
    document.body.append(probe);
    expect(getComputedStyle(button.element()).outlineColor).toBe(getComputedStyle(probe).color);
    probe.remove();
  });
});
