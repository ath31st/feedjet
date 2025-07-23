import { Outlet } from 'react-router-dom';
import { AnimatedSigmaBackground } from '../components/AnimatedSigmaBackground ';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { ThemeProvider } from '../providers/ThemeProvider';
import { TrpcProvider } from '../providers/TrpcProvider';

export function RootLayout() {
  return (
    <ThemeProvider>
      <TrpcProvider>
        <AnimatedSigmaBackground />
        <ThemeSwitcher />
        <Outlet />
      </TrpcProvider>
    </ThemeProvider>
  );
}
