import type { ReactNode } from 'react';

// Estado vazio que ensina o próximo passo (nunca só "nada aqui").
export function EmptyState({
  title,
  children,
  actions,
}: {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-2xl px-5 py-8">
      <h2 className="text-2xl font-extrabold tracking-[-0.01em]">{title}</h2>
      <div className="mt-2 max-w-[60ch] text-text-muted">{children}</div>
      {/* No celular as ações empilham na largura toda; a partir de 640 px ficam lado a lado. */}
      {actions && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div>
      )}
    </section>
  );
}

// Título das telas sem lobo (Atividades, Ajustes).
export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 pt-8 pb-2">
      <h1 className="title-display text-4xl">{children}</h1>
    </div>
  );
}
