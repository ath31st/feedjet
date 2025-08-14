import { TRPCError } from '@trpc/server';
import { ServiceError } from '../errors/service.error.js';

export function handleServiceCall<T>(fn: () => T): T {
  try {
    return fn();
  } catch (error) {
    if (error instanceof ServiceError) {
      let trpcCode: TRPCError['code'];
      switch (error.code) {
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

      throw new TRPCError({ code: trpcCode, message: error.message });
    }

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Unexpected error',
    });
  }
}
