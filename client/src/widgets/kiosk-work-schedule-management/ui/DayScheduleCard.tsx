import type { DaySchedule } from '@/entities/kiosk-work-schedule';
import { DAYS } from '@/shared/constant';
import { CommonSwitch } from '@/shared/ui/common';

interface DayScheduleCardProps {
  day: DaySchedule;
  onChange: (updated: DaySchedule) => void;
}

export function DayScheduleCard({ day, onChange }: DayScheduleCardProps) {
  return (
    <div
      className={`${day.isEnabled ? '' : 'text-(--meta-text)'} flex items-center justify-between rounded-lg border ${day.isEnabled ? 'border-(--border)' : 'border-(--border-disabled)'} bg-(--card-bg) p-2`}
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

      <CommonSwitch
        checked={day.isEnabled}
        onCheckedChange={(checked) => onChange({ ...day, isEnabled: checked })}
      ></CommonSwitch>
    </div>
  );
}
