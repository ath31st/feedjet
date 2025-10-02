import { Outlet } from 'react-router-dom';
import { KioskInitializer } from '../init/KioskInitializer';
import { ThemeProvider } from '../providers/ThemeProvider';

export function KioskLayout() {
  return (
    <ThemeProvider>
      <KioskInitializer />
      <Outlet />
    </ThemeProvider>
  );
}
