import {
  createUnifiedSseHandler,
  type SseSubscription,
} from './unified.sse.handler.js';

export const unifiedSseHandler = createUnifiedSseHandler((kioskId) => {
  const subs: SseSubscription[] = [
    { eventName: 'feed', messageType: 'feed' },
    { eventName: 'video', messageType: 'video' },
    {
      eventName: 'keepalive',
      messageType: 'keepalive',
    },
  ];

  if (kioskId) {
    subs.push(
      { eventName: `control:${kioskId}`, messageType: 'control' },
      { eventName: `feed-config:${kioskId}`, messageType: 'feed-config' },
      { eventName: `ui-config:${kioskId}`, messageType: 'ui-config' },
    );
  }

  return subs;
});
