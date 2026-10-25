import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore, type ThemePreference } from '../../ui/theme/theme.ts';

const options = [
  { value: 'system', labelKey: 'settings.theme.system' },
  { value: 'light', labelKey: 'settings.theme.light' },
  { value: 'dark', labelKey: 'settings.theme.dark' },
] as const satisfies ReadonlyArray<{ value: ThemePreference; labelKey: string }>;

export function ThemeSetting() {
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);
  const titleId = useId();
  const { t } = useTranslation();

  return (
    <div role="radiogroup" aria-labelledby={titleId}>
      <h2 id={titleId} className="title-section mb-2 text-2xl">
        {t('settings.theme.title')}
      </h2>
      {options.map(({ value, labelKey }) => (
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
            className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-text peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus peer-checked:[&>span]:block"
          >
            <span className="hidden size-2.5 rounded-full bg-primary" />
          </span>
          {t(labelKey)}
        </label>
      ))}
    </div>
  );
}
