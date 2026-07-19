import { AsyncLocalStorage } from 'node:async_hooks';
import { join } from 'node:path';
import pino from 'pino';

const logLevel = process.env.LOG_LEVEL || 'info';

export type RequestLogStore = {
  requestId: string;
};

export const requestLogContext = new AsyncLocalStorage<RequestLogStore>();

const transport = pino.transport({
  targets: [
    {
      target: 'pino-pretty',
      level: logLevel,
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
    {
      target: 'pino-roll',
      level: logLevel,
      options: {
        file: join('logs', 'app'),
        dateFormat: 'yyyy-MM-dd',
        frequency: 'daily',
        extension: '.log',
        mkdir: true,
        symlink: true,
        limit: {
          count: 7,
        },
      },
    },
  ],
});

const logger = pino(
  {
    level: logLevel,
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
    mixin() {
      const store = requestLogContext.getStore();
      return store?.requestId ? { requestId: store.requestId } : {};
    },
  },
  transport,
);

export function createServiceLogger(serviceName: string) {
  return logger.child({ source: serviceName });
}
