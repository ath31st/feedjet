import { Outlet } from 'react-router-dom';
import { KioskInitializer } from '../init/KioskInitializer';

export function KioskLayout() {
  return (
    <>
      <KioskInitializer />
      <Outlet />
    </>
  );
}
