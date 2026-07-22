import { useEffect, useEffectEvent } from 'react';

interface UseAutoWeatherRefetchProps {
  refetchDaily: () => void;
  refetchCurrent: () => void;
  intervalMs?: number;
  enabled?: boolean;
}

export function useAutoWeatherRefetch({
  refetchDaily,
  refetchCurrent,
  intervalMs = 60000,
  enabled = true,
}: UseAutoWeatherRefetchProps) {
  const refetchAll = useEffectEvent(() => {
    refetchDaily();
    refetchCurrent();
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const id = setInterval(() => {
      refetchAll();
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs, enabled]);
}
