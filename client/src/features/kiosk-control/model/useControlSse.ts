import { useCallback } from 'react';
import { useEventSource } from '@/shared/api/sse/useEventSource';
import { SERVER_URL } from '@/shared/config/env';
import type { ControlEvent } from '..';
import { useKioskStore } from '@/entities/kiosk';

export function useControlSse() {
  const { currentKiosk } = useKioskStore();

  const sseUrl = currentKiosk
    ? `${SERVER_URL}/sse/control/${currentKiosk.id}`
    : null;

  const onMessage = useCallback((e: MessageEvent) => {
    try {
      const msg = JSON.parse(e.data) as ControlEvent;
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

  useEventSource(sseUrl, onMessage);
}
