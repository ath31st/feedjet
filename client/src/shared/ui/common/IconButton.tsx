import type { ReactNode } from 'react';
import { TooltipWrapper } from '../TooltipWrapper';

interface IconButtonProps {
  onClick: () => void;
  icon: ReactNode;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  tooltip?: string;
}

export function IconButton({
  onClick,
  icon,
  disabled = false,
  className = '',
  ariaLabel,
  tooltip,
}: IconButtonProps) {
  const button = (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`cursor-pointer rounded-lg p-1 hover:bg-(--button-hover-bg) ${className}`}
    >
      {icon}
    </button>
  );

  if (!tooltip) return button;

  return <TooltipWrapper tooltip={tooltip}>{button}</TooltipWrapper>;
}
