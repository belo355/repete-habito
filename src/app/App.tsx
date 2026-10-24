import { RouterProvider } from 'react-router/dom';
import { router } from './router.tsx';
import { ConnectedUpdatePrompt } from './update/UpdatePrompt.tsx';

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ConnectedUpdatePrompt />
    </>
  );
}
