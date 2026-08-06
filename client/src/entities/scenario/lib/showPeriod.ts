import { fmtLocalDateYmd } from '@/shared/lib/formatters';

export function isWithinShowPeriod(
  activeFrom: string | null | undefined,
  activeTo: string | null | undefined,
  today: string = fmtLocalDateYmd(),
): boolean {
  const from = activeFrom ?? null;
  const to = activeTo ?? null;

  if (from == null && to == null) return true;
  if (from == null || to == null) return false;

  return from <= today && today <= to;
}

export function isItemWithinShowPeriod(
  item: {
    activeFrom?: string | null;
    activeTo?: string | null;
  },
  today: string = fmtLocalDateYmd(),
): boolean {
  return isWithinShowPeriod(item.activeFrom, item.activeTo, today);
}

export function isItemPlayableToday(
  item: {
    isActive: boolean;
    activeFrom?: string | null;
    activeTo?: string | null;
  },
  today: string = fmtLocalDateYmd(),
): boolean {
  return item.isActive && isItemWithinShowPeriod(item, today);
}
