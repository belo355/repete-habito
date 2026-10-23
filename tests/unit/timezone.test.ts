import { describe, expect, it } from 'vitest';

// Garante que a matriz de fuso (TZ=America/Sao_Paulo, Pacific/Auckland, UTC) chega ao runtime.
describe('ambiente de testes', () => {
  it('respeita a variável TZ', () => {
    const tz = process.env.TZ;
    if (!tz) return;
    const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
    expect(resolved === tz || (tz === 'UTC' && resolved === 'Etc/UTC')).toBe(true);
  });
});
