import { Outlet } from 'react-router-dom';
import { KioskInitializer } from '../init/KioskInitializer';
import { ThemeProvider } from '../providers/ThemeProvider';
import { useEffect } from 'react';

export function PreviewLayout() {
  useEffect(() => {
    document.documentElement.dataset.mode = 'kiosk';

    return () => {
      document.documentElement.dataset.mode = '';
    };
  }, []);

  return (
    <ThemeProvider>
      <KioskInitializer />
      <Outlet />
    </ThemeProvider>
  );
}
