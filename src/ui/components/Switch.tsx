import { Switch as SwitchPrimitive } from 'radix-ui';
import { useId } from 'react';

type SwitchProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
};

// Interruptor liga/desliga com papel `switch`. O botão tem 44 px de altura (alvo de toque);
// a trilha visível é menor e fica centralizada dentro dele. O rótulo também alterna.
export function Switch({ label, checked, onCheckedChange, disabled }: SwitchProps) {
  const id = useId();
  return (
    <div className="flex min-h-touch items-center justify-between gap-4">
      <label htmlFor={id} className="cursor-pointer">
        {label}
      </label>
      <SwitchPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        {...(disabled !== undefined && { disabled })}
        className="group relative inline-flex h-touch w-16 shrink-0 cursor-pointer items-center rounded-full bg-transparent p-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-1 inset-y-2 rounded-full bg-border transition-colors group-data-[state=checked]:bg-primary"
        />
        <SwitchPrimitive.Thumb className="relative ml-2 block size-5 rounded-full bg-bg transition-transform group-data-[state=checked]:translate-x-7 group-data-[state=checked]:bg-on-primary" />
      </SwitchPrimitive.Root>
    </div>
  );
}
