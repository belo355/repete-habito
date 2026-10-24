import { useTranslation } from 'react-i18next';

export function DashboardPage() {
  const { t } = useTranslation();
  return <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>;
}
