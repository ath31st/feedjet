import { useCallback } from 'react';
import { useEventSource } from '../../../shared/api/sse/useEventSource';

const CONROL_SSE_URL = `${import.meta.env.VITE_API_URL}/sse/control`;

export function useControlSse() {
  const onMessage = useCallback((e: MessageEvent) => {
    try {
      const msg = JSON.parse(e.data) as { type: string };
      if (msg.type === 'reload-kiosks') {
        if (window.location.pathname === '/') {
          window.location.reload();
        }
      }
    } catch {}
  }, []);

  useEventSource(CONROL_SSE_URL, onMessage);
}
