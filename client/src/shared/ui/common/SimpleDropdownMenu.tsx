import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

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
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2 text-left focus:outline-none"
        >
          {value}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={4}
          className="z-50 min-w-[8rem] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card-bg)] shadow-md"
        >
          {options.map((opt) => (
            <DropdownMenu.Item
              key={opt}
              onSelect={() => onSelect(opt)}
              className="cursor-pointer px-3 py-2 text-sm outline-none data-[highlighted]:bg-[var(--button-hover-bg)]"
            >
              {opt}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
