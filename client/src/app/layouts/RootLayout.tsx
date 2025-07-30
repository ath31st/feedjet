import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '../providers/ThemeProvider';
import { TrpcProvider } from '../providers/TrpcProvider';
import { Initializer } from '../init/Initializer';
import { ToasterConfig } from '@/shared/ui/ToasterConfig';

export function RootLayout() {
  return (
    <ThemeProvider>
      <TrpcProvider>
        <Initializer />
        <ToasterConfig />
        <Outlet />
      </TrpcProvider>
    </ThemeProvider>
  );
}
