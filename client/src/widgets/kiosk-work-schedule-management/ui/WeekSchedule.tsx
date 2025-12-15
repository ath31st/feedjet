import { DayScheduleCard } from './DayScheduleCard';
import { useWeekSchedule } from '../model/useWeekSchedule';

interface WeekScheduleProps {
  kioskId: number;
}

export function WeekSchedule({ kioskId }: WeekScheduleProps) {
  const { isLoading, schedules, handleChange } = useWeekSchedule(kioskId);

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="flex flex-col gap-2">
      {schedules.map((d) => (
        <DayScheduleCard key={d.dayOfWeek} day={d} onChange={handleChange} />
      ))}
    </div>
  );
}
