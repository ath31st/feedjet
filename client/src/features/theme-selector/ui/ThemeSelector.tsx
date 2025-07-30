import {
  useUiConfigStore,
  useUpdateUiConfig,
  type Theme,
} from '@/entities/ui-config';
import { useEffect, useState } from 'react';
import { themes } from '@shared/types/ui.config';

export function ThemeSelector() {
  const [theme, setTheme] = useState<Theme>('dark');
  const { uiConfig } = useUiConfigStore();
  const updateUiConfig = useUpdateUiConfig();

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setTheme(selected);
    updateUiConfig.mutate({ data: { theme: selected } });
  };

  useEffect(() => {
    if (uiConfig) {
      setTheme(uiConfig.theme);
    }
  }, [uiConfig]);

  return (
    <div>
      {themes?.length ? (
        <select
          style={{
            backgroundColor: 'var(--card-bg)',
          }}
          value={theme}
          onChange={handleThemeChange}
          className="w-32 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
        >
          {themes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      ) : (
        <p>Темы недоступны</p>
      )}
    </div>
  );
}
