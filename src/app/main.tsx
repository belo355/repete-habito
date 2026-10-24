import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../i18n/i18n.ts';
import '../ui/theme.css';
import { applyTheme } from '../ui/theme/theme.ts';
import { App } from './App.tsx';
import { registerServiceWorker } from './pwa.ts';

const root = document.getElementById('root');
if (!root) throw new Error('Elemento #root não encontrado');

applyTheme();
registerServiceWorker();

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
