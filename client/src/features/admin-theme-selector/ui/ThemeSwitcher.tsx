import { useAdminTheme } from '@/app/providers/CommonThemeProvider';
import { themesFull, type Theme } from '@/entities/ui-config';
import { SidebarPanel } from '@/shared/ui';

export function ThemeSwitcher() {
  const { setTheme } = useAdminTheme();

  return (
    <SidebarPanel top={180} hoverHeight={64} hoverWidth={48}>
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
    </SidebarPanel>
  );
}
