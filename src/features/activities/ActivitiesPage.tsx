import { useTranslation } from 'react-i18next';

export function ActivitiesPage() {
  const { t } = useTranslation();
  return <h1 className="text-2xl font-bold">{t('activities.title')}</h1>;
}
