import type { DaySchedule } from '@/entities/kiosk-work-schedule';
import { DAYS } from '@/shared/constant';
import * as Switch from '@radix-ui/react-switch';

interface DayScheduleCardProps {
  day: DaySchedule;
  onChange: (updated: DaySchedule) => void;
}

export function DayScheduleCard({ day, onChange }: DayScheduleCardProps) {
  return (
    <div
      className={`${day.isEnabled ? '' : 'text-(--meta-text)'} flex items-center gap-10 rounded-lg border ${day.isEnabled ? 'border-(--border)' : 'border-(--border-disabled)'} bg-(--card-bg) p-2`}
    >
      <span className="w-40 font-bold">{DAYS[day.dayOfWeek]}</span>

      <div className="flex items-center gap-2">
        <span>Включение:</span>
        <input
          className="cursor-pointer rounded-lg border border-(--border) bg-(--button-bg) p-2 outline-none"
          type="time"
          value={day.startTime}
          onChange={(e) => onChange({ ...day, startTime: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-2">
        <span>Выключение:</span>
        <input
          className="cursor-pointer rounded-lg border border-(--border) bg-(--button-bg) p-2 outline-none"
          type="time"
          value={day.endTime}
          onChange={(e) => onChange({ ...day, endTime: e.target.value })}
        />
      </div>

      <Switch.Root
        checked={day.isEnabled}
        onCheckedChange={(checked) => onChange({ ...day, isEnabled: checked })}
        className="relative ml-auto h-5 w-10 shrink-0 cursor-pointer rounded-full border border-(--border) transition-colors data-[state=checked]:bg-(--button-bg)"
      >
        <Switch.Thumb className="block h-4 w-4 translate-x-[1px] rounded-full bg-(--text) transition-transform data-[state=checked]:translate-x-[21px]" />
      </Switch.Root>
    </div>
  );
}
