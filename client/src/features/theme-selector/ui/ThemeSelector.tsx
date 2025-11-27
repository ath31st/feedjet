import { themes, themesFull, type Theme } from '@/entities/ui-config';
import { useThemeSelector } from '../model/useThemeSelector';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

interface ThemeSelectorProps {
  kioskId: number;
}

export function ThemeSelector({ kioskId }: ThemeSelectorProps) {
  const { theme, handleThemeChange } = useThemeSelector(kioskId);

  if (!themes?.length) return <p>Темы недоступны</p>;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[var(--text)]">Цветовая тема:</span>

      <ToggleGroup.Root
        type="single"
        className="grid grid-cols-4 gap-1 rounded-lg border border-[var(--border)] p-1"
        value={theme}
        onValueChange={(next) => {
          if (!next) return;
          handleThemeChange(kioskId, next as Theme);
        }}
      >
        {themesFull.map((t) => (
          <ToggleGroup.Item
            key={t.name}
            value={t.name}
            className="cursor-pointer rounded-lg px-2 py-1 hover:bg-[var(--button-hover-bg)] data-[state=on]:bg-[var(--button-bg)]"
          >
            {t.name}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
}
