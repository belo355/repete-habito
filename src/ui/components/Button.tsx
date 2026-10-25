import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

/* eslint-disable i18next/no-literal-string -- classes CSS, não é texto para o usuário */
const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary text-on-primary hover:brightness-110',
  secondary: 'border-2 border-border bg-surface text-text hover:bg-bg',
  danger: 'border-2 border-danger bg-bg text-danger hover:bg-surface',
  ghost: 'bg-transparent text-text hover:bg-surface',
};
/* eslint-enable i18next/no-literal-string */

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

// Botão base: alvo ≥ 44 px, foco visível (tema) e type="button" por padrão.
export function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-touch min-w-touch cursor-pointer items-center justify-center gap-2 rounded-md px-4 font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
