import { formatShowPeriodBadge } from '@/entities/scenario';
import { TooltipWrapper } from '@/shared/ui';

interface ShowPeriodBadgeProps {
  activeFrom: string | null | undefined;
  activeTo: string | null | undefined;
  onClick: () => void;
}

const triggerClass =
  'inline-flex h-7 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-(--border) bg-(--card-bg) px-2 text-xs hover:bg-(--button-hover-bg) focus:outline-none focus:ring-1 focus:ring-(--border)';

export function ShowPeriodBadge({
  activeFrom,
  activeTo,
  onClick,
}: ShowPeriodBadgeProps) {
  const label = formatShowPeriodBadge(activeFrom, activeTo);

  return (
    <TooltipWrapper tooltip={'Период показа'}>
      <button
        type="button"
        onClick={onClick}
        className={`${triggerClass}`}
        aria-label="Период показа"
      >
        {label}
      </button>
    </TooltipWrapper>
  );
}
