import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './shared/assets/fonts/Inter/Inter.css';
import './shared/assets/fonts/jet-brains-mono/jbm.css';
import './shared/styles/global.css';
import { router } from './app/routes/router';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
