import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { systemClock } from '../../platform/clock/system-clock.ts';
import { ButtonLink } from '../../ui/components/Button.tsx';
import { EmptyState } from '../../ui/components/EmptyState.tsx';
import { LobeHeader } from '../../ui/components/LobeHeader.tsx';
import { MarkCapsule } from '../../ui/components/MarkCapsule.tsx';

// Tela Hoje (brief de UX §6). Enquanto não há atividades (dados chegam em F02/F03/F05),
// mostra o estado vazio e um exemplo da cápsula de marcar que não é salvo.
export function TodayPage() {
  const { t, i18n } = useTranslation();
  const [exampleDone, setExampleDone] = useState(false);
  const date = new Intl.DateTimeFormat(i18n.language, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(systemClock.now());

  return (
    <>
      <LobeHeader>
        <h1 className="title-display text-5xl">{t('today.title')}</h1>
        <p className="mt-2 text-sm font-semibold first-letter:uppercase">{date}</p>
        <p className="mt-3 max-w-[22rem] text-lg font-semibold">{t('today.summaryEmpty')}</p>
      </LobeHeader>

      <EmptyState
        title={t('today.emptyTitle')}
        actions={
          <>
            <ButtonLink to="/atividades">{t('today.create')}</ButtonLink>
            <ButtonLink to="/onboarding" variant="secondary">
              {t('today.guided')}
            </ButtonLink>
          </>
        }
      >
        <p>{t('today.emptyBody')}</p>
      </EmptyState>

      <section aria-labelledby="exemplo-titulo" className="mx-auto w-full max-w-2xl px-5 pb-8">
        <h2 id="exemplo-titulo" className="text-sm font-bold text-text-muted">
          {t('today.exampleTitle')}
        </h2>
        <div className="mt-2 flex min-h-[4.5rem] items-center gap-4 border-y-2 border-surface">
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold tracking-[-0.01em]">{t('today.exampleName')}</p>
            <p className="text-sm text-text-muted">{t('today.exampleMeta')}</p>
          </div>
          <MarkCapsule
            activityName={t('today.exampleName')}
            color="yellow"
            done={exampleDone}
            onToggle={() => setExampleDone((done) => !done)}
          />
        </div>
      </section>
    </>
  );
}
