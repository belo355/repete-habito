import { describe, expect, it } from 'vitest';
import { diffInDays, endOfWeek, localDateAt, startOfWeek } from './local-date.ts';

// T01.9 · horário de verão e semanas que atravessam meses, com fusos reais (tzdata).
// Os valores esperados foram conferidos com Intl.DateTimeFormat (timeZoneName: shortOffset).

const at = (iso: string) => Date.parse(iso);
const AUCKLAND = 'Pacific/Auckland';
const SAO_PAULO = 'America/Sao_Paulo';

describe('horário de verão em Auckland (2026)', () => {
  it('CA07.6 · base de data: dia de 23 h no início do horário de verão (27/09, 02:00 → 03:00)', () => {
    expect(localDateAt(at('2026-09-26T11:59:59.999Z'), AUCKLAND)).toBe('2026-09-26');
    expect(localDateAt(at('2026-09-26T12:00:00Z'), AUCKLAND)).toBe('2026-09-27'); // 00:00 NZST
    expect(localDateAt(at('2026-09-26T13:59:59Z'), AUCKLAND)).toBe('2026-09-27'); // 01:59:59 NZST
    expect(localDateAt(at('2026-09-26T14:00:00Z'), AUCKLAND)).toBe('2026-09-27'); // 03:00 NZDT
    expect(localDateAt(at('2026-09-27T10:59:59.999Z'), AUCKLAND)).toBe('2026-09-27');
    expect(localDateAt(at('2026-09-27T11:00:00Z'), AUCKLAND)).toBe('2026-09-28'); // 00:00 NZDT
    // O dia 27 durou 23 horas, mas continua sendo um único dia de calendário.
    expect(at('2026-09-27T11:00:00Z') - at('2026-09-26T12:00:00Z')).toBe(23 * 3_600_000);
  });

  it('CA07.6 · base de data: dia de 25 h no fim do horário de verão (05/04, 03:00 → 02:00)', () => {
    expect(localDateAt(at('2026-04-04T10:59:59.999Z'), AUCKLAND)).toBe('2026-04-04');
    expect(localDateAt(at('2026-04-04T11:00:00Z'), AUCKLAND)).toBe('2026-04-05'); // 00:00 NZDT
    // 02:30 acontece duas vezes; as duas pertencem ao dia 05.
    expect(localDateAt(at('2026-04-04T13:30:00Z'), AUCKLAND)).toBe('2026-04-05'); // 02:30 NZDT
    expect(localDateAt(at('2026-04-04T14:30:00Z'), AUCKLAND)).toBe('2026-04-05'); // 02:30 NZST
    expect(localDateAt(at('2026-04-05T11:59:59.999Z'), AUCKLAND)).toBe('2026-04-05');
    expect(localDateAt(at('2026-04-05T12:00:00Z'), AUCKLAND)).toBe('2026-04-06');
    expect(at('2026-04-05T12:00:00Z') - at('2026-04-04T11:00:00Z')).toBe(25 * 3_600_000);
  });
});

describe('horário de verão histórico em São Paulo (extinto em 2019)', () => {
  it('CA07.6 · base de data: em 04/11/2018 a meia-noite não existiu (23:59:59 → 01:00)', () => {
    expect(localDateAt(at('2018-11-04T02:59:59.999Z'), SAO_PAULO)).toBe('2018-11-03');
    expect(localDateAt(at('2018-11-04T03:00:00Z'), SAO_PAULO)).toBe('2018-11-04'); // 01:00 BRST
  });

  it('CA07.6 · base de data: em 16/02/2019 a hora 23:00–23:59 se repetiu e continua no dia 16', () => {
    expect(localDateAt(at('2019-02-17T01:59:59.999Z'), SAO_PAULO)).toBe('2019-02-16'); // 23:59:59 BRST
    expect(localDateAt(at('2019-02-17T02:00:00Z'), SAO_PAULO)).toBe('2019-02-16'); // 23:00 BRT
    expect(localDateAt(at('2019-02-17T02:59:59.999Z'), SAO_PAULO)).toBe('2019-02-16');
    expect(localDateAt(at('2019-02-17T03:00:00Z'), SAO_PAULO)).toBe('2019-02-17'); // 00:00 BRT
  });

  it('T01.9 · sem horário de verão desde 2019: São Paulo fica em UTC−3 o ano todo', () => {
    for (const month of ['01', '04', '07', '10', '12']) {
      expect(localDateAt(at(`2026-${month}-15T02:59:59Z`), SAO_PAULO)).toBe(`2026-${month}-14`);
      expect(localDateAt(at(`2026-${month}-15T03:00:00Z`), SAO_PAULO)).toBe(`2026-${month}-15`);
    }
  });
});

describe('semanas que atravessam dois meses, a partir de instantes reais', () => {
  it.each([
    // 01/11/2026 02:00Z: sábado 31/10 em São Paulo, domingo 01/11 em Auckland e em UTC
    [SAO_PAULO, '2026-10-31'],
    [AUCKLAND, '2026-11-01'],
    ['UTC', '2026-11-01'],
  ])('T01.9 · em %s o dia local (%s) pertence à semana de 26/10 a 01/11', (timeZone, day) => {
    const date = localDateAt(at('2026-11-01T02:00:00Z'), timeZone);
    expect(date).toBe(day);
    expect(startOfWeek(date)).toBe('2026-10-26');
    expect(endOfWeek(date)).toBe('2026-11-01');
  });

  it('T01.9 · a semana do início do horário de verão em Auckland tem 7 dias de calendário', () => {
    const date = localDateAt(at('2026-09-26T14:00:00Z'), AUCKLAND); // domingo 27/09, 03:00 NZDT
    expect(startOfWeek(date)).toBe('2026-09-21');
    expect(endOfWeek(date)).toBe('2026-09-27');
    expect(diffInDays(endOfWeek(date), startOfWeek(date))).toBe(6);
  });
});
