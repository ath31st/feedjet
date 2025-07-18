import { useTheme } from '../providers/ThemeProvider';

export function ThemeSwitcher() {
  const { setTheme } = useTheme();
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
      className="
        flex flex-row
        h-12 4k:h-36 w-3 4k:w-6
        px-2
        bg-[var(--button-bg)]
        rounded-l-md
        transition-all
        fixed top-1/6 4k:top-1/10 right-0 
        transform -translate-y-1/2   
        duration-300 
        hover:w-56 4k:hover:w-120 hover:shadow-lg 
        items-center justify-center-safe gap-2 4k:gap-6
      "
    >
      {themes.map((t) => (
        <button
          key={t.name}
          type="button"
          onClick={() =>
            setTheme(t.name as 'light' | 'dark' | 'sepia' | 'blue' | 'green')
          }
          style={{ backgroundColor: t.color }}
          title={t.label}
          className="
            w-8 h-8 4k:w-15 4k:h-15
            rounded-full
            transition-opacity opacity-75
            duration-300 hover:opacity-100
          "
        >
          <span className="sr-only">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
