import { createServiceLogger } from '../utils/pino.logger.js';

const logger = createServiceLogger('sseConnectionRegistry');

let activeConnections = 0;

export const sseConnectionRegistry = {
  onConnect(): number {
    activeConnections += 1;
    logger.debug(
      { activeConnections, fn: 'onConnect' },
      'SSE connection count increased',
    );
    return activeConnections;
  },

  onDisconnect(): number {
    activeConnections = Math.max(0, activeConnections - 1);
    logger.debug(
      { activeConnections, fn: 'onDisconnect' },
      'SSE connection count decreased',
    );
    return activeConnections;
  },

  getCount(): number {
    return activeConnections;
  },
};
