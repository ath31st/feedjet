import { ToasterConfig } from '@/shared/ui/ToasterConfig';
import { Outlet } from 'react-router-dom';
import { ThemeSwitcher } from '@/features/admin-theme-selector';

export function AdminLayout() {
  return (
    <>
      <ToasterConfig />
      <ThemeSwitcher />
      <Outlet />
    </>
  );
}
