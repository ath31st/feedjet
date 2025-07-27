import { Outlet } from 'react-router-dom';
import { AnimatedSigmaBackground } from '../components/AnimatedSigmaBackground ';
import { ThemeProvider } from '../providers/ThemeProvider';
import { TrpcProvider } from '../providers/TrpcProvider';
import { Initializer } from './Initializer';
import { ToasterConfig } from '../components/ToasterConfig';

export function RootLayout() {
  return (
    <ThemeProvider>
      <TrpcProvider>
        <Initializer />
        <AnimatedSigmaBackground />
        <ToasterConfig />
        <Outlet />
      </TrpcProvider>
    </ThemeProvider>
  );
}
