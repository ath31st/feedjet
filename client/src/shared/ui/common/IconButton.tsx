import type { ReactNode } from 'react';

interface IconButtonProps {
  onClick: () => void;
  icon: ReactNode;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function IconButton({
  onClick,
  icon,
  disabled = false,
  className = '',
  ariaLabel,
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`rounded-md p-1 hover:bg-[var(--button-hover-bg)] ${className}`}
    >
      {icon}
    </button>
  );
}
