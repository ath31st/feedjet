import { Outlet } from 'react-router-dom';
import { AnimatedSigmaBackground } from '../components/AnimatedSigmaBackground ';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
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
        <ThemeSwitcher />
        <ToasterConfig />
        <Outlet />
      </TrpcProvider>
    </ThemeProvider>
  );
}
