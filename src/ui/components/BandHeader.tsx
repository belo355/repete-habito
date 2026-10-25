import type { ReactNode } from 'react';

// Faixa da semana: região de estrutura em azul chapado no topo de Hoje e do Álbum, como a capa
// de uma página do álbum. Dentro dela o anel de foco usa o token próprio, visível sobre o azul.
export function BandHeader({ children }: { children: ReactNode }) {
  return (
    <header className="bg-shell text-on-shell [&_:focus-visible]:outline-focus-on-shell">
      <div className="mx-auto w-full max-w-2xl px-5 pt-6 pb-7 max-[359px]:pt-4 max-[359px]:pb-5">
        {children}
      </div>
    </header>
  );
}
