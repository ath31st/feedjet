import { ScheduleGrid } from './ScheduleGrid';
import { useWeekSelector } from '../model/useWeekSelector';
import { WeekSelector } from './WeekSelector';

export function ScheduleManagementWidget() {
  const { weeks, weekStart, setWeekStart } = useWeekSelector();

  return (
    <div className="flex flex-col gap-4">
      <WeekSelector
        weeks={weeks}
        weekStart={weekStart}
        onChange={setWeekStart}
      />
      <ScheduleGrid weekStart={weekStart} />
    </div>
  );
}
