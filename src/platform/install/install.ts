import { create } from 'zustand';
import { isIOSDevice, isRunningStandalone } from './detect.ts';

// Evento do Chrome (Android/desktop) quando o app atende aos critérios de instalação.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

type InstallState = {
  /** iPhone/iPad: não há evento de instalação; mostramos a instrução visual. */
  isIOS: boolean;
  /** O app já está aberto como app instalado. */
  isStandalone: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
  promptInstall: () => Promise<void>;
};

export const useInstallStore = create<InstallState>()((set, get) => ({
  isIOS: false,
  isStandalone: false,
  deferredPrompt: null,
  promptInstall: async () => {
    const event = get().deferredPrompt;
    if (!event) return;
    // O evento só pode ser usado uma vez, aceito ou não.
    set({ deferredPrompt: null });
    await event.prompt();
    const { outcome } = await event.userChoice;
    if (outcome === 'accepted') set({ isStandalone: true });
  },
}));

// Chamado no bootstrap, antes do React: o beforeinstallprompt pode chegar logo no carregamento.
export function listenForInstallPrompt() {
  const standaloneQuery = window.matchMedia('(display-mode: standalone)');
  const readStandalone = () =>
    isRunningStandalone({
      displayModeStandalone: standaloneQuery.matches,
      iosStandalone: (navigator as Navigator & { standalone?: boolean }).standalone === true,
    });

  useInstallStore.setState({
    isIOS: isIOSDevice({
      userAgent: navigator.userAgent,
      maxTouchPoints: navigator.maxTouchPoints,
    }),
    isStandalone: readStandalone(),
  });

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault(); // sem a mini barra do navegador: usamos o convite próprio
    useInstallStore.setState({ deferredPrompt: event as BeforeInstallPromptEvent });
  });
  window.addEventListener('appinstalled', () => {
    useInstallStore.setState({ deferredPrompt: null, isStandalone: true });
  });
  standaloneQuery.addEventListener('change', () =>
    useInstallStore.setState({ isStandalone: readStandalone() }),
  );
}
