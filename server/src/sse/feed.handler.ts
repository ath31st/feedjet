import type { Request, Response } from 'express';
import { eventBus } from '../container.js';
import type { FeedItem } from '@shared/types/feed.js';

export const feedSseHandler = (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const listener = (items: FeedItem[]) => {
    res.write(`data: ${JSON.stringify(items)}\n\n`);
  };

  eventBus.on('feed', listener);

  res.on('close', () => {
    eventBus.off('feed', listener);
    res.end();
  });
};
