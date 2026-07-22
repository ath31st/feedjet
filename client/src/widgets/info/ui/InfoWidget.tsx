import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';
import { WeatherForecast } from './WeatherForecast';
import { MonthCalendar } from './MonthCalendar';
import { InfoHeader } from './InfoHeader';
import { DigitalClock } from '@/shared/ui';
import { InfoDate } from './InfoDate';
import { useInfoWidget } from '../model/useInfoWidget';

interface InfoWidgetProps {
  rotate: number;
}

export function InfoWidget({ rotate }: InfoWidgetProps) {
  const {
    organizationName,
    organizationLogoUrl,
    offlineMode,
    locationTitle,
    dailyForecast,
    currentWeather,
    isLoadingDaily,
    isLoadingCurrent,
    isEffectiveXl,
    fontXlSize,
    isLoading,
  } = useInfoWidget(rotate);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingThreeDotsJumping />
      </div>
    );
  }

  const sidePanel = offlineMode ? (
    <MonthCalendar isEffectiveXl={isEffectiveXl} />
  ) : (
    <WeatherForecast
      locationTitle={locationTitle}
      dailyForecast={dailyForecast}
      currentWeather={currentWeather}
      isLoadingDaily={isLoadingDaily}
      isLoadingCurrent={isLoadingCurrent}
    />
  );

  return (
    <div className="flex h-full w-full flex-col">
      <InfoHeader
        isEffectiveXl={isEffectiveXl}
        title={organizationName}
        logoUrl={organizationLogoUrl}
      />

      <div className="mt-6 w-full border-(--border) border-2"></div>

      <div className="flex w-full flex-1">
        {isEffectiveXl ? (
          <div className="flex h-full w-full flex-row px-12">
            <div className="flex w-2/5 flex-col py-10">
              <InfoDate date={new Date()} />
              <DigitalClock fontXlSize={fontXlSize} />
            </div>

            <div className="mr-10 h-full border-(--border) border-2"></div>

            {sidePanel}
          </div>
        ) : (
          <div className="flex h-full w-full flex-col px-4 py-10">
            <InfoDate date={new Date()} />
            <DigitalClock fontXlSize={fontXlSize} />

            <div className="mb-10 w-full border-(--border) border-2"></div>

            {sidePanel}
          </div>
        )}
      </div>
    </div>
  );
}
