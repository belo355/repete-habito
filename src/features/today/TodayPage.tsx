import { useTranslation } from 'react-i18next';

export function TodayPage() {
  const { t } = useTranslation();
  return <h1 className="text-2xl font-bold">{t('today.title')}</h1>;
}
