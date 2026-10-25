import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'system' | 'light' | 'dark';
export type Theme = 'light' | 'dark';

// Mesma chave lida pelo script inline do index.html, que aplica o tema antes do React montar.
export const THEME_STORAGE_KEY = 'repete-habito:tema';

const DARK_QUERY = '(prefers-color-scheme: dark)';

const PREFERENCES: readonly ThemePreference[] = ['system', 'light', 'dark'];

export function isThemePreference(value: unknown): value is ThemePreference {
  return PREFERENCES.includes(value as ThemePreference);
}

export function resolveTheme(preference: ThemePreference, systemIsDark: boolean): Theme {
  if (preference === 'system') return systemIsDark ? 'dark' : 'light';
  return preference;
}

type ThemeState = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => set({ preference }),
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ preference }) => ({ preference }),
      // Valor salvo inválido (armazenamento corrompido ou editado) volta para "seguir o sistema".
      merge: (persisted, current) => {
        const preference = (persisted as { preference?: unknown } | undefined)?.preference;
        return { ...current, preference: isThemePreference(preference) ? preference : 'system' };
      },
    },
  ),
);

// Mantém <html data-theme> igual ao tema efetivo: segue a escolha salva e, em "sistema",
// acompanha o prefers-color-scheme ao vivo. Devolve a função que para de observar.
export function applyTheme(): () => void {
  const media = window.matchMedia(DARK_QUERY);
  const update = () => {
    const root = document.documentElement;
    root.dataset.theme = resolveTheme(useThemeStore.getState().preference, media.matches);
    // A barra do sistema (theme-color) acompanha o fundo do tema efetivo.
    const bg = getComputedStyle(root).getPropertyValue('--color-bg').trim();
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta && bg) meta.content = bg;
  };
  update();
  media.addEventListener('change', update);
  const unsubscribe = useThemeStore.subscribe(update);
  return () => {
    media.removeEventListener('change', update);
    unsubscribe();
  };
}
