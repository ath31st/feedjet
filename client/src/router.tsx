import { createBrowserRouter } from 'react-router-dom';
import { FeedPage } from './pages/FeedPage';
//import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';
//import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { RootLayout } from './layouts/RootLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <FeedPage /> },
      //   { path: 'admin', element: <AdminPage /> },
      //   { path: '401', element: <UnauthorizedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
