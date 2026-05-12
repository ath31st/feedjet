import { useEffect } from 'react';

interface UseIframeBridgeProps {
  onNext: () => void;
  onPrev: () => void;
  onTogglePause: () => void;
  userPaused: boolean;
  currentItemId: number | null;
  currentIndex: number;
}

export const useIframeBridge = ({
  onNext,
  onPrev,
  onTogglePause,
  userPaused,
  currentItemId,
  currentIndex,
}: UseIframeBridgeProps) => {
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (typeof event.data !== 'object' || event.data === null) return;

      switch (event.data.type) {
        case 'kiosk:next':
          onNext();
          break;
        case 'kiosk:prev':
          onPrev();
          break;
        case 'kiosk:toggle':
          onTogglePause();
          break;
        case 'kiosk:state-request':
          window.parent?.postMessage(
            {
              type: 'kiosk:state',
              userPaused,
              itemId: currentItemId,
              index: currentIndex,
            },
            '*',
          );
          break;
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onNext, onPrev, onTogglePause, userPaused, currentItemId, currentIndex]);

  useEffect(() => {
    if (!currentItemId) return;
    if (window.parent === window) return;

    window.parent.postMessage(
      {
        type: 'kiosk:item-changed',
        itemId: currentItemId,
        index: currentIndex,
        userPaused,
      },
      '*',
    );
  }, [currentItemId, currentIndex, userPaused]);
};
