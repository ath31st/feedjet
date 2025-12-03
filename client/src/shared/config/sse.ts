export const SSE_URL = {
  STREAM: (kioskId: number) => `/sse/stream/${kioskId}`,
} as const;
