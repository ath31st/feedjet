import cron from 'node-cron';
import { eventBus } from '../container.js';
import { createServiceLogger } from '../utils/pino.logger.js';

const logger = createServiceLogger('sseKeepAliveCron');

export function startSseKeepAliveCron(): void {
  const expr = process.env.CRON_SSE_KEEPALIVE ?? '*/30 * * * * *';

  if (!expr) {
    logger.info(
      { fn: 'startSseKeepAliveCron' },
      'CRON_SSE_KEEPALIVE not set. KeepAlive disabled.',
    );
    return;
  }

  cron.schedule(expr, () => {
    const payload = JSON.stringify({ timestamp: Date.now() });

    eventBus.emit('keepalive', payload);

    logger.debug({ fn: 'startSseKeepAliveCron' }, 'KeepAlive event emitted');
  });
}
