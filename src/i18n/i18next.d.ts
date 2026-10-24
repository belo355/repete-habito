import type ptBR from './pt-BR.json';

// Chaves tipadas: chamar t() com uma chave que não existe em pt-BR não compila (INV11).
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: typeof ptBR };
    returnNull: false;
  }
}
