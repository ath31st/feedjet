import { useEffect, useEffectEvent } from 'react';

interface UseAutoWeatherRefetchProps {
  refetchDaily: () => void;
  refetchCurrent: () => void;
  intervalMs?: number;
}

export function useAutoWeatherRefetch({
  refetchDaily,
  refetchCurrent,
  intervalMs = 60000,
}: UseAutoWeatherRefetchProps) {
  const refetchAll = useEffectEvent(() => {
    refetchDaily();
    refetchCurrent();
  });

  useEffect(() => {
    const id = setInterval(() => {
      refetchAll();
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs]);
}
