import { useTranslation } from 'react-i18next';
import { ButtonLink } from '../../ui/components/Button.tsx';
import { PageTitle } from '../../ui/components/EmptyState.tsx';

// Boas-vindas do passo a passo (F12 traz as 3 telas: objetivo, atividades e lembrete).
export function OnboardingPage() {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('onboarding.title')}</PageTitle>
      <div className="mx-auto w-full max-w-2xl px-5 pb-10">
        <p className="mt-2 max-w-[22rem] text-xl font-bold">{t('onboarding.tagline')}</p>
        <p className="mt-4 max-w-[60ch] text-text-muted">{t('onboarding.body')}</p>
        <div className="mt-8">
          <ButtonLink to="/hoje">{t('onboarding.goToday')}</ButtonLink>
        </div>
      </div>
    </>
  );
}
