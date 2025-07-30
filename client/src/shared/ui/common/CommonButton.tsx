interface CommonButtonProps {
  type: 'button' | 'submit' | 'reset' | undefined;
  text: string;
  onClick: () => void;
}

export function CommonButton({ type, text, onClick }: CommonButtonProps) {
  return (
    <button
      className="rounded-lg bg-[var(--button-bg)] px-4 py-2 text-[var(--button-text)] hover:opacity-80"
      type={type}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
