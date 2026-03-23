import * as Popover from '@radix-ui/react-popover';
import { InfoCircledIcon } from '@radix-ui/react-icons';

interface PopoverHintProps {
  content: React.ReactNode;
  trigger?: React.ReactNode;
  className?: string;
}

export function PopoverHint({ content, trigger, className }: PopoverHintProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        {trigger ?? (
          <InfoCircledIcon className="h-5 w-5 cursor-pointer text-(--text-secondary) hover:text-(--text-primary)" />
        )}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className={`z-50 max-w-xs rounded-lg border border-(--border) bg-(--card-bg) p-3 text-sm ${className ?? ''}`}
        >
          {content}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
