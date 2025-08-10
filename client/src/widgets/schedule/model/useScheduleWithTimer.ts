import { useState, useEffect } from 'react';
import { useFindScheduleEventsByDate } from '@/entities/schedule';
import { getOnlyDateStr } from '@/shared/lib/getOnlyDateStr';

export function useScheduleWithTimer() {
  const todayDate = new Date();
  const [now, setNow] = useState(todayDate);
  const {
    data: events,
    isLoading,
    refetch,
  } = useFindScheduleEventsByDate(getOnlyDateStr(todayDate));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
      refetch();
    }, 60_000);
    return () => clearInterval(intervalId);
  }, [refetch]);

  return { now, events, isLoading };
}
