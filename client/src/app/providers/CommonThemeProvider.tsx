import type { Theme } from '@/entities/ui-config';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

interface CommonThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const CommonThemeContext = createContext<CommonThemeContextType | undefined>(
  undefined,
);

export function CommonThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('admin-theme') as Theme;
    return saved || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  return (
    <CommonThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </CommonThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(CommonThemeContext);
  if (context === undefined) {
    throw new Error('useAdminTheme must be used within AdminThemeProvider');
  }
  return context;
}
