interface HelpSectionButtonProps {
  label: string;
  onClick: () => void;
}

export function HelpSectionButton({ label, onClick }: HelpSectionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border border-(--border) bg-(--card-bg) px-2 py-2 text-center text-(--text-primary) text-xs transition-colors hover:bg-(--button-hover-bg)"
    >
      {label}
    </button>
  );
}
