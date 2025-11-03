import { useThemeSelector } from '../model/useThemeSelector';
import { themes } from '@shared/types/ui.config';
import { SimpleDropdownMenu } from '@/shared/ui/common';

interface ThemeSelectorProps {
  kioskId: number;
}

export function ThemeSelector({ kioskId }: ThemeSelectorProps) {
  const { theme, handleThemeChange } = useThemeSelector(kioskId);

  if (!themes?.length) return <p>Темы недоступны</p>;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[var(--text)]">Тема:</span>
      <SimpleDropdownMenu
        value={theme}
        options={themes}
        onSelect={(t) => handleThemeChange(kioskId, t)}
      />
    </div>
  );
}
