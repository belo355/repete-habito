import { useTranslation } from 'react-i18next';

export function OnboardingPage() {
  const { t } = useTranslation();
  return <h1 className="text-2xl font-bold">{t('onboarding.title')}</h1>;
}
