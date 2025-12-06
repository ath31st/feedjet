import { Outlet } from 'react-router-dom';
import { ThemeSwitcher } from '@/features/admin-theme-selector';
import { AdminInitializer } from '../init/AdminInitializer';

export function AdminLayout() {
  return (
    <>
      <AdminInitializer />
      <ThemeSwitcher />
      <Outlet />
    </>
  );
}
