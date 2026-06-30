import { DayScheduleCard } from './DayScheduleCard';
import { useWeekSchedule } from '../model/useWeekSchedule';

interface WeekScheduleProps {
  kioskId: number;
}

export function WeekSchedule({ kioskId }: WeekScheduleProps) {
  const { isLoading, schedules, handleChange, isLoadingIntegration } =
    useWeekSchedule(kioskId);

  if (isLoading || isLoadingIntegration) return <div>Загрузка...</div>;

  return (
    <div className="relative flex flex-col gap-2">
      <div>
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
