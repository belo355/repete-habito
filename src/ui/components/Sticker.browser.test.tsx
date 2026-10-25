import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  expectNoA11yViolations,
  expectTouchTargets,
  expectVisibleFocus,
  pressTab,
  setTheme,
  type Theme,
} from '../test/a11y.ts';
import { Sticker, type StickerColor } from './Sticker.tsx';

const colors: StickerColor[] = ['yellow', 'red', 'green', 'magenta', 'cyan'];
const NAME = 'Colar figurinha nº 39 de Caminhada';

function Example({ color = 'yellow' as StickerColor, initial = false }) {
  const [done, setDone] = useState(initial);
  return (
    <Sticker
      activityName="Caminhada"
      color={color}
      count={39}
      done={done}
      onToggle={() => setDone((d) => !d)}
    />
  );
}

describe.each<Theme>(['light', 'dark'])('Sticker no tema %s', (theme) => {
  it.each(colors.flatMap((c) => [[c, false] as const, [c, true] as const]))(
    'CA01.4 · figurinha %s (colada=%s) com contraste AA e sem violações do axe',
    async (color, initial) => {
      setTheme(theme);
      await render(<Example color={color} initial={initial} />);
      await expectNoA11yViolations();
    },
  );

  it('T01.14 · alvo de toque ≥ 44 px', async () => {
    setTheme(theme);
    await render(<Example />);
    expectTouchTargets();
  });
});

describe('Sticker', () => {
  it('T01.14 · 1 toque cola: aria-pressed muda, o nome fica e o texto vira "Nº"', async () => {
    const screen = await render(<Example />);
    const button = screen.getByRole('button', { name: NAME });
    await expect.element(button).toHaveAttribute('aria-pressed', 'false');
    await expect.element(button).toHaveTextContent('39colar');

    await button.click();
    await expect.element(button).toHaveAttribute('aria-pressed', 'true');
    await expect.element(button).toHaveTextContent('Nº39');
    expect(getComputedStyle(button.element()).animationName).toBe('sticker-in');
  });

  it('T01.14 · figurinha que já abre colada não anima', async () => {
    const screen = await render(<Example initial />);
    const button = screen.getByRole('button', { name: NAME });
    await expect.element(button).toHaveAttribute('aria-pressed', 'true');
    expect(getComputedStyle(button.element()).animationName).toBe('none');
  });

  it('T01.14 · teclado: Espaço cola e descola, com foco visível', async () => {
    const screen = await render(<Example />);
    await pressTab();
    const button = screen.getByRole('button', { name: NAME });
    await expect.element(button).toHaveFocus();
    expectVisibleFocus(button.element());
    await userEvent.keyboard(' ');
    await expect.element(button).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard(' ');
    await expect.element(button).toHaveAttribute('aria-pressed', 'false');
  });
});
