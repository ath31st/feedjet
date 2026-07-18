import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { LogLevel, type LogLevel as LogLevelValue } from '@/entities/log';
import { useLayoutEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';

interface LevelMultiSelectProps {
  value: LogLevelValue[];
  onChange: (levels: LogLevelValue[]) => void;
}

export function LevelMultiSelect({ value, onChange }: LevelMultiSelectProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (triggerRef.current) {
      setWidth(triggerRef.current.offsetWidth);
    }
  }, []);

  const label =
    value.length === 0
      ? 'Все уровни'
      : value.length === 1
        ? (Object.entries(LogLevel).find(([, v]) => v === value[0])?.[0] ??
          '1 уровень')
        : `Уровни: ${value.length}`;

  const toggle = (level: LogLevelValue) => {
    if (value.includes(level)) {
      onChange(value.filter((l) => l !== level));
    } else {
      onChange([...value, level]);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          ref={triggerRef}
          type="button"
          className="w-full cursor-pointer rounded-lg border border-(--border) bg-(--card-bg) px-3 py-1.5 text-left text-sm focus:outline-none focus:ring-(--border) focus:ring-1"
        >
          {label}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={4}
          style={{ width: Math.max(width, 160) }}
          className="z-50 rounded-lg border border-(--border) bg-(--card-bg) p-1 shadow-md"
        >
          <DropdownMenu.Item
            onSelect={(e) => {
              e.preventDefault();
              onChange([]);
            }}
            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm outline-none data-highlighted:bg-(--button-hover-bg)"
          >
            <span className="flex h-4 w-4 items-center justify-center">
              {value.length === 0 && <Check size={14} />}
            </span>
            Все уровни
          </DropdownMenu.Item>

          {Object.entries(LogLevel).map(([name, level]) => {
            const checked = value.includes(level);
            return (
              <DropdownMenu.Item
                key={level}
                onSelect={(e) => {
                  e.preventDefault();
                  toggle(level);
                }}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm outline-none data-highlighted:bg-(--button-hover-bg)"
              >
                <span className="flex h-4 w-4 items-center justify-center">
                  {checked && <Check size={14} />}
                </span>
                {name}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
