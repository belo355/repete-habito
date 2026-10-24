import { describe, expect, it } from 'vitest';
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
import { Dialog } from './Dialog.tsx';

function Example() {
  return (
    <Dialog
      title="Registrar atividade"
      description="Informe quantos minutos você caminhou."
      trigger={<Button>Abrir</Button>}
    >
      <Button>Confirmar</Button>
    </Dialog>
  );
}

describe.each<Theme>(['light', 'dark'])('Dialog no tema %s', (theme) => {
  it('CA01.4 · aberto, passa no axe com contraste AA', async () => {
    setTheme(theme);
    const screen = await render(<Example />);
    await screen.getByRole('button', { name: 'Abrir' }).click();
    await expect.element(screen.getByRole('dialog')).toBeVisible();
    await expectNoA11yViolations();
  });

  it('T01.5 · botões do diálogo (inclusive Fechar) têm alvo ≥ 44 px', async () => {
    setTheme(theme);
    const screen = await render(<Example />);
    await screen.getByRole('button', { name: 'Abrir' }).click();
    expectTouchTargets(screen.getByRole('dialog').element());
  });
});

describe('Dialog', () => {
  it('T01.5 · tem nome e descrição acessíveis', async () => {
    const screen = await render(<Example />);
    await screen.getByRole('button', { name: 'Abrir' }).click();
    const dialog = screen.getByRole('dialog', { name: 'Registrar atividade' });
    await expect
      .element(dialog)
      .toHaveAccessibleDescription('Informe quantos minutos você caminhou.');
  });

  it('T01.5 · teclado: abre com Enter, prende o foco, fecha com Esc e devolve o foco', async () => {
    const screen = await render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Abrir' });
    await pressTab();
    await expect.element(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');

    const dialog = screen.getByRole('dialog');
    await expect.element(dialog).toBeVisible();
    for (let i = 0; i < 5; i++) {
      await pressTab();
      expect(dialog.element().contains(document.activeElement)).toBe(true);
    }

    await userEvent.keyboard('{Escape}');
    await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
    await expect.element(trigger).toHaveFocus();
  });

  it('T01.5 · teclado: todo controle focado dentro do diálogo tem foco visível', async () => {
    const screen = await render(<Example />);
    await pressTab();
    await userEvent.keyboard('{Enter}');
    await expect.element(screen.getByRole('dialog')).toBeVisible();
    for (const name of ['Fechar', 'Confirmar']) {
      const control = screen.getByRole('button', { name });
      for (let i = 0; i < 3 && document.activeElement !== control.element(); i++) await pressTab();
      await expect.element(control).toHaveFocus();
      expectVisibleFocus(control.element());
    }
  });

  it('T01.5 · botão Fechar tem rótulo do i18n e fecha o diálogo', async () => {
    const screen = await render(<Example />);
    await screen.getByRole('button', { name: 'Abrir' }).click();
    await screen.getByRole('button', { name: 'Fechar' }).click();
    await expect.element(screen.getByRole('dialog')).not.toBeInTheDocument();
  });
});
