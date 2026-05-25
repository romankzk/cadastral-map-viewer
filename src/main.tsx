import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom';
import LishchovateMap from './routes/LishchovateMap.tsx';
import PerehnoivMap from './routes/PerehnoivMap.tsx';
import Home from './routes/Home.tsx';
import './i18n';

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'maps/lishchovate',
        element: <LishchovateMap />
      },
      {
        path: 'maps/perehnoiv',
        element: <PerehnoivMap />
      },
      {
        path: 'maps', // Fallback root redirect
        element: <Navigate to="/" replace />
      }
    ]
  }
], {
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
