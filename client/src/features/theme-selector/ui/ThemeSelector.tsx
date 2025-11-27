import { themesFull, type Theme } from '@/entities/ui-config';
import { useThemeSelector } from '../model/useThemeSelector';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { TooltipWrapper } from '@/shared/ui';
import { getColorFromHex } from '@/shared/lib';

interface ThemeSelectorProps {
  kioskId: number;
}

export function ThemeSelector({ kioskId }: ThemeSelectorProps) {
  const { theme, handleThemeChange } = useThemeSelector(kioskId);

  if (!themesFull?.length) return <p>Темы недоступны</p>;

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
            style={{
              backgroundColor: t.color,
              color: getColorFromHex(t.color),
            }}
            className="cursor-pointer rounded-lg px-2 py-1 transition-colors duration-200 hover:bg-[var(--button-hover-bg)] hover:text-[var(--text)] data-[state=on]:bg-[var(--button-bg)] data-[state=on]:text-[var(--text)]"
          >
            <TooltipWrapper tooltip={t.label}>
              <span className="font-medium text-xs">{t.name}</span>
            </TooltipWrapper>
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
}
