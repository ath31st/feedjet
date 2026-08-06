import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function parseYmdLocal(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function fmtShortYmd(ymd: string): string {
  return format(parseYmdLocal(ymd), 'd MMM', { locale: ru }).replace(
    /\.$/,
    '',
  );
}

export function formatShowPeriodBadge(
  activeFrom: string | null | undefined,
  activeTo: string | null | undefined,
): string {
  const from = activeFrom ?? null;
  const to = activeTo ?? null;

  if (from == null && to == null) return 'Всегда';
  if (from == null || to == null) return 'Всегда';

  if (from === to) return fmtShortYmd(from);

  return `${fmtShortYmd(from)} – ${fmtShortYmd(to)}`;
}

export function formatShowPeriodSummary(
  activeFrom: string,
  activeTo: string,
): string {
  if (activeFrom === activeTo) return fmtShortYmd(activeFrom);
  return `${fmtShortYmd(activeFrom)} – ${fmtShortYmd(activeTo)}`;
}
