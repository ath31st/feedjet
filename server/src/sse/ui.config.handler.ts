import type { Request, Response } from 'express';
import { eventBus } from '../container.js';
import type { UiConfig } from '@shared/types/ui.js';

export const uiConfigSseHandler = (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const listener = (cfg: UiConfig) => {
    res.write(`data: ${JSON.stringify(cfg)}\n\n`);
  };

  eventBus.on('ui-config', listener);

  res.on('close', () => {
    eventBus.off('ui-config', listener);
    res.end();
  });
};
