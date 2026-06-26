import {
  createUnifiedSseHandler,
  type SseSubscription,
} from './unified.sse.handler.js';

export const unifiedSseHandler = createUnifiedSseHandler((kioskId) => {
  const subs: SseSubscription[] = [
    { eventName: 'feed', messageType: 'feed' },
    { eventName: 'control', messageType: 'control' },
    {
      eventName: 'keepalive',
      messageType: 'keepalive',
    },
  ];

  if (kioskId) {
    subs.push(
      { eventName: `feed-config:${kioskId}`, messageType: 'feed-config' },
      { eventName: `ticker-config:${kioskId}`, messageType: 'ticker-config' },
      { eventName: `ui-config:${kioskId}`, messageType: 'ui-config' },
      { eventName: `scenario:${kioskId}`, messageType: 'scenario' },
    );
  }

  return subs;
});
