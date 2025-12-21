import { Outlet } from 'react-router-dom';
import { KioskInitializer } from '../init/KioskInitializer';
import { ThemeProvider } from '../providers/ThemeProvider';
import { HeartbeatProvider } from '../providers/HeartbeatProvider';
import { SeasonOverlay } from '@/shared/ui';

export function KioskLayout() {
  return (
    <ThemeProvider>
      <HeartbeatProvider>
        <KioskInitializer />
        <SeasonOverlay />
        <Outlet />
      </HeartbeatProvider>
    </ThemeProvider>
  );
}
