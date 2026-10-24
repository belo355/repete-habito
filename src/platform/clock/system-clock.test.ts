import { afterEach, describe, expect, it, vi } from 'vitest';
import { today } from '../../domain/date/clock.ts';
import { systemClock } from './system-clock.ts';

describe('systemClock', () => {
  afterEach(() => vi.useRealTimers());

  it('usa a hora do sistema e o fuso do processo', () => {
    vi.useFakeTimers();
    vi.setSystemTime(Date.UTC(2026, 9, 24, 12, 0));
    expect(systemClock.now()).toBe(Date.UTC(2026, 9, 24, 12, 0));
    expect(systemClock.timeZone()).toBe(Intl.DateTimeFormat().resolvedOptions().timeZone);
    expect(today(systemClock)).toMatch(/^2026-10-2[45]$/);
  });
});
