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
import { MarkCapsule, type CapsuleColor } from './MarkCapsule.tsx';

const colors: CapsuleColor[] = ['yellow', 'coral', 'blue', 'lilac'];

function Example({ color = 'yellow' as CapsuleColor, initial = false }) {
  const [done, setDone] = useState(initial);
  return (
    <MarkCapsule
      activityName="Caminhada"
      color={color}
      done={done}
      onToggle={() => setDone((d) => !d)}
    />
  );
}

describe.each<Theme>(['light', 'dark'])('MarkCapsule no tema %s', (theme) => {
  it.each(colors.flatMap((c) => [[c, false] as const, [c, true] as const]))(
    'CA01.4 · cápsula %s (feito=%s) com contraste AA e sem violações do axe',
    async (color, initial) => {
      setTheme(theme);
      await render(<Example color={color} initial={initial} />);
      await expectNoA11yViolations();
    },
  );

  it('T01.12 · alvo de toque ≥ 44 px', async () => {
    setTheme(theme);
    await render(<Example />);
    expectTouchTargets();
  });
});

describe('MarkCapsule', () => {
  it('T01.12 · 1 toque marca: aria-pressed, texto "Feito" e o ponto atravessa', async () => {
    const screen = await render(<Example />);
    const button = screen.getByRole('button', { name: 'Marcar Caminhada' });
    await expect.element(button).toHaveAttribute('aria-pressed', 'false');
    const chip = button.element().querySelector('[aria-hidden="true"]')!;
    const before = chip.getBoundingClientRect().left;

    await button.click();
    const done = screen.getByRole('button', { name: 'Feito Caminhada' });
    await expect.element(done).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(() => chip.getBoundingClientRect().left).toBeLessThan(before - 40);
  });

  it('T01.12 · teclado: Espaço marca e desmarca, com foco visível', async () => {
    const screen = await render(<Example />);
    await pressTab();
    const button = screen.getByRole('button', { name: 'Marcar Caminhada' });
    await expect.element(button).toHaveFocus();
    expectVisibleFocus(button.element());
    await userEvent.keyboard(' ');
    await expect.element(screen.getByRole('button', { name: 'Feito Caminhada' })).toBeVisible();
    await userEvent.keyboard(' ');
    await expect.element(screen.getByRole('button', { name: 'Marcar Caminhada' })).toBeVisible();
  });
});
