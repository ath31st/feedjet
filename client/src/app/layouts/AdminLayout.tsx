import { ToasterConfig } from '@/shared/ui/ToasterConfig';
import { AdminInitializer } from '../init/AdminInitializer';
import { Outlet } from 'react-router-dom';

export function AdminLayout() {
  return (
    <>
      <ToasterConfig />
      <AdminInitializer />
      <Outlet />
    </>
  );
}
