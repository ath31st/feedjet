import { createServiceLogger } from '../utils/pino.logger.js';

const logger = createServiceLogger('sseConnectionRegistry');

let activeConnections = 0;

type SseLifecycleCallbacks = {
  onFirstConnect?: () => void;
  onLastDisconnect?: () => void;
};

let lifecycleCallbacks: SseLifecycleCallbacks = {};

export function registerSseLifecycleCallbacks(
  callbacks: SseLifecycleCallbacks,
): void {
  lifecycleCallbacks = callbacks;
}

export const sseConnectionRegistry = {
  onConnect(): number {
    activeConnections += 1;
    logger.debug(
      { activeConnections, fn: 'onConnect' },
      'SSE connection count increased',
    );

    if (activeConnections === 1) {
      lifecycleCallbacks.onFirstConnect?.();
    }

    return activeConnections;
  },

  onDisconnect(): number {
    activeConnections = Math.max(0, activeConnections - 1);
    logger.debug(
      { activeConnections, fn: 'onDisconnect' },
      'SSE connection count decreased',
    );

    if (activeConnections === 0) {
      lifecycleCallbacks.onLastDisconnect?.();
    }

    return activeConnections;
  },

  getCount(): number {
    return activeConnections;
  },
};
