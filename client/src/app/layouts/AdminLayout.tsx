import { Outlet } from 'react-router-dom';
import { ThemeSwitcher } from '@/features/admin-theme-selector';
import { AdminInitializer } from '../init/AdminInitializer';
import { AdminHelpToggle } from '@/features/admin-help-toggle';

export function AdminLayout() {
  return (
    <>
      <AdminInitializer />
      <AdminHelpToggle />
      <ThemeSwitcher />
      <Outlet />
    </>
  );
}
