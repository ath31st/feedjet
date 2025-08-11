import { trpcWithProxy } from '@/shared/api/trpc';
import { useQuery } from '@tanstack/react-query';

export const useCurrentWeatherForecast = (lon: number, lat: number) => {
  return useQuery(trpcWithProxy.weather.getCurrent.queryOptions({ lon, lat }));
};

export const useDailyWeatherForecast = (lon: number, lat: number) => {
  return useQuery(
    trpcWithProxy.weather.getDailyForecast.queryOptions({ lon, lat }),
  );
};
