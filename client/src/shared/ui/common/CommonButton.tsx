import * as Tooltip from '@radix-ui/react-tooltip';

interface CommonButtonProps {
  type: 'button' | 'submit' | 'reset' | undefined;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tooltip?: string;
}

export function CommonButton({
  type,
  children,
  onClick,
  disabled = false,
  tooltip,
}: CommonButtonProps) {
  const button = (
    <button
      className="cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--button-bg)] p-2 text-[var(--button-text)] hover:bg-[var(--button-hover-bg)]"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );

  if (!tooltip) return button;

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{button}</Tooltip.Trigger>
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
