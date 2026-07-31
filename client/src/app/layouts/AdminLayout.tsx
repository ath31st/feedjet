import { Outlet } from 'react-router-dom';
import { AdminInitializer } from '../init/AdminInitializer';
import { AdminToolsPanel } from '@/widgets/admin-tools-panel';
import { LogoutSidePanel } from '@/features/auth';

export function AdminLayout() {
  return (
    <>
      <AdminInitializer />
      <LogoutSidePanel />
      <AdminToolsPanel />
      <Outlet />
    </>
  );
}
