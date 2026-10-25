import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  addDays,
  compareLocalDate,
  dayOfWeek,
  daysInMonth,
  diffInDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  fromEpochDay,
  InvalidLocalDateError,
  isoWeek,
  isLocalDate,
  localDate,
  localDateAt,
  parseLocalDate,
  startOfMonth,
  startOfWeek,
  toEpochDay,
  toParts,
  type LocalDate,
} from './local-date.ts';

const d = (text: string) => parseLocalDate(text);

describe('parseLocalDate / isLocalDate', () => {
  it.each(['2026-10-24', '2024-02-29', '0001-01-01', '9999-12-31', '2000-02-29'])(
    'aceita %s',
    (text) => {
      expect(parseLocalDate(text)).toBe(text);
      expect(isLocalDate(text)).toBe(true);
    },
  );

  it.each([
    '2023-02-29',
    '1900-02-29',
    '2026-13-01',
    '2026-00-10',
    '2026-04-31',
    '2026-1-01',
    '26-01-01',
    '',
    '2026-10-24T00:00',
    '0000-01-01',
  ])('rejeita %j com erro tipado', (text) => {
    expect(() => parseLocalDate(text)).toThrow(InvalidLocalDateError);
    expect(isLocalDate(text)).toBe(false);
  });

  it('rejeita valores que não são texto', () => {
    expect(isLocalDate(20261024)).toBe(false);
    expect(isLocalDate(null)).toBe(false);
  });

  it('localDate monta a partir de ano, mês e dia e valida', () => {
    expect(localDate(2026, 1, 5)).toBe('2026-01-05');
    expect(() => localDate(2026, 2, 30)).toThrow(InvalidLocalDateError);
    expect(toParts(d('2026-10-24'))).toEqual({ year: 2026, month: 10, day: 24 });
  });
});

describe('dias corridos (epoch day)', () => {
  it.each([
    ['1970-01-01', 0],
    ['1970-01-02', 1],
    ['1969-12-31', -1],
    ['2000-03-01', 11017],
    ['2026-10-24', 20750],
  ])('%s ↔ %i', (text, epochDay) => {
    expect(toEpochDay(d(text))).toBe(epochDay);
    expect(fromEpochDay(epochDay)).toBe(text);
  });

  it('ida e volta para qualquer data válida (propriedade)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: toEpochDay(d('0001-01-01')), max: toEpochDay(d('9999-12-31')) }),
        (n) => {
          expect(toEpochDay(fromEpochDay(n))).toBe(n);
        },
      ),
    );
  });

  it('rejeita dias fora de 0001-01-01..9999-12-31', () => {
    expect(() => fromEpochDay(toEpochDay(d('9999-12-31')) + 1)).toThrow(InvalidLocalDateError);
  });
});

describe('addDays / diffInDays / compare', () => {
  it.each([
    ['2026-10-24', 1, '2026-10-25'],
    ['2026-10-31', 1, '2026-11-01'],
    ['2026-12-31', 1, '2027-01-01'],
    ['2024-02-28', 1, '2024-02-29'],
    ['2023-02-28', 1, '2023-03-01'],
    ['2026-03-01', -1, '2026-02-28'],
    ['2026-10-24', -365, '2025-10-24'],
    ['2026-10-24', 0, '2026-10-24'],
  ])('%s %+i dia(s) = %s', (from, n, expected) => {
    expect(addDays(d(from), n)).toBe(expected);
    expect(diffInDays(d(expected), d(from))).toBe(n);
  });

  it('somar e subtrair n dias volta à mesma data (propriedade)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: toEpochDay(d('1900-01-01')), max: toEpochDay(d('2100-12-31')) }),
        fc.integer({ min: -3650, max: 3650 }),
        (day, n) => {
          const date = fromEpochDay(day);
          expect(addDays(addDays(date, n), -n)).toBe(date);
          expect(diffInDays(addDays(date, n), date)).toBe(n);
        },
      ),
    );
  });

  it('rejeita deslocamento não inteiro', () => {
    expect(() => addDays(d('2026-10-24'), 1.5)).toThrow(RangeError);
  });

  it('compara datas', () => {
    expect(compareLocalDate(d('2026-10-24'), d('2026-10-25'))).toBe(-1);
    expect(compareLocalDate(d('2026-10-25'), d('2026-10-24'))).toBe(1);
    expect(compareLocalDate(d('2026-10-24'), d('2026-10-24'))).toBe(0);
  });
});

