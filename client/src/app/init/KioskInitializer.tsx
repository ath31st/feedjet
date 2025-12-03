import { useFeedConfigStoreInit } from './useFeedConfigStoreInit';
import { useUiConfigStoreInit } from './useUiConfigStoreInit';
import { useVideoStoreInit } from './useVideoStoreInit';
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
