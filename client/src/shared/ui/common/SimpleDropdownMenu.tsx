import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useLayoutEffect, useRef, useState } from 'react';

interface DropdownOption<T extends string> {
  label: string;
  value: T;
}

interface DropdownProps<T extends string> {
  value: T;
  options: DropdownOption<T>[];
  onSelect: (value: T) => void;
  placeholder?: string;
}

export function SimpleDropdownMenu<T extends string>({
  value,
  options,
  onSelect,
  placeholder = 'Выберите...',
}: DropdownProps<T>) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (triggerRef.current) {
      setWidth(triggerRef.current.offsetWidth);
    }
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          ref={triggerRef}
          type="button"
          className="w-full cursor-pointer rounded-lg border border-(--border) bg-(--card-bg) px-3 py-2 text-left text-sm focus:outline-none focus:ring-(--border) focus:ring-1"
        >
          {selectedOption ? selectedOption.label : value || placeholder}
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
              key={opt.value}
              onSelect={() => onSelect(opt.value)}
              className="cursor-pointer px-3 py-2 text-sm outline-none data-[highlighted]:bg-(--button-hover-bg)"
            >
              {opt.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
