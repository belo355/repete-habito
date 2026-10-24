// Datas de calendário sem hora nem fuso (tech-spec §3.1, dívida D1).
// Um registro pertence a um LocalDate fixado no momento em que é feito; viagem, fuso e
// horário de verão não o movem. Toda a aritmética é feita com inteiros (dias desde
// 1970-01-01), sem objetos Date: o resultado não depende do fuso do processo.

declare const localDateBrand: unique symbol;

/** "AAAA-MM-DD" no calendário do usuário. Em tempo de execução é só uma string. */
export type LocalDate = string & { readonly [localDateBrand]: true };

export class InvalidLocalDateError extends Error {
  constructor(readonly value: unknown) {
    super(`Data inválida: ${String(value)} (esperado AAAA-MM-DD)`);
    this.name = 'InvalidLocalDateError';
  }
}

type Parts = { year: number; month: number; day: number };

const PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MIN_YEAR = 1;
const MAX_YEAR = 9999;

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function isValidParts({ year, month, day }: Parts): boolean {
  return (
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    Number.isInteger(day) &&
    year >= MIN_YEAR &&
    year <= MAX_YEAR &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= daysInMonth(year, month)
  );
}

function format({ year, month, day }: Parts): LocalDate {
  const pad = (n: number, size: number) => String(n).padStart(size, '0');
  return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}` as LocalDate;
}

export function isLocalDate(value: unknown): value is LocalDate {
  if (typeof value !== 'string') return false;
  const match = PATTERN.exec(value);
  if (!match) return false;
  return isValidParts({ year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) });
}

export function parseLocalDate(text: string): LocalDate {
  if (!isLocalDate(text)) throw new InvalidLocalDateError(text);
  return text;
}

export function localDate(year: number, month: number, day: number): LocalDate {
  const parts = { year, month, day };
  if (!isValidParts(parts)) throw new InvalidLocalDateError(`${year}-${month}-${day}`);
  return format(parts);
}

export function toParts(date: LocalDate): Parts {
  return {
    year: Number(date.slice(0, 4)),
    month: Number(date.slice(5, 7)),
    day: Number(date.slice(8, 10)),
  };
}

// Algoritmos days_from_civil / civil_from_days (H. Hinnant), calendário gregoriano proléptico.
export function toEpochDay(date: LocalDate): number {
  const { year: civilYear, month, day } = toParts(date);
  const year = civilYear - (month <= 2 ? 1 : 0);
  const era = Math.floor(year / 400);
  const yearOfEra = year - era * 400;
  const dayOfYear = Math.floor((153 * (month + (month > 2 ? -3 : 9)) + 2) / 5) + day - 1;
  const dayOfEra =
    yearOfEra * 365 + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100) + dayOfYear;
  return era * 146097 + dayOfEra - 719468;
}

export function fromEpochDay(epochDay: number): LocalDate {
  const z = epochDay + 719468;
  const era = Math.floor(z / 146097);
  const dayOfEra = z - era * 146097;
  const yearOfEra = Math.floor(
    (dayOfEra -
      Math.floor(dayOfEra / 1460) +
      Math.floor(dayOfEra / 36524) -
      Math.floor(dayOfEra / 146096)) /
      365,
  );
  const dayOfYear =
    dayOfEra - (365 * yearOfEra + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100));
  const mp = Math.floor((5 * dayOfYear + 2) / 153);
  const day = dayOfYear - Math.floor((153 * mp + 2) / 5) + 1;
  const month = mp + (mp < 10 ? 3 : -9);
  const year = yearOfEra + era * 400 + (month <= 2 ? 1 : 0);
  const parts = { year, month, day };
  if (!isValidParts(parts)) throw new InvalidLocalDateError(epochDay);
  return format(parts);
}

export function addDays(date: LocalDate, days: number): LocalDate {
  if (!Number.isInteger(days)) throw new RangeError(`Número de dias deve ser inteiro: ${days}`);
  return fromEpochDay(toEpochDay(date) + days);
}

/** Quantos dias `later` está depois de `earlier` (negativo se for antes). */
export function diffInDays(later: LocalDate, earlier: LocalDate): number {
  return toEpochDay(later) - toEpochDay(earlier);
}

export function compareLocalDate(a: LocalDate, b: LocalDate): -1 | 0 | 1 {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

/** 0 = domingo … 6 = sábado (mesma convenção das regras de frequência). */
export function dayOfWeek(date: LocalDate): number {
  // 1970-01-01 foi uma quinta-feira (4).
  return (((toEpochDay(date) + 4) % 7) + 7) % 7;
}

/** Segunda-feira da semana (semanas de segunda a domingo, product 4.3.1). */
export function startOfWeek(date: LocalDate): LocalDate {
  return addDays(date, -((dayOfWeek(date) + 6) % 7));
}

/** Domingo da semana. */
export function endOfWeek(date: LocalDate): LocalDate {
  return addDays(startOfWeek(date), 6);
}

export function startOfMonth(date: LocalDate): LocalDate {
  const { year, month } = toParts(date);
  return format({ year, month, day: 1 });
}

export function endOfMonth(date: LocalDate): LocalDate {
  const { year, month } = toParts(date);
  return format({ year, month, day: daysInMonth(year, month) });
}

/** Todos os dias de `start` a `end`, inclusive; vazio se `start` vier depois de `end`. */
export function eachDayOfInterval(start: LocalDate, end: LocalDate): LocalDate[] {
  const days: LocalDate[] = [];
  for (let day = toEpochDay(start); day <= toEpochDay(end); day++) days.push(fromEpochDay(day));
  return days;
}

const formatters = new Map<string, Intl.DateTimeFormat>();

/**
 * Dia do calendário em que um instante (epoch ms) cai no fuso informado.
 * É a única ponte entre tempo absoluto e LocalDate; o instante vem de fora (porta Clock).
 */
export function localDateAt(epochMs: number, timeZone: string): LocalDate {
  if (!Number.isFinite(epochMs)) throw new RangeError(`Instante inválido: ${epochMs}`);
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    formatters.set(timeZone, formatter);
  }
  const parts = Object.fromEntries(
    formatter.formatToParts(epochMs).map(({ type, value }) => [type, value]),
  );
  return localDate(Number(parts.year), Number(parts.month), Number(parts.day));
}
