import { useIsXl, isRotate90, useEnv } from '@/shared/lib';
import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';
import {
  useCurrentWeatherForecast,
  useDailyWeatherForecast,
} from '@/entities/weather-forecast';
import { WeatherForecast } from './WeatherForecast';
import { InfoHeader } from './InfoHeader';
import { DigitalClock } from '@/shared/ui';

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

      <div
        className="mx-auto flex w-full flex-1 border-t-2"
        style={{ borderColor: 'var(--border)' }}
      >
        {isEffectiveXl && (
          <>
            <div className="h-full border border-[var(--border)]" />
            <div className="flex h-full w-1/2 flex-col gap-4 px-4 py-10">
              <DigitalClock fontXlSize={8} />
              <WeatherForecast
                locationTitle={locationTitle}
                dailyForecast={dailyForecast ?? []}
                currentWeather={currentWeather ?? null}
                isLoadingDaily={isLoadingDaily}
                isLoadingCurrent={isLoadingCurrent}
              />
            </div>
          </>
        )}
      </div>

      {!isEffectiveXl && (
        <div className="flex h-1/7 flex-row gap-4 border-[var(--border)] border-t-2 px-4">
          <DigitalClock fontXlSize={8} />
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
  );
}
