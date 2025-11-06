import { useState, useEffect, useEffectEvent } from 'react';
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

  const onTick = useEffectEvent(() => {
    setNow(new Date());
    refetch();
    refetchCurrent();
    refetchDaily();
  });

  useEffect(() => {
    const intervalId = setInterval(onTick, 60_000);
    return () => clearInterval(intervalId);
  }, []);

  return { now, events, isLoading };
}
