import { useEffect, useRef } from 'react';

type Opts = {
  reconnectInterval?: number | ((attempt: number) => number);
  maxAttempts?: number;
};

export function useEventSource(
  url: string | null,
  onMessage: (event: MessageEvent) => void,
  { reconnectInterval = 3000, maxAttempts = Infinity }: Opts = {},
) {
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);
  const onMessageRef = useRef(onMessage);
  const attemptsRef = useRef(0);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!url) {
      esRef.current?.close();
      esRef.current = null;
      return;
    }

    mountedRef.current = true;
    attemptsRef.current = 0;

    const getInterval = (attempt: number) =>
      typeof reconnectInterval === 'function'
        ? reconnectInterval(attempt)
        : reconnectInterval;

    const connect = () => {
      if (!mountedRef.current) return;
      esRef.current?.close();

      const es = new EventSource(url);
      esRef.current = es;

      es.onopen = () => {
        attemptsRef.current = 0;
        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = null;
        }
      };

      es.onmessage = (e) => onMessageRef.current(e);

      es.onerror = () => {
        attemptsRef.current += 1;

        if (attemptsRef.current >= 3) {
          try {
            es.close();
          } catch {}
          esRef.current = null;

          if (
            mountedRef.current &&
            attemptsRef.current <= maxAttempts &&
            !reconnectTimerRef.current
          ) {
            const wait = Math.max(0, getInterval(attemptsRef.current));
            reconnectTimerRef.current = setTimeout(() => {
              reconnectTimerRef.current = null;
              if (mountedRef.current) connect();
            }, wait);
          }
        }
      };
    };

    connect();

    return () => {
      mountedRef.current = false;
      esRef.current?.close();
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };
  }, [url, reconnectInterval, maxAttempts]);
}
