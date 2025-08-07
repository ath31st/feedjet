import { useImage } from '@/entities/image';
import noImageAvailableUrl from '@/shared/assets/images/no-image-available.jpg';

export function useFeedImage(url: string, width?: number) {
  const { data, isLoading, isError } = useImage(url, width);

  return {
    src:
      isError || !data
        ? noImageAvailableUrl
        : import.meta.env.VITE_API_URL + data,
    isLoading,
  };
}
