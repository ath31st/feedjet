import { useEffect, type ReactNode } from 'react';
import { useUiConfigStore } from '@/entities/ui-config';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useUiConfigStore((s) => s.uiConfig.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
}
