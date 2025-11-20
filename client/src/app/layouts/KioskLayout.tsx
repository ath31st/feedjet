import { Outlet } from 'react-router-dom';
import { KioskInitializer } from '../init/KioskInitializer';
import { ThemeProvider } from '../providers/ThemeProvider';
import { HeartbeatProvider } from '../providers/HeartbeatProvider';

export function KioskLayout() {
  return (
    <ThemeProvider>
      <HeartbeatProvider>
        <KioskInitializer />
        <Outlet />
      </HeartbeatProvider>
    </ThemeProvider>
  );
}
