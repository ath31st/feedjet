import { useIsXl, isRotate90, useEnv } from '@/shared/lib';
import {
  useCurrentWeatherForecast,
  useDailyWeatherForecast,
} from '@/entities/weather-forecast';
import { useAppFeaturesStore } from '@/entities/app-features';
import { useBrandingConfigStore } from '@/entities/branding';
import { useAutoWeatherRefetch } from './useAutoWeatherRefetch';

export function useInfoWidget(rotate: number) {
  const organizationName = useBrandingConfigStore(
    (s) => s.config?.organizationName,
  );
  const organizationLogoUrl = useBrandingConfigStore((s) => s.logoUrl);
  const offlineMode = useAppFeaturesStore((s) => s.offlineMode);
  const featuresInitialized = useAppFeaturesStore((s) => s.initialized);
  const { locationTitle, locationLon, locationLat } = useEnv();

  const {
    data: dailyForecast,
    isLoading: isLoadingDaily,
    refetch: refetchDaily,
  } = useDailyWeatherForecast(locationLat, locationLon, !offlineMode);
  const {
    data: currentWeather,
    isLoading: isLoadingCurrent,
    refetch: refetchCurrent,
  } = useCurrentWeatherForecast(locationLat, locationLon, !offlineMode);

  const isXl = useIsXl();
  const isEffectiveXl = isRotate90(rotate) ? !isXl : isXl;
  const fontXlSize = 9;

  useAutoWeatherRefetch({
    refetchDaily,
    refetchCurrent,
    enabled: !offlineMode,
  });

  const isLoading =
    !featuresInitialized ||
    (!offlineMode && (isLoadingDaily || isLoadingCurrent));

  return {
    organizationName,
    organizationLogoUrl,
    offlineMode,
    locationTitle,
    dailyForecast: dailyForecast ?? [],
    currentWeather: currentWeather ?? null,
    isLoadingDaily,
    isLoadingCurrent,
    isEffectiveXl,
    fontXlSize,
    isLoading,
  };
}
