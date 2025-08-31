import type { Request, Response } from 'express';
import { eventBus } from '../container.js';
import type { VideoMetadata } from '@shared/types/video.js';

export const videoSseHandler = (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const listener = (videos: VideoMetadata[]) => {
    res.write(`data: ${JSON.stringify(videos)}\n\n`);
  };

  eventBus.on('video', listener);

  res.on('close', () => {
    eventBus.off('video', listener);
    res.end();
  });
};
