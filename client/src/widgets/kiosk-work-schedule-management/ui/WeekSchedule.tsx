import { DayScheduleCard } from './DayScheduleCard';
import { useWeekSchedule } from '../model/useWeekSchedule';

interface WeekScheduleProps {
  kioskId: number;
}

export function WeekSchedule({ kioskId }: WeekScheduleProps) {
  const {
    isLoading,
    schedules,
    handleChange,
    isLoadingIntegrations,
    hasIntegration,
  } = useWeekSchedule(kioskId);

  if (isLoading || isLoadingIntegrations) return <div>Загрузка...</div>;

  return (
    <div className="relative flex flex-col gap-2">
      {!hasIntegration && (
        <div className="mb-4 rounded-lg border border-(--border) bg-(--border-disabled) p-3">
          <p>
            <strong>Внимание:</strong> Управление расписанием недоступно. Не
            настроена интеграция. Пожалуйста, проверьте конфигурацию киоска.
          </p>
        </div>
      )}

      <div
        className={
          !hasIntegration ? 'pointer-events-none select-none opacity-50' : ''
        }
      >
        <div className="flex flex-col gap-2">
          {schedules.map((d) => (
            <DayScheduleCard
              key={d.dayOfWeek}
              day={d}
              onChange={handleChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
