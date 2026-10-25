import { createBrowserRouter, Navigate } from 'react-router';
import { ActivitiesPage } from '../features/activities/ActivitiesPage.tsx';
import { DashboardPage } from '../features/dashboard/DashboardPage.tsx';
import { OnboardingPage } from '../features/onboarding/OnboardingPage.tsx';
import { SettingsPage } from '../features/settings/SettingsPage.tsx';
import { TodayPage } from '../features/today/TodayPage.tsx';
import { AppLayout } from './AppLayout.tsx';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/hoje', element: <TodayPage /> },
      { path: '/atividades', element: <ActivitiesPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/ajustes', element: <SettingsPage /> },
    ],
  },
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
