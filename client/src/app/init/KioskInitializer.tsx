import { useFeedConfigStoreInit } from './useFeedConfigStoreInit';
import { useUiConfigStoreInit } from './useUiConfigStoreInit';
import { useVideoStoreInit } from './useVideoStoreInit';
import { useKioskInitialization } from './useKioskInitialization';
import { useSseStream } from './useSseStream';
import { useKioskStore } from '@/entities/kiosk';
import { useImageStoreInit } from './useImageStoreInit';

export function KioskInitializer() {
  useKioskInitialization();

  const kioskId = useKioskStore((s) => s.currentKiosk.id);

  useSseStream();

  useUiConfigStoreInit();
  useFeedConfigStoreInit();
  useVideoStoreInit();
  useImageStoreInit(kioskId);

  return null;
}
