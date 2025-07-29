import type { Request, Response } from 'express';
import { eventBus } from '../container.js';
import type { FeedConfig } from '@shared/types/feed.config.js';

export const feedConfigSseHandler = (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const listener = (cfg: FeedConfig) => {
    res.write(`data: ${JSON.stringify(cfg)}\n\n`);
  };

  eventBus.on('feed-config', listener);

  res.on('close', () => {
    eventBus.off('feed-config', listener);
    res.end();
  });
};
