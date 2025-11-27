import { useAdminTheme } from '@/app/providers/CommonThemeProvider';
import type { Theme } from '@/entities/ui-config';

export function ThemeSwitcher() {
  const { setTheme } = useAdminTheme();

  const themes = [
    { name: 'light', label: 'Светлая', color: '#fefefe' },
    { name: 'dark', label: 'Тёмная', color: '#0f172a' },
    { name: 'oled', label: 'Глубокая чёрная', color: '#000000' },
    { name: 'amber', label: 'Золотистая', color: '#fbbf24' },
    { name: 'sepia', label: 'Сепия', color: '#a67c52' },
    { name: 'sepia-light', label: 'Светлая сепия', color: '#d4b98e' },
    { name: 'blue', label: 'Синяя', color: '#2563eb' },
    { name: 'indigo', label: 'Глубокая синяя', color: '#4f46e5' },
    { name: 'glacier', label: 'Прохладный лед', color: '#3b82f6' },
    { name: 'teal', label: 'Бирюзовая', color: '#14b8a6' },
    { name: 'green', label: 'Зелёная', color: '#22c55e' },
    { name: 'terminal', label: 'Зеленый терминал', color: '#16a34a' },
    { name: 'red', label: 'Красная', color: '#ef4444' },
    { name: 'rose', label: 'Розовая', color: '#fb7185' },
    { name: 'fuchsia', label: 'Пурпурная', color: '#c026d3' },
    { name: 'purple', label: 'Фиолетовая', color: '#8b5cf6' },
  ];

  return (
    <div className="fixed top-30 right-0 z-10 flex h-9 w-6 transform flex-col overflow-hidden rounded-l-lg bg-[var(--button-bg)] p-2 shadow-md transition-all duration-300 hover:h-48 hover:w-48">
      <div className="grid h-full w-full grid-cols-4 gap-2">
        {themes.map((t) => (
          <button
            key={t.name}
            type="button"
            onClick={() => setTheme(t.name as Theme)}
            style={{ backgroundColor: t.color }}
            title={t.label}
            className="rounded-lg opacity-75 transition-opacity duration-300 hover:opacity-100"
          >
            <span className="sr-only">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
