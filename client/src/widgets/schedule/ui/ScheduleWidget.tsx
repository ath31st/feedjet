import { hours } from '@/shared/constant';
import {
  formatDateToMap,
  getDaysOfWeekByDate,
  getPositionPercentByDateTime,
  useIsXl,
  isRotate90,
} from '@/shared/lib';
import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';
import { ScheduleHeader } from './ScheduleHeader';
import { DaysColumn } from './DaysColumn';
import { TimeGrid } from './TimeGrid';
import { EventsList } from './EventsList';
import { useScheduleWithTimer } from '../model/useScheduleWithTimer';
import { useScheduleEnv } from '../model/useScheduleWidgetEnv';
import { DigitalClock } from './DigitalClock';
import { WeatherForecast } from './WeatherForecast';
import {
  useCurrentWeatherForecast,
  useDailyWeatherForecast,
} from '@/entities/weather-forecast';

interface ScheduleWidgetProps {
  rotate: number;
}

export function ScheduleWidget({ rotate }: ScheduleWidgetProps) {
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
  const { now, events, isLoading } = useScheduleWithTimer({
    refetchCurrent,
    refetchDaily,
  });
  const daysOfWeek = getDaysOfWeekByDate(now);
  const startHour = parseInt(hours[0], 10);
  const formatedDaysOfWeek = daysOfWeek.map(formatDateToMap);
  const todayIndex = daysOfWeek.findIndex((d) => d.getDate() === now.getDate());
  const positionPercent = getPositionPercentByDateTime(
    now,
    startHour,
    hours.length,
  );
  const isXl = useIsXl();
  const isEffectiveXl = isRotate90(rotate) ? !isXl : isXl;
  const effectiveSpeed = isRotate90(rotate) ? 1 : 50;

  if (isLoading) {
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
        <DaysColumn
          days={formatedDaysOfWeek}
          todayIndex={todayIndex}
          isEffectiveXl={isEffectiveXl}
        />
        <div className="h-full border border-[var(--border)]" />
        <div className={`w-full ${isEffectiveXl ? 'px-10 py-4' : 'p-12 py-8'}`}>
          <div className="relative h-full">
            <TimeGrid hours={hours} positionPercent={positionPercent} />
            <EventsList
              events={events ?? []}
              isEffectiveXl={isEffectiveXl}
              hoursStart={startHour}
              hoursCount={hours.length}
              effectiveSpeed={effectiveSpeed}
            />
          </div>
        </div>
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
