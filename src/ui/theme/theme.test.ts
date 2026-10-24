import { beforeEach, describe, expect, it, vi } from 'vitest';
import { applyTheme, resolveTheme, THEME_STORAGE_KEY, useThemeStore } from './theme.ts';

function mockSystemDark(dark: boolean) {
  const listeners = new Set<() => void>();
  const mql = {
    matches: dark,
    addEventListener: (_: string, fn: () => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
  };
  vi.stubGlobal('matchMedia', () => mql);
  return {
    set(next: boolean) {
      mql.matches = next;
      listeners.forEach((fn) => fn());
    },
  };
}

describe('resolveTheme', () => {
  it.each([
    ['system', false, 'light'],
    ['system', true, 'dark'],
    ['light', true, 'light'],
    ['dark', false, 'dark'],
  ] as const)('CA01.3 · preferência %s com sistema escuro=%s → %s', (pref, dark, expected) => {
    expect(resolveTheme(pref, dark)).toBe(expected);
  });
});

describe('useThemeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useThemeStore.setState({ preference: 'system' });
  });

  it('CA01.3 · sem preferência salva o padrão é seguir o sistema', () => {
    expect(useThemeStore.getState().preference).toBe('system');
  });

  it('CA01.3 · a escolha é gravada no armazenamento local', () => {
    useThemeStore.getState().setPreference('light');
    const saved = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) ?? '{}') as {
      state?: { preference?: string };
    };
    expect(saved.state?.preference).toBe('light');
  });
});

describe('applyTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    useThemeStore.setState({ preference: 'system' });
  });

  it('CA01.3 · aplica data-theme conforme a preferência e acompanha mudanças do sistema', () => {
    const system = mockSystemDark(true);
    const stop = applyTheme();
    expect(document.documentElement.dataset.theme).toBe('dark');

    system.set(false);
    expect(document.documentElement.dataset.theme).toBe('light');

    useThemeStore.getState().setPreference('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');

    // Com escolha manual, mudar o sistema não altera o tema.
    system.set(true);
    system.set(false);
    expect(document.documentElement.dataset.theme).toBe('dark');

    stop();
    useThemeStore.getState().setPreference('light');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
