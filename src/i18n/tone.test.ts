import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import ptBR from './pt-BR.json';

// qa.md §5 · INV10: nenhum texto com culpa, punição ou promessa (product 5.2).
const { terms } = JSON.parse(readFileSync('tests/fixtures/forbidden-terms.json', 'utf8')) as {
  terms: string[];
};

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

function flatten(node: unknown, path = ''): Array<[string, string]> {
  if (typeof node === 'string') return [[path, node]];
  if (node && typeof node === 'object') {
    return Object.entries(node).flatMap(([key, value]) =>
      flatten(value, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

function violations(texts: Array<[string, string]>): string[] {
  return texts.flatMap(([key, text]) =>
    terms.filter((term) => normalize(text).includes(normalize(term))).map((t) => `${key}: ${t}`),
  );
}

describe('INV10 · tom dos textos', () => {
  it('INV10 · o verificador detecta termos proibidos, inclusive sem acento', () => {
    expect(violations([['x', 'Você falhou hoje']])).toEqual(['x: falhou']);
    expect(violations([['x', 'Que PREGUIÇA']])).toEqual(['x: preguic']);
    expect(violations([['x', 'Recomeçar também conta']])).toEqual([]);
  });

  it('INV10 · nenhuma string pt-BR tem culpa, punição ou promessa', () => {
    const texts = flatten(ptBR);
    expect(texts.length).toBeGreaterThan(0);
    expect(violations(texts)).toEqual([]);
  });
});
