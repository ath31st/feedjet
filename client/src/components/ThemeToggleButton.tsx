import { useTheme } from '../providers/ThemeProvider';

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="
      fixed top-1/6 4k:top-1/10 
      right-0 
      transform -translate-y-1/2 
      w-3 4k:w-6 
      h-16 4k:h-48 
      rounded-l-md 
      transition-all 
      duration-300 
      hover:w-36 4k:hover:w-48 
      hover:shadow-lg"
      style={{
        backgroundColor: 'var(--button-bg)',
        color: 'var(--button-text)',
      }}
    >
      <span className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 text-base 4k:text-5xl">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
