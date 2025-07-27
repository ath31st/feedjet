import type { Request, Response } from 'express';
import { eventBus } from '../container.js';
import type { WidgetType } from '@shared/types/widget.js';

export const controlSseHandler = (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const listener1 = () => {
    res.write(`data: ${JSON.stringify({ type: 'reload-kiosks' })}\n\n`);
  };

  eventBus.on('control', listener1);

  const listener2 = (widgetType: WidgetType) => {
    res.write(
      `data: ${JSON.stringify({ type: 'switch-widget', widgetType })}\n\n`,
    );
  };

  eventBus.on('switch-widget', listener2);

  res.on('close', () => {
    eventBus.off('control', listener1);
    eventBus.off('switch-widget', listener2);
    res.end();
  });
};
