import type { MouseEventHandler } from 'react';
import { TooltipWrapper } from '../TooltipWrapper';

interface CommonButtonProps {
  type: 'button' | 'submit' | 'reset' | undefined;
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
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
      className={`rounded-lg border border-(--border) bg-(--button-bg) p-2 text-(--button-text) hover:bg-(--button-hover-bg) ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );

  if (!tooltip) return button;

  return <TooltipWrapper tooltip={tooltip}>{button}</TooltipWrapper>;
}
