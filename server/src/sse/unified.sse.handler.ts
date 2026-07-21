import type { Request, Response } from 'express';
import { eventBus, rssFeedCacheService } from '../container.js';
import {
  refreshFeedCache,
  startRssJobs,
  stopRssJobs,
} from '../cron/rss.cron.js';
import { createServiceLogger } from '../utils/pino.logger.js';
import { sseConnectionRegistry } from './sse.connection.registry.js';

const logger = createServiceLogger('sseUnifiedHandler');

export type SseSubscription = {
  eventName: string;
  messageType: string;
};

export type SubscriptionBuilder = (kioskId?: string) => SseSubscription[];

export function createUnifiedSseHandler(
  getSubscriptionList: SubscriptionBuilder,
) {
  return (req: Request, res: Response) => {
    const kioskId = req.params.kioskId;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const activeConnections = sseConnectionRegistry.onConnect();
    if (activeConnections === 1) {
      startRssJobs();
    }

    if (!rssFeedCacheService.hasCache()) {
      void refreshFeedCache();
    }

    logger.info({ kioskId, fn: 'unifiedSseHandler' }, 'SSE client connected');

    const subscriptions = getSubscriptionList(kioskId);

    const listeners = new Map<string, (payload: string) => void>();

    subscriptions.forEach(({ eventName, messageType }) => {
      const listener = (payload: string) => {
        try {
          const data = JSON.stringify({ type: messageType, payload });
          res.write(`data: ${data}\n\n`);

          logger.debug(
            { type: messageType, kioskId, fn: 'unifiedSseHandler' },
            'SSE message sent',
          );
        } catch (err) {
          logger.warn(
            { err, fn: 'unifiedSseHandler' },
            'Failed to send SSE message',
          );
        }
      };

      listeners.set(eventName, listener);
      eventBus.on(eventName, listener);
    });

    res.on('close', () => {
      listeners.forEach((listener, eventName) => {
        eventBus.off(eventName, listener);
      });

      const remaining = sseConnectionRegistry.onDisconnect();
      if (remaining === 0) {
        stopRssJobs();
      }

      logger.info(
        { kioskId, fn: 'unifiedSseHandler' },
        'SSE client disconnected',
      );
      res.end();
    });
  };
}
