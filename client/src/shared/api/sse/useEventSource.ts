import { useEffect, useRef } from 'react';

export function useEventSource(
  url: string,
  onMessage: (event: MessageEvent) => void,
  { reconnectInterval = 3000 }: { reconnectInterval?: number } = {},
) {
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const connect = () => {
      const es = new EventSource(url);
      esRef.current = es;

      es.onmessage = onMessage;

      es.onerror = () => {
        es.close();
        esRef.current = null;

        if (!reconnectTimerRef.current) {
          reconnectTimerRef.current = setTimeout(() => {
            reconnectTimerRef.current = null;
            connect();
          }, reconnectInterval);
        }
      };
    };

    connect();

    return () => {
      esRef.current?.close();
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };
  }, [url, onMessage, reconnectInterval]);
}
