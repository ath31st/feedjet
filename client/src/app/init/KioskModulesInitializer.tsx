import { useFeedConfigStoreInit } from './useFeedConfigStoreInit';
import { useUiConfigStoreInit } from './useUiConfigStoreInit';
import { useSseStream } from './useSseStream';
import { useTickerConfigStoreInit } from './useTickerConfigStoreInit';
import { useScenarioStoreInit } from './useScenarioStoreInit';
import { useDeviceStoreInit } from './useDeviceStoreInit';

interface Props {
  kioskId: number;
}

export function KioskModulesInitializer({ kioskId }: Props) {
  useDeviceStoreInit();

  useSseStream(kioskId);

  useUiConfigStoreInit(kioskId);
  useScenarioStoreInit(kioskId);
  useFeedConfigStoreInit();
  useTickerConfigStoreInit(kioskId);

  return null;
}
