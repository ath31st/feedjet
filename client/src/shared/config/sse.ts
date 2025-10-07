export const SSE_URL = {
  FEED: '/sse/feed',
  VIDEO: '/sse/video',
  FEED_CONFIG: (kioskId: number) => `/sse/feed-config/${kioskId}`,
  CONTROL: (kioskId: number) => `/sse/control/${kioskId}`,
  UI_CONFIG: (kioskId: number) => `/sse/ui-config/${kioskId}`,
} as const;
