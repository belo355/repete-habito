import { Switch as SwitchPrimitive } from 'radix-ui';
import { useId } from 'react';

type SwitchProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
};

// Interruptor liga/desliga com papel `switch`, desenhado como cápsula de 44 px de altura
// (alvo de toque). O rótulo também alterna.
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
        className="group inline-flex h-11 w-[4.5rem] shrink-0 cursor-pointer items-center rounded-full border-2 border-text bg-surface p-0.5 data-[state=checked]:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {/* O ponto da cápsula: atravessa para a direita quando ligado (mesmo gesto da marcação). */}
        <SwitchPrimitive.Thumb className="block size-9 rounded-full border-2 border-text bg-chip transition-transform duration-[250ms] ease-[cubic-bezier(0.34,1.25,0.64,1)] data-[state=checked]:translate-x-6 motion-reduce:transition-none" />
      </SwitchPrimitive.Root>
    </div>
  );
}
