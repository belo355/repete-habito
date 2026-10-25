import { useTranslation } from 'react-i18next';
import { today } from '../../domain/date/clock.ts';
import {
  eachDayOfInterval,
  endOfWeek,
  startOfWeek,
  toParts,
} from '../../domain/date/local-date.ts';
import { systemClock } from '../../platform/clock/system-clock.ts';
import { BandHeader } from '../../ui/components/BandHeader.tsx';
import { ButtonLink } from '../../ui/components/Button.tsx';
import { EmptyState } from '../../ui/components/EmptyState.tsx';

// Álbum (DV10): reúne as atividades (F03/F04), o detalhe de cada uma (F08) e as páginas de
// semana e mês (F13). Sem atividades nem registros, os dois estados vazios levam ao próximo passo.
export function AlbumPage() {
  const { t, i18n } = useTranslation();
  // Iniciais dos dias da semana atual (seg–dom), formatadas pelo Intl no idioma do app.
  const weekday = new Intl.DateTimeFormat(i18n.language, { weekday: 'narrow', timeZone: 'UTC' });
  const now = today(systemClock);
  const days = eachDayOfInterval(startOfWeek(now), endOfWeek(now)).map((date) => {
    const { year, month, day } = toParts(date);
    return { date, initial: weekday.format(Date.UTC(year, month - 1, day)) };
  });
  return (
    <>
      <BandHeader>
        <h1 className="title-display text-[4rem]">{t('album.title')}</h1>
        <p className="mt-3 max-w-[22rem] text-lg font-bold">{t('album.summaryEmpty')}</p>
      </BandHeader>

      <EmptyState
        title={t('album.activitiesTitle')}
        actions={<ButtonLink to="/onboarding">{t('album.start')}</ButtonLink>}
      >
        <p>{t('album.activitiesEmptyBody')}</p>
      </EmptyState>

      <div className="mx-auto w-full max-w-2xl px-5">
        <hr className="m-0 border-0 border-t-2 border-surface" />
      </div>

      <EmptyState
        title={t('album.pagesTitle')}
        example={
          // Página da semana ainda sem figurinhas: vagas impressas, só decoração.
          <div aria-hidden="true" className="grid grid-cols-7 gap-1.5">
            {days.map(({ date, initial }) => (
              <div
                key={date}
                className={`flex aspect-[4/5] items-end justify-center rounded-md border-2 border-dashed pb-1 text-sm font-bold ${
                  date === now ? 'border-text text-text' : 'border-border text-text-muted'
                }`}
              >
                {initial}
              </div>
            ))}
          </div>
        }
        actions={
          <ButtonLink to="/hoje" variant="secondary">
            {t('album.goToday')}
          </ButtonLink>
        }
      >
        <p>{t('album.pagesEmptyBody')}</p>
      </EmptyState>
    </>
  );
}
