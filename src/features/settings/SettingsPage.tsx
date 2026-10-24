import { useTranslation } from 'react-i18next';
import { ThemeSetting } from './ThemeSetting.tsx';

export function SettingsPage() {
  const { t } = useTranslation();
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">{t('settings.title')}</h1>
      <ThemeSetting />
    </>
  );
}
