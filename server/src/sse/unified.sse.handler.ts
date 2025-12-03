import type { Request, Response } from 'express';
import { eventBus } from '../container.js';
import { createServiceLogger } from '../utils/pino.logger.js';

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

      logger.info(
        { kioskId, fn: 'unifiedSseHandler' },
        'SSE client disconnected',
      );
      res.end();
    });
  };
}
