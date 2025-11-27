import { useAdminTheme } from '@/app/providers/CommonThemeProvider';
import { themesFull, type Theme } from '@/entities/ui-config';

export function ThemeSwitcher() {
  const { setTheme } = useAdminTheme();

  return (
    <div className="fixed top-30 right-0 z-10 flex h-9 w-6 transform flex-col overflow-hidden rounded-l-lg bg-[var(--button-bg)] p-2 shadow-md transition-all duration-300 hover:h-48 hover:w-48">
      <div className="grid h-full w-full grid-cols-4 gap-2">
        {themesFull.map((t) => (
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
