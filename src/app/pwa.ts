import { registerSW } from 'virtual:pwa-register';
import { useUpdateStore } from './update/update.ts';

// Registra o service worker (precache do app shell → funciona offline depois do 1º acesso).
// registerType 'prompt': uma versão nova fica esperando e o app mostra o aviso; ela só assume,
// com recarga, quando o usuário aceita (CA01.5). Nada recarrega sozinho no meio de um registro.
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      useUpdateStore.getState().showPrompt(async () => {
        // O plugin só recarrega quando o Workbox classifica a versão como "update"; uma versão
        // achada por registration.update() chega como "externa" e ficaria sem recarga. Então
        // recarregamos nós mesmos quando o SW novo assume o controle (clientsClaim).
        let reloading = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (reloading) return;
          reloading = true;
          window.location.reload();
        });
        await updateSW(true);
      });
    },
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      // Procura versão nova sempre que o app volta a ficar visível.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') void registration.update();
      });
    },
  });
}
