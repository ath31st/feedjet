import { useEffect, type ReactNode } from 'react';
import { useKioskConfigStore } from '../../entities/kiosk-config/model/kioskConfigStrore';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useKioskConfigStore((s) => s.config.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
}
