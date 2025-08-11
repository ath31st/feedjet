import { useState, useEffect } from 'react';
import { useFindScheduleEventsByDate } from '@/entities/schedule';
import { getOnlyDateStr } from '@/shared/lib/getOnlyDateStr';

export function useScheduleWithTimer({
  refetchCurrent,
  refetchDaily,
}: {
  refetchCurrent: () => void;
  refetchDaily: () => void;
}) {
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
      refetchCurrent();
      refetchDaily();
    }, 60_000);
    return () => clearInterval(intervalId);
  }, [refetch, refetchCurrent, refetchDaily]);

  return { now, events, isLoading };
}
