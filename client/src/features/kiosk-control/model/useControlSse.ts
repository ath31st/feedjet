import { useCallback } from 'react';
import { useEventSource } from '@/shared/api';
import { SERVER_URL } from '@/shared/config';
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
      if (msg.type === 'reload-kiosk') {
        window.location.reload();
      }

      if (msg.type === 'switch-widget') {
        console.log(msg);
      }
    } catch {}
  }, []);

  useEventSource(sseUrl, onMessage);
}
