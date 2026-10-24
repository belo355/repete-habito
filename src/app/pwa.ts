import { registerSW } from 'virtual:pwa-register';

// Registra o service worker (precache do app shell → funciona offline depois do 1º acesso).
// Com registerType 'prompt', uma versão nova fica esperando; o aviso ao usuário é a T01.7.
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  void registerSW({ immediate: true });
}
