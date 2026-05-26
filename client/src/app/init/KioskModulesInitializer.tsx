import { useFeedConfigStoreInit } from './useFeedConfigStoreInit';
import { useUiConfigStoreInit } from './useUiConfigStoreInit';
import { useVideoStoreInit } from './useVideoStoreInit';
import { useSseStream } from './useSseStream';
import { useImageStoreInit } from './useImageStoreInit';
import { useTickerConfigStoreInit } from './useTickerConfigStoreInit';
import { useScenarioStoreInit } from './useScenarioStoreInit';

interface Props {
  kioskId: number;
}

export function KioskModulesInitializer({ kioskId }: Props) {
  useSseStream(kioskId);

  useUiConfigStoreInit(kioskId);
  useScenarioStoreInit(kioskId);
  useFeedConfigStoreInit();
  useTickerConfigStoreInit(kioskId);
  useVideoStoreInit(kioskId);
  useImageStoreInit(kioskId);

  return null;
}
