import { createBrowserRouter, Navigate } from 'react-router';
import { AlbumPage } from '../features/album/AlbumPage.tsx';
import { OnboardingPage } from '../features/onboarding/OnboardingPage.tsx';
import { SettingsPage } from '../features/settings/SettingsPage.tsx';
import { TodayPage } from '../features/today/TodayPage.tsx';
import { AppLayout } from './AppLayout.tsx';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/hoje', element: <TodayPage /> },
      // O Álbum reúne as atividades, o detalhe de cada uma e as páginas de semana e mês (DV10).
      { path: '/album', element: <AlbumPage /> },
      { path: '/ajustes', element: <SettingsPage /> },
    ],
  },
  // Endereços antigos (Atividades e Dashboard) continuam abrindo, agora no Álbum.
  { path: '/atividades', element: <Navigate to="/album" replace /> },
  { path: '/dashboard', element: <Navigate to="/album" replace /> },
  // Onboarding ocupa a tela inteira, sem a navegação principal.
  {
    path: '/onboarding',
    element: (
      <main className="flex min-h-dvh flex-col">
        <OnboardingPage />
      </main>
    ),
  },
  // "Hoje" é a tela principal (product 4.2).
  { path: '*', element: <Navigate to="/hoje" replace /> },
]);
