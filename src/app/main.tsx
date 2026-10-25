import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/barlow/latin-500.css';
import '@fontsource/barlow/latin-700.css';
import '@fontsource/barlow-condensed/latin-800.css';
import '../i18n/i18n.ts';
import '../ui/theme.css';
import { listenForInstallPrompt } from '../platform/install/install.ts';
import { applyTheme } from '../ui/theme/theme.ts';
import { App } from './App.tsx';
import { registerServiceWorker } from './pwa.ts';

const root = document.getElementById('root');
if (!root) throw new Error('Elemento #root não encontrado');

applyTheme();
listenForInstallPrompt();
registerServiceWorker();

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
