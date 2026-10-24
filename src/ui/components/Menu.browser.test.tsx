import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  expectNoA11yViolations,
  expectTouchTargets,
  expectVisibleFocus,
  setTheme,
  type Theme,
  pressTab,
} from '../test/a11y.ts';
import { Button } from './Button.tsx';
import { Menu } from './Menu.tsx';

function Example({ onSelect = () => {} }: { onSelect?: (v: string) => void }) {
  return (
    <Menu
      trigger={<Button variant="secondary">Mais</Button>}
      items={[
        { label: 'Editar', onSelect: () => onSelect('editar') },
        { label: 'Pausar', onSelect: () => onSelect('pausar') },
        { label: 'Arquivar', onSelect: () => onSelect('arquivar') },
      ]}
    />
  );
}

describe.each<Theme>(['light', 'dark'])('Menu no tema %s', (theme) => {
  it('CA01.4 · aberto, passa no axe com contraste AA', async () => {
    setTheme(theme);
    const screen = await render(<Example />);
    await screen.getByRole('button', { name: 'Mais' }).click();
    await expect.element(screen.getByRole('menu')).toBeVisible();
    await expectNoA11yViolations();
  });

  it('T01.5 · itens com alvo ≥ 44 px', async () => {
    setTheme(theme);
    const screen = await render(<Example />);
    await screen.getByRole('button', { name: 'Mais' }).click();
    expectTouchTargets(screen.getByRole('menu').element());
  });
});

describe('Menu', () => {
  it('T01.5 · menu é nomeado pelo botão que o abre', async () => {
    const screen = await render(<Example />);
    await screen.getByRole('button', { name: 'Mais' }).click();
    await expect.element(screen.getByRole('menu', { name: 'Mais' })).toBeVisible();
  });

  it('T01.5 · teclado: abre com Enter, setas navegam, Enter escolhe e o foco volta', async () => {
    const onSelect = vi.fn();
    const screen = await render(<Example onSelect={onSelect} />);
    const trigger = screen.getByRole('button', { name: 'Mais' });
    await pressTab();
    await expect.element(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');

    await expect.element(screen.getByRole('menu', { name: 'Mais' })).toBeVisible();
    await expect.element(screen.getByRole('menuitem', { name: 'Editar' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect.element(screen.getByRole('menuitem', { name: 'Pausar' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');

    expect(onSelect).toHaveBeenCalledWith('pausar');
    await expect.element(screen.getByRole('menu')).not.toBeInTheDocument();
    await expect.element(trigger).toHaveFocus();
  });

  it('T01.5 · item em destaque pelo teclado tem foco visível nos 2 temas', async () => {
    for (const theme of ['light', 'dark'] as const) {
      setTheme(theme);
      const screen = await render(<Example />);
      await pressTab();
      await userEvent.keyboard('{Enter}');
      const first = screen.getByRole('menuitem', { name: 'Editar' });
      await expect.element(first).toHaveFocus();
      expectVisibleFocus(first.element());
      await userEvent.keyboard('{ArrowDown}');
      const second = screen.getByRole('menuitem', { name: 'Pausar' });
      await expect.element(second).toHaveFocus();
      expectVisibleFocus(second.element());
      await userEvent.keyboard('{Escape}');
      await screen.unmount();
    }
  });

  it('T01.5 · Esc fecha sem escolher', async () => {
    const onSelect = vi.fn();
    const screen = await render(<Example onSelect={onSelect} />);
    await screen.getByRole('button', { name: 'Mais' }).click();
    await userEvent.keyboard('{Escape}');
    await expect.element(screen.getByRole('menu')).not.toBeInTheDocument();
    expect(onSelect).not.toHaveBeenCalled();
  });
});
