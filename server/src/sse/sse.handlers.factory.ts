import type { Request, Response } from 'express';
import { eventBus } from '../container.js';

type Listener<T> = (payload: T) => void;

export function createSseHandler<T>(event: string) {
  return (req: Request, res: Response) => {
    const kioskId = req.params.kioskId;
    const eventName = kioskId ? `${event}:${kioskId}` : event;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const listener: Listener<T> = (payload) => {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    };

    eventBus.on(eventName, listener);

    res.on('close', () => {
      eventBus.off(eventName, listener);
      res.end();
    });
  };
}
