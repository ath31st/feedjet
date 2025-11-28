import { useIsXl, isRotate90, useEnv } from '@/shared/lib';
import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';
import {
  useCurrentWeatherForecast,
  useDailyWeatherForecast,
} from '@/entities/weather-forecast';
import { WeatherForecast } from './WeatherForecast';
import { InfoHeader } from './InfoHeader';
import { DigitalClock } from '@/shared/ui';
import { InfoDate } from './InfoDate';
import { useAutoWeatherRefetch } from '../model/useAutoWeatherRefetch';

interface InfoWidgetProps {
  rotate: number;
}

export function InfoWidget({ rotate }: InfoWidgetProps) {
  const { companyName, locationTitle, locationLon, locationLat } = useEnv();
  const {
    data: dailyForecast,
    isLoading: isLoadingDaily,
    refetch: refetchDaily,
  } = useDailyWeatherForecast(locationLat, locationLon);
  const {
    data: currentWeather,
    isLoading: isLoadingCurrent,
    refetch: refetchCurrent,
  } = useCurrentWeatherForecast(locationLat, locationLon);
  const isXl = useIsXl();
  const isEffectiveXl = isRotate90(rotate) ? !isXl : isXl;
  const fonstXlSize = 9;

  useAutoWeatherRefetch({
    refetchDaily,
    refetchCurrent,
  });

  if (isLoadingDaily || isLoadingCurrent) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingThreeDotsJumping />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <InfoHeader isEffectiveXl={isEffectiveXl} title={companyName} />

      <div className="mt-6 w-full border-2 border-[var(--border)]"></div>

      <div className="flex w-full flex-1">
        {isEffectiveXl ? (
          <div className="flex h-full w-full flex-row px-12">
            <div className="flex w-2/5 flex-col py-10">
              <InfoDate date={new Date()} />
              <DigitalClock fontXlSize={fonstXlSize} />
            </div>

            <div className="mr-10 h-full border-2 border-[var(--border)]"></div>

            <WeatherForecast
              locationTitle={locationTitle}
              dailyForecast={dailyForecast ?? []}
              currentWeather={currentWeather ?? null}
              isLoadingDaily={isLoadingDaily}
              isLoadingCurrent={isLoadingCurrent}
            />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col px-4 py-10">
            <InfoDate date={new Date()} />
            <DigitalClock fontXlSize={fonstXlSize} />

            <div className="mb-10 w-full border-2 border-[var(--border)]"></div>

            <WeatherForecast
              locationTitle={locationTitle}
              dailyForecast={dailyForecast ?? []}
              currentWeather={currentWeather ?? null}
              isLoadingDaily={isLoadingDaily}
              isLoadingCurrent={isLoadingCurrent}
            />
          </div>
        )}
      </div>
    </div>
  );
}
