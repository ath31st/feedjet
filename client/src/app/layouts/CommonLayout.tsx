import { Outlet } from 'react-router-dom';
import { CommonThemeProvider } from '../providers/CommonThemeProvider';

export function CommonLayout() {
  return (
    <CommonThemeProvider>
      <div className="mx-auto w-full max-w-7xl">
        <Outlet />
      </div>
    </CommonThemeProvider>
  );
}
