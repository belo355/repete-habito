import type { ReactNode } from 'react';

// Cabeçalho em lobo: região de estrutura em verde chapado com borda inferior orgânica
// (o mapa do parque). Só para Hoje e Dashboard; o conteúdo abaixo é uma lista padrão.
export function LobeHeader({ children }: { children: ReactNode }) {
  return (
    <header className="relative isolate text-on-shell">
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full"
        viewBox="0 0 390 250"
        preserveAspectRatio="none"
      >
        <path
          className="fill-shell"
          d="M0 0H390V176C352 226 292 204 244 224C194 246 124 238 74 216C38 200 14 206 0 212Z"
        />
      </svg>
      <div className="mx-auto w-full max-w-2xl px-5 pt-6 pb-20">{children}</div>
    </header>
  );
}
