import { trpcWithProxy } from '@/shared/api';
import { useQuery } from '@tanstack/react-query';

export const useCurrentWeatherForecast = (
  lat: number,
  lon: number,
  enabled = true,
) => {
  return useQuery({
    ...trpcWithProxy.weather.getCurrent.queryOptions({ lat, lon }),
    enabled,
  });
};

export const useDailyWeatherForecast = (
  lat: number,
  lon: number,
  enabled = true,
) => {
  return useQuery({
    ...trpcWithProxy.weather.getDailyForecast.queryOptions({ lat, lon }),
    enabled,
  });
};
