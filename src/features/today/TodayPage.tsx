import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { today } from '../../domain/date/clock.ts';
import { isoWeek } from '../../domain/date/local-date.ts';
import { systemClock } from '../../platform/clock/system-clock.ts';
import { BandHeader } from '../../ui/components/BandHeader.tsx';
import { ButtonLink } from '../../ui/components/Button.tsx';
import { EmptyState } from '../../ui/components/EmptyState.tsx';
import { Sticker } from '../../ui/components/Sticker.tsx';

// Tela Hoje (contrato "Álbum da semana"). Enquanto não há atividades (dados chegam em
// F02/F03/F05), mostra o estado vazio e uma figurinha de exemplo que não é salva.
export function TodayPage() {
  const { t, i18n } = useTranslation();
  const [exampleDone, setExampleDone] = useState(false);
  const date = new Intl.DateTimeFormat(i18n.language, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(systemClock.now());
  const week = isoWeek(today(systemClock));

  return (
    <>
      <BandHeader>
        <p className="text-[0.9375rem] font-bold first-letter:uppercase">
          {t('today.weekAndDate', { week, date })}
        </p>
        <h1 className="title-display mt-2 text-[4rem] max-[359px]:mt-1 max-[359px]:text-[3.25rem]">
          {t('today.title')}
        </h1>
        <p className="mt-3 max-w-[22rem] text-lg font-bold">{t('today.summaryEmpty')}</p>
      </BandHeader>

      <EmptyState
        title={t('today.emptyTitle')}
        example={
          <section aria-labelledby="exemplo-titulo">
            <h3 id="exemplo-titulo" className="title-section text-xl">
              {t('today.exampleTitle')}
            </h3>
            <div className="mt-2 flex min-h-[5.75rem] items-center gap-4 border-y-2 border-surface py-2 max-[359px]:mt-1 max-[359px]:py-1">
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold">{t('today.exampleName')}</p>
                <p className="text-sm text-text-muted">{t('today.exampleMeta')}</p>
              </div>
              <Sticker
                activityName={t('today.exampleName')}
                color="green"
                count={1}
                done={exampleDone}
                onToggle={() => setExampleDone((done) => !done)}
              />
            </div>
          </section>
        }
        actions={
          <>
            <ButtonLink to="/album">{t('today.create')}</ButtonLink>
            <ButtonLink to="/onboarding" variant="secondary">
              {t('today.guided')}
            </ButtonLink>
          </>
        }
      >
        <p>{t('today.emptyBody')}</p>
      </EmptyState>
    </>
  );
}
