import { useCallback } from 'react';
import { useEventSource } from '../../../shared/api/sse/useEventSource';
import { SERVER_URL } from '@/shared/config/env';

const CONROL_SSE_URL = `${SERVER_URL}/sse/control`;

export function useControlSse() {
  const onMessage = useCallback((e: MessageEvent) => {
    try {
      const msg = JSON.parse(e.data) as { type: string };
      if (msg.type === 'reload-kiosks') {
        if (window.location.pathname === '/') {
          window.location.reload();
        }
      }

      if (msg.type === 'switch-widget') {
        console.log(msg);
      }
    } catch {}
  }, []);

  useEventSource(CONROL_SSE_URL, onMessage);
}
