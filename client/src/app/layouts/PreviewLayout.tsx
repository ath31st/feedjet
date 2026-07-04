import { Outlet } from 'react-router-dom';
import { KioskInitializer } from '../init/KioskInitializer';
import { ThemeProvider } from '../providers/ThemeProvider';

export function PreviewLayout() {
  return (
    <ThemeProvider>
      <KioskInitializer />
      <Outlet />
    </ThemeProvider>
  );
}
