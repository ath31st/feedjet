import { SettingsCard } from '@/shared/ui';
import { WeekSchedule } from './WeekSchedule';

interface KioskWorkScheduleManagementProps {
  kioskId: number;
}

export function KioskWorkScheduleManagement({
  kioskId,
}: KioskWorkScheduleManagementProps) {
  return (
    <SettingsCard title="Расписание работы киоска" className="w-full">
      <WeekSchedule kioskId={kioskId} />
    </SettingsCard>
  );
}
