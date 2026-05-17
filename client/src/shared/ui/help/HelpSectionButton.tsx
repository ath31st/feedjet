import { baseActionClass } from '@/shared/styles';

interface HelpSectionButtonProps {
  label: string;
  onClick: () => void;
}

export function HelpSectionButton({ label, onClick }: HelpSectionButtonProps) {
  return (
    <button type="button" onClick={onClick} className={baseActionClass}>
      {label}
    </button>
  );
}
