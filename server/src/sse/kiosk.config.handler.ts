import type { Request, Response } from 'express';
import { eventBus } from '../container.js';

export const configSseHandler = (_req: Request, res: Response) => {
  console.log('🟢 SSE /sse/config connected');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const listener = (cfg: unknown) => {
    console.log('🟢 SSE /sse/config connected');
    res.write(`data: ${JSON.stringify(cfg)}\n\n`);
  };
  eventBus.on('config', listener);

  res.on('close', () => {
    console.log('🟢 SSE /sse/config connected');
    eventBus.off('config', listener);
    res.end();
  });
};
