import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom';
import LeszczowateMap from './pages/villages/Leszczowate.tsx';
import PerehnoivMap from './pages/villages/Perehnoiv.tsx';
import Home from './pages/Home.tsx';
import './i18n';
import DesznoMap from './pages/villages/Deszno.tsx';

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
        path: 'maps/leszczowate',
        element: <LeszczowateMap />
      },
      {
        path: 'maps/perehnoiv',
        element: <PerehnoivMap />
      },
      {
        path: 'maps/deszno',
        element: <DesznoMap />
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
