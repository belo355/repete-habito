import { useTranslation } from 'react-i18next';
import { PageTitle } from '../../ui/components/EmptyState.tsx';
import { InstallSetting } from './InstallSetting.tsx';
import { ThemeSetting } from './ThemeSetting.tsx';

export function SettingsPage() {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('settings.title')}</PageTitle>
      <div className="mx-auto w-full max-w-2xl px-5 pt-4 pb-10">
        <ThemeSetting />
        <InstallSetting />
        <p className="mt-10 text-sm text-text-muted tabular-nums">
          {t('settings.version', { version: __APP_VERSION__ })}
        </p>
      </div>
    </>
  );
}
