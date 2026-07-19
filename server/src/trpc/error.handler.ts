import { TRPCError } from '@trpc/server';
import { ServiceError } from '../errors/service.error.js';
import { createServiceLogger } from '../utils/pino.logger.js';

const logger = createServiceLogger('trpcErrorHandler');

export async function handleServiceCall<T>(
  fn: () => Promise<T> | T,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof ServiceError) {
      let trpcCode: TRPCError['code'];

      switch (err.code) {
        case 400:
          trpcCode = 'BAD_REQUEST';
          break;
        case 401:
          trpcCode = 'UNAUTHORIZED';
          break;
        case 403:
          trpcCode = 'FORBIDDEN';
          break;
        case 404:
          trpcCode = 'NOT_FOUND';
          break;
        case 409:
          trpcCode = 'CONFLICT';
          break;
        default:
          trpcCode = 'INTERNAL_SERVER_ERROR';
      }

      throw new TRPCError({
        code: trpcCode,
        message: err.message,
      });
    }

    logger.error({ err, fn: 'handleServiceCall' }, 'Unexpected error');

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Unexpected error',
    });
  }
}
