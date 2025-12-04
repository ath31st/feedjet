import { Outlet } from 'react-router-dom';
import { CommonThemeProvider } from '../providers/CommonThemeProvider';
import { StaticBackground, ToasterConfig } from '@/shared/ui';

export function CommonLayout() {
  return (
    <CommonThemeProvider>
      <div className="mx-auto w-full max-w-[1400px]">
        <StaticBackground />
        <ToasterConfig />
        <Outlet />
      </div>
    </CommonThemeProvider>
  );
}
