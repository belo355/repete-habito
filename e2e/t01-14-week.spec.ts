import { waitForServiceWorker } from './support/pwa.ts';
import { pt } from './support/i18n.ts';
import { expect, test } from './support/test.ts';

// Adicionado pelo QA (qa task T01.14): a faixa de Hoje mostra a semana ISO e a data do dia
// local do usuário (isoWeek em domain/date, ligado à tela pelo Clock), inclusive quando o
// mesmo instante cai em dias diferentes conforme o fuso e na semana 53 da virada do ano.
// Também confere que a fonte de texto (Barlow) vem da origem e é usada offline.

const weekText = (week: number, date: string) =>
  pt.today.weekAndDate.replace('{{week}}', String(week)).replace('{{date}}', date);

const cases = [
  // Mesmo instante: domingo de manhã em São Paulo, já segunda em Auckland (UTC+13).
  {
    tz: 'America/Sao_Paulo',
    iso: '2026-10-25T11:30:00Z',
    week: 43,
    date: 'domingo, 25 de outubro',
  },
  {
    tz: 'Pacific/Auckland',
    iso: '2026-10-25T11:30:00Z',
    week: 44,
    date: 'segunda-feira, 26 de outubro',
  },
  // Domingo 03/01/2027 ainda é a semana 53 de 2026; segunda 04/01 é a semana 1.
  { tz: 'UTC', iso: '2027-01-03T12:00:00Z', week: 53, date: 'domingo, 3 de janeiro' },
  { tz: 'UTC', iso: '2027-01-04T12:00:00Z', week: 1, date: 'segunda-feira, 4 de janeiro' },
] as const;

for (const { tz, iso, week, date } of cases) {
  test.describe(tz, () => {
    test.use({ timezoneId: tz });

    test(`T01.14 · faixa de Hoje mostra a semana ${week} e o dia local em ${tz} (${iso}) @e2e @tz`, async ({
      page,
    }) => {
      await page.clock.setFixedTime(new Date(iso));
      await page.goto('/hoje');
      await expect(page.getByRole('heading', { level: 1, name: pt.today.title })).toBeVisible();
      await expect(page.getByText(weekText(week, date), { exact: true })).toBeVisible();
    });
  });
}

test('T01.14 · fonte de texto Barlow vem da origem e é usada offline @e2e @offline', async ({
  page,
  context,
}) => {
  await page.goto('/hoje');
  await waitForServiceWorker(page);
  await context.setOffline(true);
  await page.reload();
  const body = page.getByText(pt.today.emptyBody);
  await expect(body).toBeVisible();
  const family = await body.evaluate((el) => getComputedStyle(el).fontFamily);
  expect(family.replaceAll('"', '').split(',')[0]?.trim()).toBe('Barlow');
  await expect
    .poll(() =>
      page.evaluate(async () => {
        await document.fonts.ready;
        return [...document.fonts].some(
          (face) => face.family.replaceAll('"', '') === 'Barlow' && face.status === 'loaded',
        );
      }),
    )
    .toBe(true);
});
