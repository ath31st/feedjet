import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useLayoutEffect, useRef, useState } from 'react';

interface DropdownProps {
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}

export function SimpleDropdownMenu({
  value,
  options,
  onSelect,
}: DropdownProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (triggerRef.current) {
      setWidth(triggerRef.current.offsetWidth);
    }
  }, []);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          ref={triggerRef}
          type="button"
          className="w-full cursor-pointer rounded-lg border border-(--border) bg-(--card-bg) px-2 py-1 text-left focus:outline-none"
        >
          {value}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={4}
          style={{ width }}
          className="z-50 overflow-hidden rounded-lg border border-(--border) bg-(--card-bg) shadow-md"
        >
          {options.map((opt) => (
            <DropdownMenu.Item
              key={opt}
              onSelect={() => onSelect(opt)}
              className="cursor-pointer px-2 py-1 text-sm outline-none data-[highlighted]:bg-(--button-hover-bg)"
            >
              {opt}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
