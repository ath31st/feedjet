import { useThemeSelector } from '../model/useThemeSelector';
import { themes } from '@shared/types/ui.config';

export function ThemeSelector() {
  const { theme, handleThemeChange } = useThemeSelector();

  if (!themes?.length) return <p>Темы недоступны</p>;

  return (
    <select
      style={{ backgroundColor: 'var(--card-bg)' }}
      value={theme}
      onChange={(e) => handleThemeChange(e.target.value)}
      className="w-32 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
    >
      {themes.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}
