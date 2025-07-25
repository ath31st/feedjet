import type { Request, Response } from 'express';
import { eventBus } from '../container.js';

export const feedSseHandler = (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const onFeed = (items: unknown) => {
    res.write(`data: ${JSON.stringify(items)}\n\n`);
  };

  eventBus.on('feed', onFeed);

  res.on('close', () => {
    eventBus.off('feed', onFeed);
    res.end();
  });
};
