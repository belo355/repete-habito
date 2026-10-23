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
    expect(findViolations('const t = new Date();')).toEqual(['new Date()']);
    expect(findViolations('const t = Date.now();')).toEqual(['Date.now']);
    expect(findViolations('const w = window.innerWidth;')).toEqual(['window']);
    expect(findViolations('const g = globalThis.foo;')).toEqual(['globalThis']);
    expect(findViolations('localStorage.getItem("x");')).toEqual(['localStorage']);
    expect(findViolations("import Dexie from 'dexie';")).toEqual(['dexie']);
    expect(findViolations("import { useState } from 'react';")).toEqual(['react']);
    expect(findViolations("const m = await import('react-dom/client');")).toEqual(['react']);
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
