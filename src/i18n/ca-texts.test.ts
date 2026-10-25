import { describe, expect, it } from 'vitest';
import ptBR from './pt-BR.json';

// qa.md §4 · Textos que o próprio critério de aceite de product.md 4.9.2 cita entre aspas.
// Os E2E leem os rótulos de pt-BR.json (qa.md §3.3, item 6) e por isso acompanham qualquer
// mudança de texto; este teste fixa as palavras exigidas pelo critério.
describe('textos exigidos pelos critérios da F01', () => {
  it('CA01.2 · o convite próprio se chama "Instalar app"', () => {
    expect(ptBR.install.button).toBe('Instalar app');
  });

  it('CA01.2 · a instrução do iOS se chama "Adicionar à Tela de Início"', () => {
    expect(ptBR.install.ios.title).toBe('Adicionar à Tela de Início');
  });

  it('CA01.5 · o aviso diz "Nova versão disponível"', () => {
    expect(ptBR.update.available).toBe('Nova versão disponível');
  });
});
