import { useFeedConfigStoreInit } from './useFeedConfigStoreInit';
import { useUiConfigStoreInit } from './useUiConfigStoreInit';
import { useVideoStoreInit } from './useVideoStoreInit';
import { useKioskInitialization } from './useKioskInitialization';
import { useSseStream } from './useSseStream';
import { useKioskStore } from '@/entities/kiosk';
import { useImageStoreInit } from './useImageStoreInit';
import { useTickerConfigStoreInit } from './useTickerConfigStoreInit';
import { useScenarioStoreInit } from './useScenarioStoreInit';

export function KioskInitializer() {
  useKioskInitialization();
  const kioskId = useKioskStore((s) => s.currentKiosk.id);

  useSseStream();

  useUiConfigStoreInit(kioskId);
  useScenarioStoreInit(kioskId);
  useFeedConfigStoreInit();
  useTickerConfigStoreInit(kioskId);
  useVideoStoreInit(kioskId);
  useImageStoreInit(kioskId);

  return null;
}
