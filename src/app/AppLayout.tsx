import { NavLink, Outlet } from 'react-router';
import './app.css';

const navItems = [
  { to: '/hoje', label: 'Hoje' },
  { to: '/atividades', label: 'Atividades' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/progresso', label: 'Progresso' },
  { to: '/ajustes', label: 'Ajustes' },
] as const;

// Casca das telas principais: conteúdo + navegação principal fixa no rodapé.
export function AppLayout() {
  return (
    <div className="app-shell">
      <main className="app-main">
        <Outlet />
      </main>
      <nav className="app-nav" aria-label="Navegação principal">
        <ul>
          {navItems.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to}>{label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
