import { Outlet } from 'react-router-dom';
import { TrpcProvider } from '../providers/TrpcProvider';
import { AppFeaturesInitializer } from '../init/AppFeaturesInitializer';

export function RootLayout() {
  return (
    <TrpcProvider>
      <AppFeaturesInitializer />
      <Outlet />
    </TrpcProvider>
  );
}
