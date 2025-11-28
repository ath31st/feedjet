import { useQuery } from '@tanstack/react-query';
import { trpcWithProxy } from '@/shared/api';

export const useImageCache = (url: string, w?: number) => {
  return useQuery(trpcWithProxy.imageCache.get.queryOptions({ url, w }));
};
