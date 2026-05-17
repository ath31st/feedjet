import { Outlet } from 'react-router-dom';
import { ThemeSwitcher } from '@/features/admin-theme-selector';
import { AdminInitializer } from '../init/AdminInitializer';
import { AdminHelpToggle } from '@/features/admin-help-toggle';
import { useEffect } from 'react';

export function AdminLayout() {
  useEffect(() => {
    document.documentElement.dataset.mode = 'admin';

    return () => {
      document.documentElement.dataset.mode = '';
    };
  }, []);

  return (
    <>
      <AdminInitializer />
      <AdminHelpToggle />
      <ThemeSwitcher />
      <Outlet />
    </>
  );
}
