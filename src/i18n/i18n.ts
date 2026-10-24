import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptBR from './pt-BR.json';

// pt-BR é o único idioma do MVP (product 4.7); a estrutura já aceita outros.
export const defaultLanguage = 'pt-BR';

export const resources = {
  'pt-BR': { translation: ptBR },
} as const;

void i18next.use(initReactI18next).init({
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  resources,
  interpolation: { escapeValue: false }, // o React já escapa
  returnNull: false,
  initAsync: false,
});

export { i18next };
