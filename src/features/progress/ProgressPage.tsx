import { useTranslation } from 'react-i18next';

export function ProgressPage() {
  const { t } = useTranslation();
  return <h1 className="text-2xl font-bold">{t('progress.title')}</h1>;
}
