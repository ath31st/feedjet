import { useGetIntegrationsByKiosk } from '@/entities/integration';
import {
  useGetKioskWorkSchedules,
  useUpsertDayKioskWorkSchedule,
  type DaySchedule,
} from '@/entities/kiosk-work-schedule';
import { DAYS } from '@/shared/constant';
import { useEffect, useState } from 'react';

export function useWeekSchedule(kioskId: number) {
  const { data: schedulesData, isLoading } = useGetKioskWorkSchedules(kioskId);
  const upsertDay = useUpsertDayKioskWorkSchedule();
  const { data: integrations = [], isLoading: isLoadingIntegrations } =
    useGetIntegrationsByKiosk(kioskId);

  const [schedules, setSchedules] = useState<DaySchedule[]>([]);

  useEffect(() => {
    if (schedulesData) {
      const initial = Array.from({ length: DAYS.length }).map((_, i) => {
        const existing = schedulesData.find((d) => d.dayOfWeek === i);
        return (
          existing ?? {
            dayOfWeek: i,
            isEnabled: false,
            startTime: '08:00',
            endTime: '20:00',
          }
        );
      });
      setSchedules(initial);
    }
  }, [schedulesData]);

  const handleChange = (updated: DaySchedule) => {
    setSchedules((prev) =>
      prev.map((d) => (d.dayOfWeek === updated.dayOfWeek ? updated : d)),
    );

    upsertDay.mutate({ kioskId, data: updated });
  };

  return {
    schedules,
    handleChange,
    isLoading,
    isLoadingIntegrations,
    hasIntegrations: integrations.length > 0,
  };
}
