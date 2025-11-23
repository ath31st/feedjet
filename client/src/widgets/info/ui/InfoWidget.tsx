import { useIsXl, isRotate90 } from '@/shared/lib';
import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';
import {
  useCurrentWeatherForecast,
  useDailyWeatherForecast,
} from '@/entities/weather-forecast';
import { WeatherForecast } from '@/widgets/schedule/ui/WeatherForecast';
import { DigitalClock } from '@/widgets/schedule/ui/DigitalClock';
import { useScheduleEnv } from '@/widgets/schedule/model/useScheduleWidgetEnv';
import { ScheduleHeader } from '@/widgets/schedule/ui/ScheduleHeader';

interface InfoWidgetProps {
  rotate: number;
}

export function InfoWidget({ rotate }: InfoWidgetProps) {
  const {
    scheduleHeaderTitle,
    scheduleLocationTitle,
    scheduleLocationLon,
    scheduleLocationLat,
  } = useScheduleEnv();
  const {
    data: dailyForecast,
    isLoading: isLoadingDaily,
    refetch: refetchDaily,
  } = useDailyWeatherForecast(scheduleLocationLat, scheduleLocationLon);
  const {
    data: currentWeather,
    isLoading: isLoadingCurrent,
    refetch: refetchCurrent,
  } = useCurrentWeatherForecast(scheduleLocationLat, scheduleLocationLon);
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
      <ScheduleHeader
        isEffectiveXl={isEffectiveXl}
        title={scheduleHeaderTitle}
      />

      <div
        className="mx-auto flex w-full flex-1 border-t-2"
        style={{ borderColor: 'var(--border)' }}
      >
        {isEffectiveXl && (
          <>
            <div className="h-full border border-[var(--border)]" />
            <div className="flex h-full w-1/2 flex-col gap-4 px-4 py-10">
              <DigitalClock />
              <WeatherForecast
                locationTitle={scheduleLocationTitle}
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
          <DigitalClock />
          <WeatherForecast
            locationTitle={scheduleLocationTitle}
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
