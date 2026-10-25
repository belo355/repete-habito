import { useTranslation } from 'react-i18next';
import { Button } from '../../ui/components/Button.tsx';
import { useUpdateStore } from './update.ts';

type UpdatePromptProps = {
  open: boolean;
  onAccept: () => void;
  onDismiss: () => void;
};

// Aviso de versão nova (CA01.5). A região de status fica sempre montada e só o conteúdo muda:
// alguns leitores de tela (ex.: VoiceOver no Safari) não anunciam uma região viva que já entra
// preenchida no DOM. O aviso não rouba o foco.
export function UpdatePrompt({ open, onAccept, onDismiss }: UpdatePromptProps) {
  const { t } = useTranslation();
  return (
    <div
      role="status"
      className={
        open
          ? 'fixed inset-x-4 bottom-20 z-10 mx-auto max-w-md rounded-lg border-2 border-text bg-bg p-5 text-text shadow-[0_16px_40px_-12px_rgb(0_0_0/0.4)]'
          : 'sr-only'
      }
    >
      {open && (
        <>
          <p className="title-section m-0 text-xl">{t('update.available')}</p>
          <p className="mt-1 mb-3 text-text-muted">{t('update.description')}</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={onAccept}>{t('update.accept')}</Button>
            <Button variant="ghost" onClick={onDismiss}>
              {t('update.dismiss')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export function ConnectedUpdatePrompt() {
  const { needRefresh, applyUpdate, dismiss } = useUpdateStore();
  return (
    <UpdatePrompt open={needRefresh} onAccept={() => void applyUpdate()} onDismiss={dismiss} />
  );
}
