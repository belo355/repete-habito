import { ChartArea, House, ListTodo, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router';

const navItems = [
  { to: '/hoje', labelKey: 'nav.today', Icon: House },
  { to: '/atividades', labelKey: 'nav.activities', Icon: ListTodo },
  { to: '/dashboard', labelKey: 'nav.dashboard', Icon: ChartArea },
  { to: '/ajustes', labelKey: 'nav.settings', Icon: Settings },
] as const;

// Casca das telas principais: navegação de 4 abas no rodapé no celular e numa barra no topo
// a partir de 1024 px (brief de UX §6).
export function AppLayout() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <nav
        aria-label={t('nav.label')}
        className="border-t-2 border-surface bg-bg lg:order-first lg:border-t-0 lg:border-b-2"
      >
        <div className="mx-auto max-w-2xl lg:flex lg:items-center lg:justify-between lg:px-5">
          {/* No desktop a barra vai para o topo e leva o nome do app à esquerda. */}
          <p className="hidden text-lg font-extrabold tracking-[-0.01em] lg:block">
            {t('app.name')}
          </p>
          <ul className="m-0 grid list-none grid-cols-4 gap-1 p-1.5 lg:flex lg:px-0">
            {navItems.map(({ to, labelKey, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className="flex min-h-14 min-w-touch flex-col items-center justify-center gap-0.5 rounded-full text-xs font-semibold text-text-muted no-underline hover:text-text aria-[current=page]:bg-shell aria-[current=page]:font-bold aria-[current=page]:text-on-shell lg:min-h-11 lg:flex-row lg:gap-2 lg:px-4 lg:text-sm"
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
