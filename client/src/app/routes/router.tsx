import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminPage } from '@/pages/admin';
import { KioskPage } from '@/pages/KioskPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';
import { RootLayout } from '../layouts/RootLayout';
import { CommonLayout } from '../layouts/CommonLayout';
import { KioskLayout } from '../layouts/KioskLayout';
import { PreviewLayout } from '../layouts/PreviewLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ModeSetter } from './ModSetter';
import { ForbiddenPage } from '@/pages/ForbiddenPage';
import { SuperAdminPage } from '@/pages/SuperAdminPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        element: <CommonLayout />,
        children: [
          {
            path: 'admin',
            element: (
              <ProtectedRoute>
                <ModeSetter mode="admin">
                  <AdminLayout />
                </ModeSetter>
              </ProtectedRoute>
            ),
            children: [{ index: true, element: <AdminPage /> }],
          },
          {
            path: 'super-admin',
            element: (
              <ProtectedRoute>
                <ModeSetter mode="admin">
                  <AdminLayout />
                </ModeSetter>
              </ProtectedRoute>
            ),
            children: [{ index: true, element: <SuperAdminPage /> }],
          },
          { path: 'login', element: <LoginPage /> },
          { path: '401', element: <UnauthorizedPage /> },
          { path: '403', element: <ForbiddenPage /> },
        ],
      },
      {
        path: 'preview',
        element: (
          <ModeSetter mode="kiosk">
            <PreviewLayout />
          </ModeSetter>
        ),
        children: [{ path: ':slug', element: <KioskPage /> }],
      },
      {
        path: '',
        element: (
          <ModeSetter mode="kiosk">
            <KioskLayout />
          </ModeSetter>
        ),
        children: [
          { index: true, element: <KioskPage /> },
          { path: ':slug', element: <KioskPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
