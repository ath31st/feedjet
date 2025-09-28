import { Outlet } from 'react-router-dom';
import { TrpcProvider } from '../providers/TrpcProvider';

export function RootLayout() {
  return (
    <TrpcProvider>
      <Outlet />
    </TrpcProvider>
  );
}
