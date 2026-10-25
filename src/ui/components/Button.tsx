import { ArrowRight } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

/* eslint-disable i18next/no-literal-string -- classes CSS, não é texto para o usuário */
// Controles do mundo são cápsulas: totalmente arredondados, cor chapada, texto escuro.
const base =
  'inline-flex min-h-touch min-w-touch cursor-pointer items-center justify-center gap-2 rounded-full px-5 font-bold whitespace-nowrap no-underline transition-transform duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none';

// Ponto redondo com seta (o chip dos controles do mapa): contrasta com o fundo da cápsula.
const chipClasses: Record<Variant, string> = {
  primary: 'bg-on-primary text-primary',
  secondary: 'bg-text text-bg',
  danger: 'bg-danger text-bg',
  ghost: 'bg-text text-bg',
};

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary text-on-primary hover:brightness-95',
  secondary: 'border-2 border-text bg-transparent text-text hover:bg-surface',
  danger: 'border-2 border-danger bg-transparent text-danger hover:bg-surface',
  ghost: 'bg-transparent text-text hover:bg-surface',
};
/* eslint-enable i18next/no-literal-string */

export function buttonClasses(variant: Variant = 'primary', extra = '', chip = false) {
  return [base, variantClasses[variant], chip ? 'pr-1.5' : '', extra].join(' ');
}

function Chip({ variant }: { variant: Variant }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full ${chipClasses[variant]}`}
    >
      <ArrowRight className="size-4" strokeWidth={2.75} />
    </span>
  );
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

// Botão base: alvo ≥ 44 px, foco visível (tema) e type="button" por padrão.
export function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className)} {...props} />;
}

// Link com a aparência de botão (navegação dentro do app), com o ponto e a seta do mundo.
export function ButtonLink({
  variant = 'primary',
  className = '',
  children,
  ...props
}: LinkProps & { variant?: Variant; children: ReactNode }) {
  return (
    <Link className={buttonClasses(variant, className, true)} {...props}>
      <span>{children}</span>
      <Chip variant={variant} />
    </Link>
  );
}
