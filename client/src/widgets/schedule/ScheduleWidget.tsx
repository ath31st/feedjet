import { useFindScheduleEventsByDate } from '@/entities/schedule';
import { getTodayDate } from '@/shared/lib/getTodayDate';

export function ScheduleWidget() {
  const getTodaySchedule = useFindScheduleEventsByDate(getTodayDate());
  console.log(getTodaySchedule.data);

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-10 rounded-xl 4k:border-12 border-4 border-dashed p-4 text-center font-medium text-4xl"
      style={{
        borderColor: 'var(--border)',
        color: 'var(--text)',
        backgroundColor: 'var(--card-bg)',
      }}
    >
      <p>🚧 Ведутся работы 🚧</p>
      <p>Расписание</p>
    </div>
  );
}
