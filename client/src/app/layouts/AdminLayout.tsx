import { Outlet } from 'react-router-dom';
import { ThemeSwitcher } from '@/features/admin-theme-selector';

export function AdminLayout() {
  return (
    <>
      <ThemeSwitcher />
      <Outlet />
    </>
  );
}
