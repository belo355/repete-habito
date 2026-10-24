import { useId } from 'react';
import { useThemeStore, type ThemePreference } from '../../ui/theme/theme.ts';

const options: ReadonlyArray<{ value: ThemePreference; label: string }> = [
  { value: 'system', label: 'Igual ao sistema' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
];

export function ThemeSetting() {
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);
  const titleId = useId();

  return (
    <div role="radiogroup" aria-labelledby={titleId}>
      <h2 id={titleId} className="mb-2 text-lg font-bold">
        Tema
      </h2>
      {options.map(({ value, label }) => (
        // O input cobre o rótulo inteiro (alvo ≥ 44 px); o círculo visível é desenhado pelo span.
        <label key={value} className="relative flex min-h-touch cursor-pointer items-center gap-3">
          <input
            type="radio"
            name="tema"
            value={value}
            checked={preference === value}
            onChange={() => setPreference(value)}
            className="peer absolute inset-0 m-0 size-full cursor-pointer opacity-0"
          />
          <span
            aria-hidden="true"
            className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-border peer-checked:border-primary peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus peer-checked:[&>span]:block"
          >
            <span className="hidden size-2.5 rounded-full bg-primary" />
          </span>
          {label}
        </label>
      ))}
    </div>
  );
}
