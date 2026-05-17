import { Outlet } from 'react-router-dom';
import { KioskInitializer } from '../init/KioskInitializer';
import { ThemeProvider } from '../providers/ThemeProvider';
import { HeartbeatProvider } from '../providers/HeartbeatProvider';
import { useEffect } from 'react';

export function KioskLayout() {
  useEffect(() => {
    document.documentElement.dataset.mode = 'kiosk';

    return () => {
      document.documentElement.dataset.mode = '';
    };
  }, []);

  return (
    <ThemeProvider>
      <HeartbeatProvider>
        <KioskInitializer />
        <Outlet />
      </HeartbeatProvider>
    </ThemeProvider>
  );
}
