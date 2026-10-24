import type { Clock } from '../../domain/date/clock.ts';

// Relógio real do dispositivo: hora do sistema e fuso atual do usuário.
export const systemClock: Clock = {
  now: () => Date.now(),
  timeZone: () => Intl.DateTimeFormat().resolvedOptions().timeZone,
};
