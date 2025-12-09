'use client';

import { useState } from 'react';
import { themesFull, type Theme } from '@/entities/ui-config';
import { useThemeSelector } from '../model/useThemeSelector';
import { getColorFromHex } from '@/shared/lib';
import { CheckIcon } from '@radix-ui/react-icons';

interface Props {
  kioskId: number;
}

export function ThemeSelector({ kioskId }: Props) {
  const { theme, handleThemeChange } = useThemeSelector(kioskId);
  const [open, setOpen] = useState(false);

  const current = themesFull.find((t) => t.name === theme);
  if (!current) return <p>Темы недоступны</p>;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[var(--text)]">Цветовая тема:</span>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{ backgroundColor: current.color }}
        className="flex h-8 cursor-pointer items-center justify-center rounded-lg transition-opacity hover:opacity-70"
      >
        <span
          className="font-medium"
          style={{
            backgroundColor: current.color,
            color: getColorFromHex(current.color),
          }}
        >
          {current.label}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="grid grid-cols-4 gap-2 rounded-lg border border-(--border) p-2">
          {themesFull.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => handleThemeChange(kioskId, t.name as Theme)}
              style={{
                backgroundColor: t.color,
                color: getColorFromHex(t.color),
              }}
              className="flex items-center justify-center gap-1 rounded-lg p-2 transition-opacity hover:opacity-80"
            >
              {t.name === theme && <CheckIcon className="h-4 w-4" />}
              <span className="font-medium text-xs">{t.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
