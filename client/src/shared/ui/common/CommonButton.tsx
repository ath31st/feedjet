interface CommonButtonProps {
  type: 'button' | 'submit' | 'reset' | undefined;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function CommonButton({
  type,
  children,
  onClick,
  disabled = false,
}: CommonButtonProps) {
  return (
    <button
      className="cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--button-bg)] p-2 text-[var(--button-text)] hover:bg-[var(--button-hover-bg)]"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
