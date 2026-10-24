import { describe, expect, it } from 'vitest';
import { today, type Clock } from './clock.ts';

const fixedClock = (iso: string, timeZone: string): Clock => ({
  now: () => Date.parse(iso),
  timeZone: () => timeZone,
});

describe('Clock', () => {
  it('today() é o dia local do instante no fuso do relógio', () => {
    expect(today(fixedClock('2026-10-24T23:59:00-03:00', 'America/Sao_Paulo'))).toBe('2026-10-24');
    expect(today(fixedClock('2026-10-24T23:59:00-03:00', 'Pacific/Auckland'))).toBe('2026-10-25');
  });
});
