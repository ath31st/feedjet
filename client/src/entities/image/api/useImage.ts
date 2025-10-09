import { useQuery } from '@tanstack/react-query';
import { trpcWithProxy } from '@/shared/api';

export const useImage = (url: string, w?: number) => {
  return useQuery(trpcWithProxy.image.get.queryOptions({ url, w }));
};
