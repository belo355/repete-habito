import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  expectNoA11yViolations,
  expectTouchTargets,
  expectVisibleFocus,
  pressTab,
  setTheme,
  type Theme,
} from '../../ui/test/a11y.ts';
import { UpdatePrompt } from './UpdatePrompt.tsx';

describe.each<Theme>(['light', 'dark'])('UpdatePrompt no tema %s', (theme) => {
  it('CA01.5 · aviso acessível: contraste AA, alvos ≥ 44 px', async () => {
    setTheme(theme);
    await render(<UpdatePrompt open onAccept={() => {}} onDismiss={() => {}} />);
    await expectNoA11yViolations();
    expectTouchTargets();
  });
});

describe('UpdatePrompt', () => {
  it('CA01.5 · anuncia "Nova versão disponível" em região de status', async () => {
    const screen = await render(<UpdatePrompt open onAccept={() => {}} onDismiss={() => {}} />);
    await expect
      .element(screen.getByRole('status').getByText('Nova versão disponível'))
      .toBeVisible();
  });

  it('CA01.5 · fechado, não mostra nada', async () => {
    const screen = await render(
      <UpdatePrompt open={false} onAccept={() => {}} onDismiss={() => {}} />,
    );
    await expect.element(screen.getByText('Nova versão disponível')).not.toBeInTheDocument();
  });

  it('CA01.5 · só recarrega com o aceite: cada botão chama a ação certa, pelo teclado', async () => {
    const onAccept = vi.fn();
    const onDismiss = vi.fn();
    const screen = await render(<UpdatePrompt open onAccept={onAccept} onDismiss={onDismiss} />);
    expect(onAccept).not.toHaveBeenCalled();

    await pressTab();
    await expect.element(screen.getByRole('button', { name: 'Atualizar agora' })).toHaveFocus();
    await pressTab();
    await expect.element(screen.getByRole('button', { name: 'Agora não' })).toHaveFocus();
    await screen.getByRole('button', { name: 'Agora não' }).click();
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onAccept).not.toHaveBeenCalled();

    await screen.getByRole('button', { name: 'Atualizar agora' }).click();
    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it('CA01.5 · só pelo teclado: foco visível, Enter dispensa e Espaço aceita', async () => {
    const onAccept = vi.fn();
    const onDismiss = vi.fn();
    const screen = await render(<UpdatePrompt open onAccept={onAccept} onDismiss={onDismiss} />);
    const accept = screen.getByRole('button', { name: 'Atualizar agora' });
    const dismiss = screen.getByRole('button', { name: 'Agora não' });

    await pressTab();
    await pressTab();
    await expect.element(dismiss).toHaveFocus();
    expectVisibleFocus(dismiss.element());
    await userEvent.keyboard('{Enter}');
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onAccept).not.toHaveBeenCalled();

    accept.element().focus();
    expectVisibleFocus(accept.element());
    await userEvent.keyboard(' ');
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
