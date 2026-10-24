import { describe, expect, it } from 'vitest';
import { today, type Clock } from './clock.ts';
import { localDateAt, parseLocalDate, type LocalDate } from './local-date.ts';

// qa.md §4 · CA05.5 (parte U) e T01.9: virada de dia. O dia de um registro é o LocalDate do
// momento em que ele é feito, no fuso do usuário, e não muda quando o relógio passa da meia-noite.
// Roda nos 3 fusos do processo (pnpm test:tz); os resultados não dependem do TZ do processo.

const at = (iso: string) => Date.parse(iso);

function movingClock(startIso: string, timeZone: string) {
  let now = at(startIso);
  const clock: Clock = { now: () => now, timeZone: () => timeZone };
  return {
    clock,
    advanceMinutes: (minutes: number) => {
      now += minutes * 60_000;
    },
  };
}

describe('virada de dia', () => {
  it.each([
    ['America/Sao_Paulo', '2026-10-24T23:59:00-03:00'],
    ['Pacific/Auckland', '2026-10-24T23:59:00+13:00'],
    ['UTC', '2026-10-24T23:59:00Z'],
  ])(
    'CA05.5 · em %s, registro feito às 23:59 fica no dia anterior depois da meia-noite',
    (timeZone, startIso) => {
      const { clock, advanceMinutes } = movingClock(startIso, timeZone);
      const recordDate: LocalDate = today(clock); // registro feito às 23:59
      expect(recordDate).toBe('2026-10-24');

      advanceMinutes(2); // 00:01 do dia seguinte
      expect(today(clock)).toBe('2026-10-25');
      expect(recordDate).toBe('2026-10-24');
    },
  );

  it.each([
    ['America/Sao_Paulo', '2026-10-24T23:59:59.999-03:00', '2026-10-25T00:00:00.000-03:00'],
    ['Pacific/Auckland', '2026-10-24T23:59:59.999+13:00', '2026-10-25T00:00:00.000+13:00'],
    ['UTC', '2026-10-24T23:59:59.999Z', '2026-10-25T00:00:00.000Z'],
  ])('T01.9 · em %s o dia troca exatamente à meia-noite local', (timeZone, last, first) => {
    expect(localDateAt(at(last), timeZone)).toBe('2026-10-24');
    expect(localDateAt(at(first), timeZone)).toBe('2026-10-25');
  });
});

describe('registros perto da meia-noite em fusos diferentes', () => {
  it.each([
    // 23:30 em São Paulo = 02:30Z = 15:30 em Auckland (NZDT)
    [
      '2026-10-24T23:30:00-03:00',
      { 'America/Sao_Paulo': '2026-10-24', UTC: '2026-10-25', 'Pacific/Auckland': '2026-10-25' },
    ],
    // 00:30 em São Paulo = 03:30Z
    [
      '2026-10-25T00:30:00-03:00',
      { 'America/Sao_Paulo': '2026-10-25', UTC: '2026-10-25', 'Pacific/Auckland': '2026-10-25' },
    ],
    // 00:30 em Auckland = 11:30Z do dia anterior = 08:30 em São Paulo
    [
      '2026-10-25T00:30:00+13:00',
      { 'America/Sao_Paulo': '2026-10-24', UTC: '2026-10-24', 'Pacific/Auckland': '2026-10-25' },
    ],
    // 23:30 em UTC = 20:30 em São Paulo = 12:30 do dia seguinte em Auckland
    [
      '2026-10-24T23:30:00Z',
      { 'America/Sao_Paulo': '2026-10-24', UTC: '2026-10-24', 'Pacific/Auckland': '2026-10-25' },
    ],
  ] as const)(
    'CA07.6 · base de data: o instante %s cai no dia local de cada fuso',
    (iso, expected) => {
      for (const [timeZone, date] of Object.entries(expected)) {
        expect(localDateAt(at(iso), timeZone), timeZone).toBe(parseLocalDate(date));
      }
    },
  );
});

// Complemento do QA (qa.md §4 · CA07.6): 23:30 e 00:30 no relógio local de cada um dos 3 fusos,
// no horário de verão de Auckland (NZDT, +13) e no inverno (NZST, +12).
describe('23:30 e 00:30 locais em cada fuso', () => {
  it.each([
    ['America/Sao_Paulo', '2026-10-24T23:30:00-03:00', '2026-10-24'],
    ['America/Sao_Paulo', '2026-10-25T00:30:00-03:00', '2026-10-25'],
    ['Pacific/Auckland', '2026-10-24T23:30:00+13:00', '2026-10-24'],
    ['Pacific/Auckland', '2026-10-25T00:30:00+13:00', '2026-10-25'],
    ['Pacific/Auckland', '2026-07-14T23:30:00+12:00', '2026-07-14'],
    ['Pacific/Auckland', '2026-07-15T00:30:00+12:00', '2026-07-15'],
    ['UTC', '2026-10-24T23:30:00Z', '2026-10-24'],
    ['UTC', '2026-10-25T00:30:00Z', '2026-10-25'],
  ])('CA07.6 · base de data: em %s o registro de %s fica em %s', (timeZone, iso, date) => {
    expect(localDateAt(at(iso), timeZone)).toBe(date);
  });
});
