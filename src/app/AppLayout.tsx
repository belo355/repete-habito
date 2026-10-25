import { BookOpen, House, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router';

const navItems = [
  { to: '/hoje', labelKey: 'nav.today', Icon: House },
  { to: '/album', labelKey: 'nav.album', Icon: BookOpen },
  { to: '/ajustes', labelKey: 'nav.settings', Icon: Settings },
] as const;

// Casca das telas principais: navegação de 3 abas (Hoje · Álbum · Ajustes) no rodapé no celular
// e numa barra no topo a partir de 1024 px. A aba ativa é um bloco em tinta.
export function AppLayout() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <nav
        aria-label={t('nav.label')}
        className="sticky bottom-0 border-t-2 border-surface bg-bg lg:static lg:order-first lg:border-t-0 lg:border-b-2"
      >
        <div className="mx-auto max-w-2xl lg:flex lg:items-center lg:justify-between lg:px-5">
          {/* No desktop a barra vai para o topo e leva o nome do app à esquerda. */}
          <p className="title-section hidden text-2xl lg:block">{t('app.name')}</p>
          <ul className="m-0 grid list-none grid-cols-3 gap-2 px-3 pt-2 pb-3 lg:flex lg:gap-1 lg:px-0 lg:py-2">
            {navItems.map(({ to, labelKey, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className="flex min-h-14 min-w-touch flex-col items-center justify-center gap-0.5 rounded-md text-[0.8125rem] font-bold text-text-muted no-underline hover:text-text aria-[current=page]:bg-primary aria-[current=page]:text-on-primary lg:min-h-11 lg:flex-row lg:gap-2 lg:px-4 lg:text-sm"
                >
                  <Icon aria-hidden="true" className="size-5" strokeWidth={2.25} />
                  {t(labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
