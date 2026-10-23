import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// CA01.4 (apoio) · Todo par texto × fundo dos tokens atende WCAG AA nos dois temas.
// O axe só audita o que está renderizado; este teste cobre os tokens que ainda não aparecem em tela.
const css = readFileSync('src/ui/theme.css', 'utf8');

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`bloco ${selector} não encontrado`);
  const body = css.slice(start, css.indexOf('}', start));
  const tokens: Record<string, string> = {};
  for (const [, name, value] of body.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)) {
    if (name && value) tokens[name] = value;
  }
  return tokens;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

// [texto, fundo, mínimo]: 4,5:1 para texto normal; 3:1 para bordas e foco (WCAG 1.4.11).
const pairs: Array<[string, string, number]> = [
  ['color-text', 'color-bg', 4.5],
  ['color-text', 'color-surface', 4.5],
  ['color-text-muted', 'color-bg', 4.5],
  ['color-text-muted', 'color-surface', 4.5],
  ['color-primary', 'color-bg', 4.5],
  ['color-primary', 'color-surface', 4.5],
  ['color-on-primary', 'color-primary', 4.5],
  ['color-danger', 'color-bg', 4.5],
  ['color-border', 'color-bg', 3],
  ['color-focus', 'color-bg', 3],
  ['color-focus', 'color-surface', 3],
];

const light = block('@theme static');
const dark = { ...light, ...block(":root[data-theme='dark']") };

it('tema escuro pelo sistema usa os mesmos tokens do tema escuro escolhido', () => {
  expect(block(":root:not([data-theme='light'])")).toEqual(block(":root[data-theme='dark']"));
});

describe.each([
  ['claro', light],
  ['escuro', dark],
])('tokens do tema %s', (_name, tokens) => {
  it.each(pairs)('CA01.4 · %s sobre %s ≥ %s:1', (fg, bg, min) => {
    const a = tokens[fg];
    const b = tokens[bg];
    expect(a, `token --${fg}`).toBeDefined();
    expect(b, `token --${bg}`).toBeDefined();
    expect(contrast(a!, b!)).toBeGreaterThanOrEqual(min);
  });
});
