'use client';

import { useState } from 'react';
import { themesFull, type Theme } from '@/entities/ui-config';
import { useThemeSelector } from '../model/useThemeSelector';
import { getColorFromHex, getThemeSwatchStyle } from '@/shared/lib';
import { CheckIcon } from '@radix-ui/react-icons';

interface Props {
  kioskId: number;
}

export function ThemeSelector({ kioskId }: Props) {
  const { theme, handleThemeChange } = useThemeSelector(kioskId);
  const [open, setOpen] = useState(false);

  const current = themesFull.find((t) => t.name === theme);
  if (!current) return <p>Темы недоступны</p>;

  const currentText = getColorFromHex(current.colors[0]);

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={getThemeSwatchStyle(current.colors)}
        className="flex h-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg transition-opacity hover:opacity-70"
      >
        <span className="font-medium" style={{ color: currentText }}>
          {current.label}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-120 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="mt-5 grid grid-cols-3 gap-2">
          {themesFull.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => handleThemeChange(kioskId, t.name as Theme)}
              style={{
                ...getThemeSwatchStyle(t.colors),
                color: getColorFromHex(t.colors[0]),
              }}
              className="flex cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-lg p-2 transition-opacity hover:opacity-80"
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
