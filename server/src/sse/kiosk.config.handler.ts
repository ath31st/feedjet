import type { Request, Response } from 'express';
import { eventBus } from '../container.js';

export const configSseHandler = (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const listener = (cfg: unknown) => {
    res.write(`data: ${JSON.stringify(cfg)}\n\n`);
  };
  eventBus.on('config', listener);

  res.on('close', () => {
    eventBus.off('config', listener);
    res.end();
  });
};
