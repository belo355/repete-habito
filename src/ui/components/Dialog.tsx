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
        <DialogPrimitive.Overlay className="fixed inset-0 bg-text/60" />
        <DialogPrimitive.Content
          {...(!description && { 'aria-describedby': undefined })}
          className="fixed top-1/2 left-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-bg p-4 text-text shadow-lg"
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <DialogPrimitive.Title className="m-0 pt-2 text-lg font-bold">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label={t('common.close')}
              className="inline-flex min-h-touch min-w-touch cursor-pointer items-center justify-center rounded-md text-xl text-text hover:bg-surface"
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
