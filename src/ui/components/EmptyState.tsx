import type { ReactNode } from 'react';

// Estado vazio que ensina o próximo passo (nunca só "nada aqui").
export function EmptyState({
  title,
  children,
  example,
  actions,
}: {
  title: string;
  children: ReactNode;
  /** Peça do mundo mostrada antes das ações (ex.: a figurinha de exemplo, a página vazia). */
  example?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-2xl px-5 py-8 max-[359px]:py-5">
      <h2 className="title-section text-2xl">{title}</h2>
      <div className="mt-2 max-w-[60ch] text-text-muted">{children}</div>
      {example && <div className="mt-5 max-[359px]:mt-3">{example}</div>}
      {/* No celular as ações empilham na largura toda; a partir de 640 px ficam lado a lado. */}
      {actions && (
        <div className="mt-6 flex flex-col gap-3 max-[359px]:mt-4 sm:flex-row sm:flex-wrap">
          {actions}
        </div>
      )}
    </section>
  );
}

// Título das telas sem faixa (Ajustes, passo a passo).
export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 pt-8 pb-2">
      <h1 className="title-display text-[3rem]">{children}</h1>
    </div>
  );
}
