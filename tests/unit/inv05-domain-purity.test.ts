import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// qa.md §5 · INV05: o domínio é puro e determinístico.
// Parte "busca no código": falha se o código de produção em src/domain usa relógio, janela,
// armazenamento do navegador, Dexie ou React. A parte "regra de fronteira do ESLint" (dexie/react)
// é provada em boundaries.test.ts.
const DOMAIN_DIR = 'src/domain';

const forbidden: ReadonlyArray<{ name: string; pattern: RegExp }> = [
  { name: 'new Date()', pattern: /\bnew\s+Date\s*\(/ },
  { name: 'Date.now', pattern: /\bDate\s*\.\s*now\b/ },
  { name: 'window', pattern: /\bwindow\b/ },
  { name: 'globalThis', pattern: /\bglobalThis\b/ },
  // Formas indiretas de ler o relógio (F-02 da T01.8): Date['now'], alias/desestruturação de Date,
  // self.Date, Temporal.Now e Intl format()/formatToParts() sem instante.
  { name: 'Date (referência ao construtor)', pattern: /(?<![\w$.])Date(?![\w$])/ },
  { name: 'self', pattern: /(?<![\w$.])self(?![\w$])/ },
  { name: 'Temporal.Now', pattern: /\bTemporal\s*(?:\.\s*Now\b|\[)/ },
  { name: 'format() sem instante', pattern: /\.\s*format(?:ToParts)?\s*\(\s*(?:undefined\s*)?\)/ },
  { name: 'localStorage', pattern: /\blocalStorage\b/ },
  { name: 'dexie', pattern: /['"]dexie(?:[/'"])/ },
  { name: 'react', pattern: /['"]react(?:-dom)?(?:[/'"])/ },
];

function stripComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function findViolations(code: string): string[] {
  const clean = stripComments(code);
  return forbidden.filter(({ pattern }) => pattern.test(clean)).map(({ name }) => name);
}

function domainSourceFiles(): string[] {
  return readdirSync(DOMAIN_DIR, { recursive: true, encoding: 'utf8' })
    .filter((f) => /\.tsx?$/.test(f))
    .filter((f) => !/\.test\.tsx?$/.test(f))
    .filter((f) => !f.includes('__boundary_probe__'))
    .map((f) => join(DOMAIN_DIR, f));
}

describe('INV05 · domínio puro', () => {
  it('INV05 · o detector reconhece cada construção proibida', () => {
    expect(findViolations('const t = new Date();')).toEqual([
      'new Date()',
      'Date (referência ao construtor)',
    ]);
    expect(findViolations('const t = Date.now();')).toEqual([
      'Date.now',
      'Date (referência ao construtor)',
    ]);
    expect(findViolations('const w = window.innerWidth;')).toEqual(['window']);
    expect(findViolations('const g = globalThis.foo;')).toEqual(['globalThis']);
    expect(findViolations('localStorage.getItem("x");')).toEqual(['localStorage']);
    expect(findViolations("import Dexie from 'dexie';")).toEqual(['dexie']);
    expect(findViolations("import { useState } from 'react';")).toEqual(['react']);
    expect(findViolations("const m = await import('react-dom/client');")).toEqual(['react']);
  });

  it('INV05 · o detector reconhece formas indiretas de ler o relógio (F-02 da T01.8)', () => {
    const date = 'Date (referência ao construtor)';
    expect(findViolations("const t = Date['now']();")).toEqual([date]);
    expect(findViolations('const { now } = Date;')).toEqual([date]);
    expect(findViolations('const D = Date; D.now();')).toEqual([date]);
    expect(findViolations("const t = globalThis['Date']['now']();")).toEqual(['globalThis', date]);
    expect(findViolations('const t = self.Date.now();')).toEqual(['Date.now', 'self']);
    expect(findViolations('const t = Temporal.Now.instant();')).toEqual(['Temporal.Now']);
    expect(findViolations("const t = Temporal['Now'].instant();")).toEqual(['Temporal.Now']);
    expect(findViolations('const t = new Intl.DateTimeFormat().format();')).toEqual([
      'format() sem instante',
    ]);
    expect(findViolations('const p = fmt.formatToParts( undefined );')).toEqual([
      'format() sem instante',
    ]);
  });

  it('INV05 · o detector não confunde LocalDate, Intl.DateTimeFormat nem format(instante)', () => {
    expect(findViolations('export type LocalDate = string;')).toEqual([]);
    expect(findViolations('throw new InvalidLocalDateError(x);')).toEqual([]);
    expect(findViolations('const f = new Intl.DateTimeFormat("en-CA", { timeZone });')).toEqual([]);
    expect(findViolations('f.formatToParts(epochMs);')).toEqual([]);
    expect(findViolations('const a = obj.Date; const b = it.self;')).toEqual([]);
  });

  it('INV05 · o detector ignora comentários e funções puras de data', () => {
    expect(findViolations('// nunca use new Date() nem window aqui\nexport const x = 1;')).toEqual(
      [],
    );
    expect(findViolations('/* Date.now */ export const f = (today: string) => today;')).toEqual([]);
    expect(findViolations("import { addDays } from 'date-fns';")).toEqual([]);
  });

  it('INV05 · src/domain não usa relógio, window, localStorage, dexie nem react', () => {
    const violations = domainSourceFiles().flatMap((file) =>
      findViolations(readFileSync(file, 'utf8')).map((name) => `${file}: ${name}`),
    );
    expect(violations).toEqual([]);
  });
});
