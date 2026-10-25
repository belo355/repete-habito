import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { THEME_STORAGE_KEY } from '../../src/ui/theme/theme.ts';

// CA01.3 (apoio) · O script inline do index.html lê a mesma chave que o store de tema grava.
describe('script de tema no index.html', () => {
  it('CA01.3 · usa a chave do store de tema', () => {
    expect(readFileSync('index.html', 'utf8')).toContain(`'${THEME_STORAGE_KEY}'`);
  });
});

// T01.6 · O theme-color inicial do index.html usa o mesmo fundo dos tokens de cada tema.
describe('theme-color no index.html', () => {
  it('T01.6 · usa as cores de fundo dos tokens claro e escuro', () => {
    const html = readFileSync('index.html', 'utf8');
    const css = readFileSync('src/ui/theme.css', 'utf8');
    const light = /@theme static \{[\s\S]*?--color-bg:\s*(#[0-9a-f]{6})/i.exec(css)?.[1];
    const dark = /:root\[data-theme='dark'\] \{[\s\S]*?--color-bg:\s*(#[0-9a-f]{6})/i.exec(
      css,
    )?.[1];
    expect(light).toBeDefined();
    expect(dark).toBeDefined();
    expect(html).toContain(`'${dark!}'`);
    expect(html).toContain(`'${light!}'`);
    expect(html).toContain(`<meta name="theme-color" content="${light!}" />`);
  });
});

// T01.11 · O index.html não tem texto fixo: título e descrição vêm do pt-BR.json no build.
describe('textos do index.html', () => {
  it('T01.11 · título e descrição são marcadores preenchidos pelo i18n', () => {
    const html = readFileSync('index.html', 'utf8');
    expect(html).toContain('<title>%APP_NAME%</title>');
    expect(html).toContain('<meta name="description" content="%APP_DESCRIPTION%" />');
  });
});
