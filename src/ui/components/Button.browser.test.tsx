import { describe, expect, it, vi } from 'vitest';
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
import { Button } from './Button.tsx';

const variants = ['primary', 'secondary', 'danger', 'ghost'] as const;

describe.each<Theme>(['light', 'dark'])('Button no tema %s', (theme) => {
  it('CA01.4 · todas as variantes têm contraste AA e passam no axe', async () => {
    setTheme(theme);
    await render(
      <div>
        {variants.map((v) => (
          <Button key={v} variant={v}>
            Salvar
          </Button>
        ))}
        <Button disabled>Salvar</Button>
      </div>,
    );
    await expectNoA11yViolations();
  });

  it('T01.5 · alvo de toque ≥ 44 px mesmo com rótulo curto', async () => {
    setTheme(theme);
    await render(<Button>Ok</Button>);
    expectTouchTargets();
  });
});

describe('Button', () => {
  it('T01.5 · é ativado por Enter e Espaço e mostra foco visível', async () => {
    const onClick = vi.fn();
    const screen = await render(<Button onClick={onClick}>Salvar</Button>);
    await pressTab();
    const button = screen.getByRole('button', { name: 'Salvar' });
    await expect.element(button).toHaveFocus();
    expectVisibleFocus(button.element());
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('T01.5 · type="button" por padrão (não envia formulário por engano)', async () => {
    const screen = await render(<Button>Salvar</Button>);
    await expect.element(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });
});
