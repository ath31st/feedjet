import { trpcWithProxy } from '@/shared/api';
import { useQuery } from '@tanstack/react-query';

export const useCurrentWeatherForecast = (lat: number, lon: number) => {
  return useQuery(trpcWithProxy.weather.getCurrent.queryOptions({ lat, lon }));
};

export const useDailyWeatherForecast = (lat: number, lon: number) => {
  return useQuery(
    trpcWithProxy.weather.getDailyForecast.queryOptions({ lat, lon }),
  );
};
