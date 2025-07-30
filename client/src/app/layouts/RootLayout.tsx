import { Outlet } from 'react-router-dom';
import { AnimatedSigmaBackground } from '@/shared/ui/AnimatedSigmaBackground ';
import { ThemeProvider } from '../providers/ThemeProvider';
import { TrpcProvider } from '../providers/TrpcProvider';
import { Initializer } from '../init/Initializer';
import { ToasterConfig } from '@/shared/ui/ToasterConfig';

export function RootLayout() {
  return (
    <ThemeProvider>
      <TrpcProvider>
        <Initializer />
        {/* <AnimatedSigmaBackground /> */}
        <ToasterConfig />
        <Outlet />
      </TrpcProvider>
    </ThemeProvider>
  );
}
