import {
  useGetDefaultTickerConfig,
  useGetTickerConfig,
  useUpsertTickerConfig,
  type TickerConfig,
} from '@/entities/ticker-config';
import { useEffect, useState } from 'react';

export const useTickerConfigSettings = (kioskId: number) => {
  const { data: config, isLoading: isConfigLoading } =
    useGetTickerConfig(kioskId);
  const { data: defaultConfig } = useGetDefaultTickerConfig();
  const { mutate: upsertConfig, isPending: isUpdating } =
    useUpsertTickerConfig();

  const [localConfig, setLocalConfig] = useState<TickerConfig | null>(null);

  const handleSave = () => {
    if (localConfig) {
      upsertConfig(localConfig);
    }
  };

  const handleReset = () => {
    if (defaultConfig) {
      const defaultConfigWithKioskId = {
        ...defaultConfig,
        kioskId,
      };
      setLocalConfig(defaultConfigWithKioskId);
    }
  };

  const handleRollbackChanges = () => {
    if (config) {
      setLocalConfig(config);
    }
  };

  useEffect(() => {
    if (config) {
      setLocalConfig(config);
    } else {
      if (defaultConfig) {
        const defaultConfigWithKioskId = {
          ...defaultConfig,
          kioskId,
        };
        setLocalConfig(defaultConfigWithKioskId);
      }
    }
  }, [config, defaultConfig, kioskId]);

  return {
    config,
    defaultConfig,
    upsertConfig,
    isUpdating,
    isConfigLoading,
    localConfig,
    setLocalConfig,
    handleSave,
    handleReset,
    handleRollbackChanges,
  };
};
