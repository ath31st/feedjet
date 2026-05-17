import { WeekSelector } from './WeekSelector';
import { useWeekSelector } from '../model/useWeekSelector';
import { ScheduleGrid } from './ScheduleGrid';
import { SlideSlot } from '@/shared/ui';

export function ScheduleManagementWidget() {
  const { weeks, weekStart, setWeekStart, mounted } = useWeekSelector();

  return (
    <div className="flex flex-col gap-4">
      <SlideSlot show={mounted} direction="down">
        <WeekSelector
          weeks={weeks}
          weekStart={weekStart}
          onChange={setWeekStart}
        />
      </SlideSlot>

      <ScheduleGrid weekStart={weekStart} />
    </div>
  );
}
