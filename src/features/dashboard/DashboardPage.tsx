import { useTranslation } from 'react-i18next';
import { ButtonLink } from '../../ui/components/Button.tsx';
import { EmptyState } from '../../ui/components/EmptyState.tsx';
import { LobeHeader } from '../../ui/components/LobeHeader.tsx';

// Dashboard (F13). Sem registros ainda, mostra o estado vazio com atalho para Hoje.
export function DashboardPage() {
  const { t } = useTranslation();
  return (
    <>
      <LobeHeader>
        <h1 className="title-display text-5xl">{t('dashboard.title')}</h1>
        <p className="mt-3 max-w-[22rem] text-lg font-semibold">{t('dashboard.summaryEmpty')}</p>
      </LobeHeader>
      <EmptyState
        title={t('dashboard.emptyTitle')}
        actions={
          <ButtonLink to="/hoje" variant="secondary">
            {t('dashboard.goToday')}
          </ButtonLink>
        }
      >
        <p>{t('dashboard.emptyBody')}</p>
      </EmptyState>
    </>
  );
}
