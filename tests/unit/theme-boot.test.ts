import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { THEME_STORAGE_KEY } from '../../src/ui/theme/theme.ts';

// CA01.3 (apoio) · O script inline do index.html lê a mesma chave que o store de tema grava.
describe('script de tema no index.html', () => {
  it('CA01.3 · usa a chave do store de tema', () => {
    expect(readFileSync('index.html', 'utf8')).toContain(`'${THEME_STORAGE_KEY}'`);
  });
});
