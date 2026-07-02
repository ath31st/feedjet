import type { ReactNode } from 'react';

interface AppearanceButtonProps<T> {
  value: T;
  isActive: boolean;
  disabled?: boolean;
  label: string | ReactNode;
  onClick: (value: T) => void;
}

export function AppearanceButton<T>({
  value,
  isActive,
  disabled = false,
  label,
  onClick,
}: AppearanceButtonProps<T>) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onClick(value)}
      className={`cursor-pointer rounded-lg border p-2 font-medium hover:bg-(--button-hover-bg) ${
        isActive
          ? 'border-(--border) bg-(--button-bg) text-(--text)'
          : 'border-(--border)'
      }`}
    >
      {label}
    </button>
  );
}
