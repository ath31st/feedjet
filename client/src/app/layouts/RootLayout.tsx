import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '../providers/ThemeProvider';
import { TrpcProvider } from '../providers/TrpcProvider';

export function RootLayout() {
  return (
    <ThemeProvider>
      <TrpcProvider>
        <Outlet />
      </TrpcProvider>
    </ThemeProvider>
  );
}
