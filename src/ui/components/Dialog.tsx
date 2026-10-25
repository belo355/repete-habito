import { X } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type DialogProps = {
  title: string;
  description?: string;
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

// Diálogo modal: título obrigatório, foco preso, Esc fecha e devolve o foco ao gatilho (Radix).
export function Dialog({ title, description, trigger, children, open, onOpenChange }: DialogProps) {
  const { t } = useTranslation();
  return (
    <DialogPrimitive.Root
      {...(open !== undefined && { open })}
      {...(onOpenChange && { onOpenChange })}
    >
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-text/50" />
        <DialogPrimitive.Content
          {...(!description && { 'aria-describedby': undefined })}
          className="fixed top-1/2 left-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-text bg-bg p-5 text-text shadow-[0_16px_40px_-12px_rgb(0_0_0/0.4)]"
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <DialogPrimitive.Title className="m-0 pt-2 text-xl font-extrabold tracking-[-0.01em]">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label={t('common.close')}
              className="inline-flex min-h-touch min-w-touch cursor-pointer items-center justify-center rounded-full text-text hover:bg-surface"
            >
              <X aria-hidden="true" className="size-6" />
            </DialogPrimitive.Close>
          </div>
          {description && (
            <DialogPrimitive.Description className="mb-4 text-text-muted">
              {description}
            </DialogPrimitive.Description>
          )}
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
