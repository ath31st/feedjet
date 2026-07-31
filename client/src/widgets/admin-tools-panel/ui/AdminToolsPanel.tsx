import { useAdminTheme } from '@/app/providers/CommonThemeProvider';
import { themesFull, type Theme } from '@/entities/ui-config';
import { useAdminHelp } from '@/features/admin-help-toggle';
import { getThemeSwatchStyle } from '@/shared/lib';
import { CommonSwitch } from '@/shared/ui/common';

const THEME_COLS = 4;
const THEME_ROWS = Math.ceil(themesFull.length / THEME_COLS);

export function AdminToolsPanel() {
  const { enabled, setEnabled } = useAdminHelp();
  const { setTheme } = useAdminTheme();

  return (
    <div className="group fixed top-30 right-0 z-10 flex h-9 w-4 flex-col overflow-hidden rounded-l-lg bg-(--button-bg) p-2 shadow-md transition-all duration-300 hover:h-100 hover:w-48">
      <div className="flex h-full w-full flex-col gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex shrink-0 items-center justify-between gap-2 text-(--text) text-xs">
          <span className="whitespace-nowrap">Справочная панель</span>
          <CommonSwitch checked={enabled} onCheckedChange={setEnabled} />
        </div>
        <div className="border border-(--border)" />
        <div
          className="grid min-h-0 flex-1 gap-1.5"
          style={{
            gridTemplateColumns: `repeat(${THEME_COLS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${THEME_ROWS}, minmax(0, 1fr))`,
          }}
        >
          {themesFull.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => setTheme(t.name as Theme)}
              style={getThemeSwatchStyle(t.colors)}
              title={t.label}
              className="h-full w-full cursor-pointer overflow-hidden rounded-lg transition-transform duration-300 hover:scale-110"
            >
              <span className="sr-only">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
