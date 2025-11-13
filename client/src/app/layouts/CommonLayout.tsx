import { Outlet } from 'react-router-dom';
import { CommonThemeProvider } from '../providers/CommonThemeProvider';
import { ToasterConfig } from '@/shared/ui';

export function CommonLayout() {
  return (
    <CommonThemeProvider>
      <div className="mx-auto w-full max-w-7xl">
        <ToasterConfig />
        <Outlet />
      </div>
    </CommonThemeProvider>
  );
}
