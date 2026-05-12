import { useState, useEffect, useCallback } from 'react';

interface PlayerMessage {
  type: string;
  itemId?: number;
  userPaused?: boolean;
}

export function usePlayerSync() {
  const [iframeKey, setIframeKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const [currentPlayingItemId, setCurrentPlayingItemId] = useState<
    number | null
  >(null);

  useEffect(() => {
    const onMessage = (e: MessageEvent<PlayerMessage>) => {
      if (typeof e.data !== 'object' || e.data === null) return;

      if (
        e.data.type === 'kiosk:item-changed' ||
        e.data.type === 'kiosk:state'
      ) {
        if (typeof e.data.itemId === 'number') {
          setCurrentPlayingItemId(e.data.itemId);
        }

        if (typeof e.data.userPaused === 'boolean') {
          setPaused(e.data.userPaused);
        }
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const reloadIframe = useCallback(() => {
    setIframeKey((k) => k + 1);
    setPaused(false);
  }, []);

  return {
    iframeKey,
    paused,
    setPaused,
    currentPlayingItemId,
    reloadIframe,
  };
}
