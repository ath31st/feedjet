import { useFeedConfigStoreInit } from '@/entities/feed-config';
import { useUiConfigStoreInit } from '@/entities/ui-config';
import { useVideoStoreInit } from '@/entities/video';
import { useKioskInitialization } from './useKioskInitialization';
import { useSseStream } from './useSseStream';

export function KioskInitializer() {
  useKioskInitialization();

  useSseStream();

  useUiConfigStoreInit();
  useFeedConfigStoreInit();
  useVideoStoreInit();
  return null;
}
