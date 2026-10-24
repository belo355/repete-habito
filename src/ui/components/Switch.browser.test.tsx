import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  expectNoA11yViolations,
  expectTouchTargets,
  expectVisibleFocus,
  setTheme,
  pressTab,
  type Theme,
} from '../test/a11y.ts';
import { Switch } from './Switch.tsx';

function Example({ initial = false }: { initial?: boolean }) {
  const [on, setOn] = useState(initial);
  return <Switch label="Lembrete diário" checked={on} onCheckedChange={setOn} />;
}

describe.each<Theme>(['light', 'dark'])('Switch no tema %s', (theme) => {
  it.each([false, true])('CA01.4 · ligado=%s passa no axe com contraste AA', async (initial) => {
    setTheme(theme);
    await render(<Example initial={initial} />);
    await expectNoA11yViolations();
  });

  it('T01.5 · alvo de toque ≥ 44 px', async () => {
    setTheme(theme);
    await render(<Example />);
    expectTouchTargets();
  });
});

describe('Switch', () => {
  it('T01.5 · tem papel switch com nome do rótulo e alterna com Espaço', async () => {
    const screen = await render(<Example />);
    const sw = screen.getByRole('switch', { name: 'Lembrete diário' });
    await expect.element(sw).toHaveAttribute('aria-checked', 'false');
    await pressTab();
    await expect.element(sw).toHaveFocus();
    expectVisibleFocus(sw.element());
    await userEvent.keyboard(' ');
    await expect.element(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('T01.5 · tocar no rótulo também alterna', async () => {
    const screen = await render(<Example />);
    await screen.getByText('Lembrete diário').click();
    await expect.element(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });
});
