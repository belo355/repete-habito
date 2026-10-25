import { ArrowRight } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

/* eslint-disable i18next/no-literal-string -- classes CSS, não é texto para o usuário */
// Controles do álbum: retângulos de canto curto, cor chapada e rótulo em negrito.
const base =
  'inline-flex min-h-touch min-w-touch cursor-pointer items-center justify-center gap-2 rounded-md px-5 font-bold whitespace-nowrap no-underline transition-transform duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary text-on-primary hover:brightness-95',
  secondary: 'border-2 border-text bg-transparent text-text hover:bg-surface',
  danger: 'border-2 border-danger bg-transparent text-danger hover:bg-surface',
  ghost: 'bg-transparent text-text hover:bg-surface',
};
/* eslint-enable i18next/no-literal-string */

export function buttonClasses(variant: Variant = 'primary', extra = '') {
  return [base, variantClasses[variant], extra].join(' ');
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

// Link com a aparência de botão (navegação dentro do app); a seta diz que leva a outra tela.
export function ButtonLink({
  variant = 'primary',
  className = '',
  children,
  ...props
}: LinkProps & { variant?: Variant; children: ReactNode }) {
  return (
    <Link className={buttonClasses(variant, className)} {...props}>
      <span>{children}</span>
      <ArrowRight aria-hidden="true" className="size-5 shrink-0" strokeWidth={2.5} />
    </Link>
  );
}
