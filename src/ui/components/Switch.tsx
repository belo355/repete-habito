import { Switch as SwitchPrimitive } from 'radix-ui';
import { useId } from 'react';

type SwitchProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
};

// Interruptor liga/desliga com papel `switch`, de 44 px de altura (alvo de toque). Ligado, o
// trilho fica no azul de estrutura com o ponto de papel, igual nos dois temas. O rótulo também alterna.
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
        className="group inline-flex h-11 w-[4.5rem] shrink-0 cursor-pointer items-center rounded-full border-2 border-text bg-surface p-0.5 data-[state=checked]:bg-shell disabled:cursor-not-allowed disabled:opacity-60"
      >
        <SwitchPrimitive.Thumb className="block size-9 rounded-full border-2 border-text bg-sticker-edge data-[state=checked]:border-on-sticker transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] data-[state=checked]:translate-x-6 motion-reduce:transition-none" />
      </SwitchPrimitive.Root>
    </div>
  );
}
