import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router';

const navItems = [
  { to: '/hoje', labelKey: 'nav.today' },
  { to: '/atividades', labelKey: 'nav.activities' },
  { to: '/dashboard', labelKey: 'nav.dashboard' },
  { to: '/progresso', labelKey: 'nav.progress' },
  { to: '/ajustes', labelKey: 'nav.settings' },
] as const;

// Casca das telas principais: conteúdo + navegação principal fixa no rodapé.
export function AppLayout() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <nav aria-label={t('nav.label')} className="border-t border-border bg-surface">
        {/* 5 colunas iguais que encolhem até 320 px sem passar da largura da tela. */}
        <ul className="m-0 grid list-none grid-cols-5 p-0">
          {navItems.map(({ to, labelKey }) => (
            <li key={to}>
              <NavLink
                to={to}
                className="flex min-h-touch min-w-touch items-center justify-center px-0.5 text-center text-[clamp(0.75rem,3.5vw,0.875rem)] text-text-muted no-underline aria-[current=page]:font-bold aria-[current=page]:text-primary aria-[current=page]:underline"
              >
                {t(labelKey)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
