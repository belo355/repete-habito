import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { ESLint } from 'eslint';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// INV11 (qa.md §5) · a regra i18next/no-literal-string do projeto barra texto fixo em qualquer
// lugar do código (não só no JSX). Os arquivos de exemplo são escritos em disco porque o
// project service do typescript-eslint só analisa arquivos que existem.
const DIR = 'src/features/__i18n_probe__';
const eslint = new ESLint();
let count = 0;

beforeAll(() => mkdirSync(DIR, { recursive: true }));
afterAll(() => rmSync(DIR, { recursive: true, force: true }));

async function literalErrors(code: string, ext: 'ts' | 'tsx' = 'tsx'): Promise<string[]> {
  const file = `${DIR}/probe-${++count}.${ext}`;
  writeFileSync(file, code);
  const [result] = await eslint.lintFiles([file]);
  return (result?.messages ?? [])
    .filter((m) => m.ruleId === 'i18next/no-literal-string')
    .map((m) => m.message);
}

describe('INV11 · nenhum texto fixo no código', () => {
  it.each([
    ['texto no JSX', 'export const Probe = () => <p>Olá</p>;'],
    ['aria-label fixo', 'export const Probe = () => <button type="button" aria-label="Fechar" />;'],
    [
      'texto em objeto renderizado depois',
      "const items = [{ label: 'Hoje' }];\nexport const Probe = () => <ul>{items.map((i) => <li key={i.label}>{i.label}</li>)}</ul>;",
    ],
    [
      'texto em constante local',
      "export const Probe = () => {\n  const msg = 'Olá';\n  return <p>{msg}</p>;\n};",
    ],
    ['template literal no JSX', 'export const Probe = () => <p>{`Olá`}</p>;'],
  ])('INV11 · barra %s', async (_name, code) => {
    expect(await literalErrors(code)).toHaveLength(1);
  });

  it('INV11 · barra texto fixo em arquivo .ts', async () => {
    expect(await literalErrors("export const title = 'Bem-vindo';", 'ts')).toHaveLength(1);
  });

  it('INV11 · permite rotas, chaves de i18n, classes, códigos de idioma e erros internos', async () => {
    expect(
      await literalErrors(
        [
          "import { useTranslation } from 'react-i18next';",
          "const items = [{ to: '/hoje', labelKey: 'nav.today' }] as const;",
          "export const lang = 'pt-BR';",
          'export const Probe = () => {',
          '  const { t } = useTranslation();',
          "  if (!items.length) throw new Error('lista vazia');",
          '  return <p className="p-4">{t(items[0].labelKey)}</p>;',
          '};',
        ].join('\n'),
      ),
    ).toEqual([]);
  });
});
