import { useEffect, useState } from 'react';
import { parseYmdLocal } from '@/entities/scenario';
import { fmtLocalDateYmd } from '@/shared/lib/formatters';

export type ShowPeriodMode = 'always' | 'schedule';

export function useShowPeriodDialogState(
  open: boolean,
  activeFrom: string | null | undefined,
  activeTo: string | null | undefined,
) {
  const [mode, setMode] = useState<ShowPeriodMode>('always');
  const [viewMonth, setViewMonth] = useState(() => new Date());
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const from = activeFrom ?? null;
    const to = activeTo ?? null;

    if (from != null && to != null) {
      setMode('schedule');
      setRangeStart(from);
      setRangeEnd(to);
      setViewMonth(parseYmdLocal(from));
    } else {
      setMode('always');
      setRangeStart(null);
      setRangeEnd(null);
      setViewMonth(new Date());
    }
  }, [open, activeFrom, activeTo]);

  const handleDayClick = (day: number) => {
    const ymd = fmtLocalDateYmd(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day),
    );

    if (rangeStart == null || (rangeStart != null && rangeEnd != null)) {
      setRangeStart(ymd);
      setRangeEnd(null);
      return;
    }

    if (ymd === rangeStart) {
      setRangeEnd(ymd);
      return;
    }

    if (ymd < rangeStart) {
      setRangeEnd(rangeStart);
      setRangeStart(ymd);
    } else {
      setRangeEnd(ymd);
    }
  };

  const clearPeriod = () => {
    setMode('always');
    setRangeStart(null);
    setRangeEnd(null);
  };

  const canSave =
    mode === 'always' || (mode === 'schedule' && rangeStart != null);

  const getSaveValues = (): {
    activeFrom: string | null;
    activeTo: string | null;
  } => {
    if (mode === 'always') {
      return { activeFrom: null, activeTo: null };
    }

    if (rangeStart == null) {
      return { activeFrom: null, activeTo: null };
    }

    const to = rangeEnd ?? rangeStart;
    return { activeFrom: rangeStart, activeTo: to };
  };

  return {
    mode,
    setMode,
    viewMonth,
    setViewMonth,
    rangeStart,
    rangeEnd,
    handleDayClick,
    clearPeriod,
    canSave,
    getSaveValues,
  };
}
