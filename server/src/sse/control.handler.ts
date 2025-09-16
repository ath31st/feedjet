import type { Request, Response } from 'express';
import { eventBus } from '../container.js';
import type { ControlEvent } from '@shared/types/control.event.js';

export const controlSseHandler = (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const listener = (event: ControlEvent) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  eventBus.on('control', listener);

  res.on('close', () => {
    eventBus.off('control', listener);
    res.end();
  });
};
