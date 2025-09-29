'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useThemeSelector } from '../model/useThemeSelector';
import { themes } from '@shared/types/ui.config';

interface ThemeSelectorProps {
  kioskId: number;
}

export function ThemeSelector({ kioskId }: ThemeSelectorProps) {
  const { theme, handleThemeChange } = useThemeSelector(kioskId);

  if (!themes?.length) return <p>Темы недоступны</p>;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[var(--text)]">Тема:</span>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2 text-left focus:outline-none"
          >
            {theme}
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          align="start"
          sideOffset={4}
          className="z-50 min-w-[8rem] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card-bg)] shadow-md"
        >
          {themes.map((t) => (
            <DropdownMenu.Item
              key={t}
              onSelect={() => handleThemeChange(kioskId, t)}
              className="cursor-pointer px-3 py-2 text-sm outline-none hover:bg-[var(--button-hover-bg)] data-[highlighted]:bg-[var(--hover-bg)]"
            >
              {t}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
