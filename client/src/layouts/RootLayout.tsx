import { Outlet } from 'react-router-dom';
import { AnimatedSigmaBackground } from '../components/AnimatedSigmaBackground ';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { ThemeProvider } from '../providers/ThemeProvider';

export function RootLayout() {
  return (
    <ThemeProvider>
      <AnimatedSigmaBackground />
      <ThemeSwitcher />
      <Outlet />
    </ThemeProvider>
  );
}
