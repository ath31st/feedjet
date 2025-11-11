import type { Request, Response } from 'express';
import { eventBus } from '../container.js';
import { createServiceLogger } from '../utils/pino.logger.js';

type Listener<T> = (payload: T) => void;
const logger = createServiceLogger('sseHandlersFactory');

export function createSseHandler<T>(event: string) {
  return (req: Request, res: Response) => {
    const kioskId = req.params.kioskId;
    const eventName = kioskId ? `${event}:${kioskId}` : event;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    logger.info(
      { event, kioskId, fn: 'createSseHandler' },
      'SSE client connected',
    );

    const listener: Listener<T> = (payload) => {
      try {
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
      } catch (err) {
        logger.warn(
          { err, event, kioskId, fn: 'createSseHandler' },
          'Failed to send SSE message',
        );
      }
    };

    eventBus.on(eventName, listener);

    res.on('close', () => {
      eventBus.off(eventName, listener);
      logger.info(
        { event, kioskId, fn: 'createSseHandler' },
        'SSE client disconnected',
      );
      res.end();
    });
  };
}
