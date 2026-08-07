import {
  useGetDefaultTickerConfig,
  useGetTickerConfig,
  useUpsertTickerConfig,
  type TickerConfig,
} from '@/entities/ticker-config';
import { useSyncUnsavedSource } from '@/shared/model';
import { useEffect, useMemo, useState } from 'react';

function isTickerConfigEqual(a: TickerConfig, b: TickerConfig) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const useTickerManagement = (kioskId: number) => {
  const { data: config, isLoading: isConfigLoading } =
    useGetTickerConfig(kioskId);
  const { data: defaultConfig } = useGetDefaultTickerConfig();
  const { mutate: upsertConfig, isPending: isUpdating } =
    useUpsertTickerConfig();

  const [localConfig, setLocalConfig] = useState<TickerConfig | null>(null);

  const baselineConfig = useMemo(() => {
    if (config) return config;
    if (defaultConfig) {
      return { ...defaultConfig, kioskId };
    }
    return null;
  }, [config, defaultConfig, kioskId]);

  const isDirty = useMemo(() => {
    if (!localConfig || !baselineConfig) return false;
    return !isTickerConfigEqual(localConfig, baselineConfig);
  }, [localConfig, baselineConfig]);

  useSyncUnsavedSource('ticker', isDirty);

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