describe('semana (segunda a domingo) e mês', () => {
  it.each([
    ['2026-10-25', 0], // domingo
    ['2026-10-26', 1], // segunda
    ['2026-10-24', 6], // sábado
    ['1970-01-01', 4], // quinta
    ['2024-02-29', 4],
  ])('%s é dia %i da semana (0 = domingo)', (text, dow) => {
    expect(dayOfWeek(d(text))).toBe(dow);
  });

  it.each([
    ['2026-10-21', '2026-10-19', '2026-10-25'], // quarta
    ['2026-10-19', '2026-10-19', '2026-10-25'], // segunda
    ['2026-10-25', '2026-10-19', '2026-10-25'], // domingo pertence à semana que começou na segunda
    ['2026-10-29', '2026-10-26', '2026-11-01'], // semana atravessa dois meses
    ['2026-12-31', '2026-12-28', '2027-01-03'], // e dois anos
  ])('semana de %s vai de %s a %s', (text, start, end) => {
    expect(startOfWeek(d(text))).toBe(start);
    expect(endOfWeek(d(text))).toBe(end);
  });

  it.each([
    ['2026-10-24', '2026-10-01', '2026-10-31'],
    ['2024-02-10', '2024-02-01', '2024-02-29'],
    ['2023-02-10', '2023-02-01', '2023-02-28'],
    ['2026-04-30', '2026-04-01', '2026-04-30'],
  ])('mês de %s vai de %s a %s', (text, start, end) => {
    expect(startOfMonth(d(text))).toBe(start);
    expect(endOfMonth(d(text))).toBe(end);
  });

  it.each([
    [2024, 2, 29],
    [2023, 2, 28],
    [1900, 2, 28],
    [2000, 2, 29],
    [2026, 11, 30],
    [2026, 12, 31],
  ])('%i-%i tem %i dias', (year, month, days) => {
    expect(daysInMonth(year, month)).toBe(days);
  });

  it('eachDayOfInterval lista os dias, inclusive as pontas', () => {
    expect(eachDayOfInterval(d('2026-10-30'), d('2026-11-02'))).toEqual([
      '2026-10-30',
      '2026-10-31',
      '2026-11-01',
      '2026-11-02',
    ]);
    expect(eachDayOfInterval(d('2026-10-24'), d('2026-10-24'))).toEqual(['2026-10-24']);
    expect(eachDayOfInterval(d('2026-10-25'), d('2026-10-24'))).toEqual([]);
  });

  it('toda semana tem 7 dias e começa na segunda (propriedade)', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 60000 }), (day) => {
        const date = fromEpochDay(day);
        const start = startOfWeek(date);
        expect(dayOfWeek(start)).toBe(1);
        expect(diffInDays(endOfWeek(date), start)).toBe(6);
        expect(compareLocalDate(start, date)).toBeLessThanOrEqual(0);
      }),
    );
  });
});

describe('localDateAt (instante → dia no fuso do usuário)', () => {
  // 2026-10-24T02:30:00Z
  const instant = Date.UTC(2026, 9, 24, 2, 30);

  it.each([
    ['America/Sao_Paulo', '2026-10-23'],
    ['UTC', '2026-10-24'],
    ['Pacific/Auckland', '2026-10-24'],
  ])('em %s o instante cai em %s', (timeZone, expected) => {
    expect(localDateAt(instant, timeZone)).toBe(expected as LocalDate);
  });

  it('rejeita fuso inválido', () => {
    expect(() => localDateAt(instant, 'Lua/Base')).toThrow(RangeError);
  });

  it('rejeita instante inválido', () => {
    expect(() => localDateAt(Number.NaN, 'UTC')).toThrow(RangeError);
  });
});

describe('isoWeek', () => {
  it.each([
    ['2026-10-25', 43],
    ['2026-10-19', 43],
    ['2026-01-01', 1],
    ['2025-12-29', 1],
    ['2021-01-03', 53],
    ['2020-12-31', 53],
    ['2027-01-03', 53],
    ['2027-01-04', 1],
  ])('%s é a semana %i', (text, week) => {
    expect(isoWeek(d(text))).toBe(week);
  });

  it('é igual para todos os dias de uma semana de segunda a domingo', () => {
    fc.assert(
      fc.property(fc.integer({ min: -100_000, max: 100_000 }), (epochDay) => {
        const monday = startOfWeek(fromEpochDay(epochDay));
        const week = isoWeek(monday);
        expect(week).toBeGreaterThanOrEqual(1);
        expect(week).toBeLessThanOrEqual(53);
        for (let i = 1; i < 7; i++) expect(isoWeek(addDays(monday, i))).toBe(week);
      }),
    );
  });
});
