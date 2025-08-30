import { useImage } from '@/entities/image';
import noImageAvailableUrl from '@/shared/assets/images/no-image-available.jpg';
import { SERVER_URL } from '@/shared/config/env';

export function useFeedImage(url: string, width?: number) {
  const { data, isLoading, isError } = useImage(url, width);

  return {
    src: isError || !data ? noImageAvailableUrl : SERVER_URL + data,
    isLoading,
  };
}
