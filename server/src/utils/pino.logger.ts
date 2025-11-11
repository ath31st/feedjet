import { join } from 'node:path';
import pino from 'pino';

const transport = pino.transport({
  targets: [
    {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
    {
      target: 'pino-roll',
      options: {
        file: join('logs', 'app.log'),
        frequency: 'daily',
        mkdir: true,
        maxFiles: 7,
      },
    },
  ],
});

const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport,
);

export default logger;
