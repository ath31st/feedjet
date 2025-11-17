import { useAdminTheme } from '@/app/providers/CommonThemeProvider';
import type { Theme } from '@/entities/ui-config';

export function ThemeSwitcher() {
  const { setTheme } = useAdminTheme();

  const themes = [
    { name: 'light', label: 'Светлая', color: '#f8fafc' },
    { name: 'dark', label: 'Тёмная', color: '#0f172a' },
    { name: 'sepia', label: 'Сепия', color: '#a68a64' },
    { name: 'blue', label: 'Синяя', color: '#3b82f6' },
    { name: 'green', label: 'Зелёная', color: '#34d399' },
  ];

  return (
    <div
      style={{ backgroundColor: 'var(--button-bg)' }}
      className="-translate-y-1/2 justify-center-safe fixed 4k:top-1/10 top-1/6 right-0 flex 4k:h-36 h-12 4k:w-6 w-3 transform flex-row items-center 4k:gap-6 gap-2 rounded-l-md bg-[var(--button-bg)] px-2 transition-all duration-300 4k:hover:w-120 hover:w-56 hover:shadow-lg"
    >
      {themes.map((t) => (
        <button
          key={t.name}
          type="button"
          onClick={() => setTheme(t.name as Theme)}
          style={{ backgroundColor: t.color }}
          title={t.label}
          className="4k:h-15 h-8 4k:w-15 w-8 rounded-full opacity-75 transition-opacity duration-300 hover:opacity-100"
        >
          <span className="sr-only">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
