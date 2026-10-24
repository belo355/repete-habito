import { useTranslation } from 'react-i18next';
import { Button } from '../../ui/components/Button.tsx';
import { useUpdateStore } from './update.ts';

type UpdatePromptProps = {
  open: boolean;
  onAccept: () => void;
  onDismiss: () => void;
};

// Aviso de versão nova (CA01.5): região de status anunciada pelo leitor de tela, sem roubar o foco.
export function UpdatePrompt({ open, onAccept, onDismiss }: UpdatePromptProps) {
  const { t } = useTranslation();
  if (!open) return null;
  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-16 z-10 mx-auto max-w-md rounded-lg border border-border bg-surface p-4 text-text shadow-lg"
    >
      <p className="m-0 font-bold">{t('update.available')}</p>
      <p className="mt-1 mb-3 text-text-muted">{t('update.description')}</p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onAccept}>{t('update.accept')}</Button>
        <Button variant="ghost" onClick={onDismiss}>
          {t('update.dismiss')}
        </Button>
      </div>
    </div>
  );
}

export function ConnectedUpdatePrompt() {
  const { needRefresh, applyUpdate, dismiss } = useUpdateStore();
  return (
    <UpdatePrompt open={needRefresh} onAccept={() => void applyUpdate()} onDismiss={dismiss} />
  );
}
