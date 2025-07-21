import { createBrowserRouter } from 'react-router-dom';
import { FeedPage } from './pages/FeedPage';
//import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RootLayout } from './layouts/RootLayout';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { LoginPage } from './pages/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <FeedPage /> },
      //   { path: 'admin', element: <AdminPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: '401', element: <UnauthorizedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
