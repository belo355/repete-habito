import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectNoA11yViolations, setTheme, type Theme } from '../test/a11y.ts';
import { LobeHeader } from './LobeHeader.tsx';

describe.each<Theme>(['light', 'dark'])('LobeHeader no tema %s', (theme) => {
  it('CA01.4 · texto sobre o lobo com contraste AA e sem violações do axe', async () => {
    setTheme(theme);
    const screen = await render(
      <LobeHeader>
        <p>sábado, 24 de outubro</p>
        <h1>Hoje</h1>
        <p>Você treinou 4 de 5 dias planejados.</p>
      </LobeHeader>,
    );
    await expect.element(screen.getByRole('heading', { name: 'Hoje' })).toBeVisible();
    await expectNoA11yViolations();
  });
});
