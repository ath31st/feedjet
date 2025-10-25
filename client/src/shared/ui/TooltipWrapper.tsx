import * as Tooltip from '@radix-ui/react-tooltip';

interface TooltipWrapperProps {
  tooltip: string;
  children: React.ReactNode;
}

export function TooltipWrapper({ tooltip, children }: TooltipWrapperProps) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={2}
            className="select-none rounded-lg bg-[var(--button-bg)] px-2 py-1 text-[var(--tooltip-text)] text-sm shadow-md"
          >
            {tooltip}
            <Tooltip.Arrow className="fill-[var(--button-bg)]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
