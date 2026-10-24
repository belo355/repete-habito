import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { ESLint } from 'eslint';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// Prova as regras de fronteira da tech-spec §3 executando o ESLint do projeto sobre código de exemplo.
// O plugin só avalia importações que resolvem para arquivos reais, então criamos alvos temporários em cada camada.
const PROBE = '__boundary_probe__';
const layers = ['domain', 'data', 'platform', 'features'] as const;
const eslint = new ESLint();
let probeCount = 0;

beforeAll(() => {
  for (const layer of layers) {
    mkdirSync(`src/${layer}/${PROBE}`, { recursive: true });
    writeFileSync(`src/${layer}/${PROBE}/target.ts`, 'export const target = 1;\n');
  }
});

afterAll(() => {
  for (const layer of layers) rmSync(`src/${layer}/${PROBE}`, { recursive: true, force: true });
});

async function boundaryErrors(from: string, imports: string[]): Promise<string[]> {
  const code =
    imports.map((source, i) => `import * as m${i} from '${source}';`).join('\n') +
    `\nexport const all = [${imports.map((_, i) => `m${i}`).join(', ')}];\n`;
  // O project service do typescript-eslint só analisa arquivos que existem em disco.
  const filePath = `src/${from}/${PROBE}/probe-${++probeCount}.ts`;
  writeFileSync(filePath, code);
  const [result] = await eslint.lintFiles([filePath]);
  return (result?.messages ?? [])
    .filter((m) => m.ruleId === 'boundaries/dependencies')
    .map((m) => m.message);
}

const target = (layer: string) => `../../${layer}/${PROBE}/target.ts`;

describe('fronteiras de arquitetura', () => {
  it.each(['data', 'platform', 'features'])('domain não importa %s', async (layer) => {
    expect(await boundaryErrors('domain', [target(layer)])).toHaveLength(1);
  });

  it('domain não importa React nem módulos do Node', async () => {
    expect(await boundaryErrors('domain', ['react', 'react-dom/client', 'node:fs'])).toHaveLength(
      3,
    );
  });

  it('domain importa o próprio domain', async () => {
    expect(await boundaryErrors('domain', ['./target.ts'])).toEqual([]);
  });

  it.each(['data', 'platform'])('%s não importa features', async (layer) => {
    expect(await boundaryErrors(layer, [target('features')])).toHaveLength(1);
  });

  it.each(['data', 'platform'])('%s importa domain', async (layer) => {
    expect(await boundaryErrors(layer, [target('domain')])).toEqual([]);
  });

  it('features usa domain, data e platform', async () => {
    expect(
      await boundaryErrors('features', [target('domain'), target('data'), target('platform')]),
    ).toEqual([]);
  });
});

// D1 · INV05: o domínio não lê o relógio nem APIs do navegador (regras do eslint.config.js).
async function domainRuleErrors(code: string): Promise<string[]> {
  const filePath = `src/domain/${PROBE}/clock-probe-${++probeCount}.ts`;
  writeFileSync(filePath, code);
  const [result] = await eslint.lintFiles([filePath]);
  return (result?.messages ?? [])
    .filter((m) => m.ruleId === 'no-restricted-syntax' || m.ruleId === 'no-restricted-globals')
    .map((m) => m.message);
}

describe('relógio e navegador no domínio', () => {
  it.each([
    ['new Date()', 'export const t = new Date();'],
    ['Date()', 'export const t = Date();'],
    ['Date.now()', 'export const t = Date.now();'],
    ['window', 'export const w = window.innerWidth;'],
    ['localStorage', "export const v = localStorage.getItem('x');"],
    ['navigator', 'export const l = navigator.language;'],
  ])('domain não pode usar %s', async (_name, code) => {
    expect(await domainRuleErrors(code)).toHaveLength(1);
  });

  it('domain pode receber o dia como parâmetro', async () => {
    expect(
      await domainRuleErrors(
        'export const isToday = (date: string, today: string) => date === today;',
      ),
    ).toEqual([]);
  });
});
