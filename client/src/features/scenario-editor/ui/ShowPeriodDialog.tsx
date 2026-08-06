import { Calendar } from 'lucide-react';
import { CheckIcon, ResetIcon } from '@radix-ui/react-icons';
import { AnimatePresence, motion } from 'framer-motion';
import { formatShowPeriodSummary } from '@/entities/scenario';
import { CommonButton, CommonDialog } from '@/shared/ui/common';
import { useShowPeriodDialogState } from '../model/useShowPeriodDialogState';
import { ShowPeriodCalendar } from './ShowPeriodCalendar';

const schedulePanelMotion = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.2, ease: 'easeOut' as const },
};

interface ShowPeriodDialogProps {
  open: boolean;
  itemLabel: string;
  activeFrom: string | null | undefined;
  activeTo: string | null | undefined;
  onClose: () => void;
  onSave: (values: {
    activeFrom: string | null;
    activeTo: string | null;
  }) => void;
}

export function ShowPeriodDialog({
  open,
  itemLabel,
  activeFrom,
  activeTo,
  onClose,
  onSave,
}: ShowPeriodDialogProps) {
  const {
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
  } = useShowPeriodDialogState(open, activeFrom, activeTo);

  const handleSave = () => {
    if (!canSave) return;
    onSave(getSaveValues());
    onClose();
  };

  const summaryFrom = rangeStart;
  const summaryTo = rangeEnd ?? rangeStart;

  return (
    <CommonDialog open={open} onClose={onClose} size="sm">
      <CommonDialog.Header icon={<Calendar size={18} />} title={itemLabel} />

      <CommonDialog.Body>
        <div className="mb-4 flex rounded-lg border border-(--border)/40 p-1">
          <button
            type="button"
            className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors ${
              mode === 'always'
                ? 'bg-(--button-bg) font-medium text-(--button-text)'
                : 'text-(--meta-text) hover:text-(--text)'
            }`}
            onClick={() => setMode('always')}
          >
            Всегда
          </button>
          <button
            type="button"
            className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors ${
              mode === 'schedule'
                ? 'bg-(--button-bg) font-medium text-(--button-text)'
                : 'text-(--meta-text) hover:text-(--text)'
            }`}
            onClick={() => setMode('schedule')}
          >
            По расписанию
          </button>
        </div>

        <AnimatePresence initial={false}>
          {mode === 'schedule' && (
            <motion.div
              key="schedule-panel"
              {...schedulePanelMotion}
              className="overflow-hidden"
            >
              <div className="space-y-3">
                {summaryFrom != null && summaryTo != null && (
                  <div className="rounded-lg border border-(--border)/30 bg-(--button-bg)/10 px-3 py-2 text-(--category-text) text-sm">
                    Показ: {formatShowPeriodSummary(summaryFrom, summaryTo)}
                  </div>
                )}

                <ShowPeriodCalendar
                  viewMonth={viewMonth}
                  onViewMonthChange={setViewMonth}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  onDayClick={handleDayClick}
                />

                <CommonButton
                  className="text-xs"
                  type="button"
                  tooltip="Очистить период"
                  onClick={clearPeriod}
                >
                  Очистить период
                </CommonButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CommonDialog.Body>

      <CommonDialog.Footer>
        <CommonButton type="button" tooltip="Отмена" onClick={onClose}>
          <ResetIcon />
        </CommonButton>

        <CommonButton
          type="button"
          tooltip="Сохранить"
          disabled={!canSave}
          onClick={handleSave}
        >
          <CheckIcon />
        </CommonButton>
      </CommonDialog.Footer>
    </CommonDialog>
  );
}
