import { useTranslation } from 'react-i18next';
import { ButtonLink } from '../../ui/components/Button.tsx';
import { EmptyState, PageTitle } from '../../ui/components/EmptyState.tsx';

// Atividades (F03/F04). Sem atividades ainda, leva ao passo a passo.
export function ActivitiesPage() {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('activities.title')}</PageTitle>
      <EmptyState
        title={t('activities.emptyTitle')}
        actions={<ButtonLink to="/onboarding">{t('activities.start')}</ButtonLink>}
      >
        <p>{t('activities.emptyBody')}</p>
      </EmptyState>
    </>
  );
}
