import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import ptBR from './pt-BR.json';

// qa.md §5 · INV11 (parte U): toda chave usada no código existe em pt-BR.
// A outra parte é a regra i18next/no-literal-string do ESLint, bloqueante.
const SRC = 'src';

function sourceFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: 'utf8' })
    .filter((f) => /\.tsx?$/.test(f) && !/\.(test|d)\.tsx?$/.test(f))
    .map((f) => join(SRC, f));
}

// Chaves passadas a t('…') e campos *Key: '…' (listas de navegação, opções).
function usedKeys(code: string): string[] {
  const calls = [...code.matchAll(/\bt\(\s*['"]([\w.-]+)['"]/g)].map((m) => m[1]);
  const fields = [...code.matchAll(/\b\w*Key:\s*['"]([\w.-]+)['"]/g)].map((m) => m[1]);
  return [...calls, ...fields].filter((k): k is string => !!k);
}

function hasKey(key: string): boolean {
  let node: unknown = ptBR;
  for (const part of key.split('.')) {
    if (!node || typeof node !== 'object' || !(part in node)) return false;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === 'string';
}

describe('INV11 · chaves de tradução', () => {
  it('INV11 · o extrator encontra chaves em t() e em campos *Key', () => {
    expect(usedKeys("t('nav.today'); const a = { labelKey: 'nav.label' };")).toEqual([
      'nav.today',
      'nav.label',
    ]);
  });

  it('INV11 · toda chave usada em src existe em pt-BR', () => {
    const missing = sourceFiles().flatMap((file) =>
      usedKeys(readFileSync(file, 'utf8'))
        .filter((key) => !hasKey(key))
        .map((key) => `${file}: ${key}`),
    );
    expect(missing).toEqual([]);
  });

  it('INV11 · o código usa chaves de tradução', () => {
    const total = sourceFiles().flatMap((file) => usedKeys(readFileSync(file, 'utf8'))).length;
    expect(total).toBeGreaterThan(0);
  });
});
