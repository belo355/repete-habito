import { create } from 'zustand';

type UpdateState = {
  needRefresh: boolean;
  // Ativa a versão nova (SKIP_WAITING) e recarrega. Só é chamada com o aceite do usuário.
  applyUpdate: () => Promise<void>;
  showPrompt: (applyUpdate: () => Promise<void>) => void;
  dismiss: () => void;
};

export const useUpdateStore = create<UpdateState>()((set) => ({
  needRefresh: false,
  applyUpdate: async () => {},
  showPrompt: (applyUpdate) => set({ needRefresh: true, applyUpdate }),
  dismiss: () => set({ needRefresh: false }),
}));
