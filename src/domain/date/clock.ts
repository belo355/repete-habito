import { localDateAt, type LocalDate } from './local-date.ts';

/**
 * Porta do relógio (dívida D1). O domínio nunca lê a hora sozinho: recebe `today` como
 * parâmetro ou um Clock injetado. A implementação real fica em platform/clock; os testes
 * usam relógios fixos.
 */
export interface Clock {
  /** Instante atual em epoch ms. */
  now(): number;
  /** Fuso IANA do usuário, ex.: "America/Sao_Paulo". */
  timeZone(): string;
}

export function today(clock: Clock): LocalDate {
  return localDateAt(clock.now(), clock.timeZone());
}
