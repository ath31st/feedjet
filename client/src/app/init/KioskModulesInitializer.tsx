import { useFeedConfigStoreInit } from './useFeedConfigStoreInit';
import { useUiConfigStoreInit } from './useUiConfigStoreInit';
import { useSseStream } from './useSseStream';
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

  return null;
}
