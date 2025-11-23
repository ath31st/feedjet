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
  const fonstXlSize = 9;

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

      <div className="w-full border border-[var(--border)]"></div>

      <div className="flex w-full flex-1">
        {isEffectiveXl ? (
          <div className="flex h-full w-full flex-row gap-4 px-4 py-10">
            <div className="flex flex-1 flex-col">
              <div className="text-center font-semibold text-6xl leading-tight">
                {new Date().toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                <div className="text-5xl text-[var(--meta-text)]">
                  {new Date().toLocaleDateString('ru-RU', { weekday: 'long' })}
                </div>
              </div>

              <DigitalClock fontXlSize={fonstXlSize} />
            </div>

            <div className="h-full border border-[var(--border)]"></div>

            <WeatherForecast
              locationTitle={locationTitle}
              dailyForecast={dailyForecast ?? []}
              currentWeather={currentWeather ?? null}
              isLoadingDaily={isLoadingDaily}
              isLoadingCurrent={isLoadingCurrent}
            />
          </div>
        ) : (
          <div className="flex w-full flex-col gap-4">
            <DigitalClock fontXlSize={fonstXlSize} />
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
