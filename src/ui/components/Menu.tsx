import { DropdownMenu } from 'radix-ui';
import type { ReactNode } from 'react';

export type MenuItem = { label: string; onSelect: () => void; disabled?: boolean };

type MenuProps = {
  // O menu é nomeado pelo gatilho (padrão menu button do APG); gatilho só com ícone precisa de aria-label.
  trigger: ReactNode;
  items: readonly MenuItem[];
};

// Menu de ações: setas navegam, Enter escolhe, Esc fecha e o foco volta ao gatilho (Radix).
// Não modal: não esconde o resto da página com aria-hidden enquanto o gatilho continua focável.
export function Menu({ trigger, items }: MenuProps) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={4}
          align="end"
          className="min-w-48 rounded-lg border-2 border-text bg-bg p-1.5 text-text shadow-[0_10px_24px_-10px_rgb(0_0_0/0.35)]"
        >
          {items.map((item) => (
            <DropdownMenu.Item
              key={item.label}
              onSelect={item.onSelect}
              {...(item.disabled !== undefined && { disabled: item.disabled })}
              className="flex min-h-touch cursor-pointer items-center rounded-sm px-3 font-bold outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 data-[highlighted]:bg-surface data-[highlighted]:outline-3 data-[highlighted]:outline-solid data-[highlighted]:outline-offset-[-3px] data-[highlighted]:outline-focus"
            >
              {item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
