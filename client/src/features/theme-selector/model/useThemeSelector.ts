import { useEffect, useState } from 'react';
import {
  useUiConfigStore,
  useUpdateUiConfig,
  type Theme,
} from '@/entities/ui-config';

export function useThemeSelector() {
  const [theme, setTheme] = useState<Theme>('dark');
  const { uiConfig } = useUiConfigStore();
  const updateUiConfig = useUpdateUiConfig();

  const handleThemeChange = (selected: Theme) => {
    setTheme(selected);
    updateUiConfig.mutate({ data: { theme: selected } });
  };

  useEffect(() => {
    if (uiConfig?.theme) {
      setTheme(uiConfig.theme);
    }
  }, [uiConfig]);

  return {
    theme,
    handleThemeChange,
  };
}
