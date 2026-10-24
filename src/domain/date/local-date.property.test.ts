import fc from 'fast-check';
import { afterEach, describe, expect, it } from 'vitest';
import { today, type Clock } from './clock.ts';
import {
  addDays,
  dayOfWeek,
  diffInDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  fromEpochDay,
  localDateAt,
  parseLocalDate,
  startOfMonth,
  startOfWeek,
  toEpochDay,
  type LocalDate,
} from './local-date.ts';

// qa.md §5 · INV05 (domínio puro e determinístico) e INV08 (o LocalDate de um registro não muda),
// no que já existe no domínio: o módulo de datas (T01.8, dívida D1).

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const PROCESS_ZONES = ['America/Sao_Paulo', 'Pacific/Auckland', 'UTC'] as const;
const originalTz = process.env.TZ;

const anyDate = fc
  .integer({
    min: toEpochDay(parseLocalDate('1900-01-01')),
    max: toEpochDay(parseLocalDate('2100-12-31')),
  })
  .map(fromEpochDay);
// 1971..2100: instantes sem ambiguidade de calendário.
const anyInstant = fc.integer({ min: 365 * DAY_MS, max: 4_133_894_400_000 });

// Resultado de cada função do módulo para uma data e um instante. Serve para comparar chamadas.
function snapshot(date: LocalDate, n: number, instant: number) {
  const clock: Clock = { now: () => instant, timeZone: () => 'Pacific/Auckland' };
  return {
    parse: parseLocalDate(date),
    epoch: toEpochDay(date),
    add: addDays(date, n),
    diff: diffInDays(addDays(date, n), date),
    dow: dayOfWeek(date),
    week: [startOfWeek(date), endOfWeek(date)],
    month: [startOfMonth(date), endOfMonth(date)],
    days: eachDayOfInterval(date, addDays(date, Math.abs(n) % 10)),
    at: PROCESS_ZONES.map((zone) => localDateAt(instant, zone)),
    today: today(clock),
  };
}

describe('INV05 · domínio de datas puro e determinístico', () => {
  afterEach(() => {
    process.env.TZ = originalTz;
  });

  it('INV05 · mesma entrada, mesma saída: duas chamadas seguidas dão resultados iguais', () => {
    fc.assert(
      fc.property(anyDate, fc.integer({ min: -400, max: 400 }), anyInstant, (date, n, instant) => {
        expect(snapshot(date, n, instant)).toEqual(snapshot(date, n, instant));
      }),
    );
  });

  it('INV05 · o fuso do processo não muda nenhum resultado (São Paulo, Auckland, UTC)', () => {
    fc.assert(
      fc.property(anyDate, fc.integer({ min: -400, max: 400 }), anyInstant, (date, n, instant) => {
        const results = PROCESS_ZONES.map((zone) => {
          process.env.TZ = zone;
          return snapshot(date, n, instant);
        });
        expect(results[1]).toEqual(results[0]);
        expect(results[2]).toEqual(results[0]);
      }),
      { numRuns: 200 },
    );
  });
});

describe('INV08 · o LocalDate não muda depois de fixado', () => {
  it('INV08 · ler a data gravada devolve exatamente o mesmo texto', () => {
    fc.assert(
      fc.property(anyDate, (date) => {
        const stored = String(date);
        expect(parseLocalDate(stored)).toBe(stored);
        expect(fromEpochDay(toEpochDay(parseLocalDate(stored)))).toBe(stored);
        expect(addDays(parseLocalDate(stored), 0)).toBe(stored);
      }),
    );
  });

  it('INV08 · o dia de um instante depende só do fuso informado (oráculo de deslocamento fixo)', () => {
    fc.assert(
      fc.property(anyInstant, (instant) => {
        expect(localDateAt(instant, 'UTC')).toBe(fromEpochDay(Math.floor(instant / DAY_MS)));
        // Etc/GMT+3 = UTC−3; Etc/GMT-13 = UTC+13 (sinal invertido no padrão IANA).
        expect(localDateAt(instant, 'Etc/GMT+3')).toBe(
          fromEpochDay(Math.floor((instant - 3 * HOUR_MS) / DAY_MS)),
        );
        expect(localDateAt(instant, 'Etc/GMT-13')).toBe(
          fromEpochDay(Math.floor((instant + 13 * HOUR_MS) / DAY_MS)),
        );
      }),
    );
  });

  it('INV08 · São Paulo (sem horário de verão desde 2019) segue UTC−3 em 2020–2025', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: Date.UTC(2020, 0, 1), max: Date.UTC(2025, 11, 31) }),
        (instant) => {
          expect(localDateAt(instant, 'America/Sao_Paulo')).toBe(
            fromEpochDay(Math.floor((instant - 3 * HOUR_MS) / DAY_MS)),
          );
        },
      ),
    );
  });
});
