import type { WeatherForecast as Forecast } from '@/entities/weather-forecast';
import { LoadingThreeDotsJumping } from '@/shared/ui/LoadingThreeDotsJumping';

interface WeatherForecastProps {
  locationTitle?: string;
  dailyForecast: Forecast[];
  currentWeather: Forecast | null;
  isLoadingDaily: boolean;
  isLoadingCurrent: boolean;
}

export function WeatherForecast({
  locationTitle,
  dailyForecast,
  currentWeather,
  isLoadingDaily,
  isLoadingCurrent,
}: WeatherForecastProps) {
  const isLoading = isLoadingDaily || isLoadingCurrent;

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <LoadingThreeDotsJumping />
      </div>
    );
  }

  if (!currentWeather || !dailyForecast.length) {
    return (
      <div className="flex h-full flex-1 items-center justify-center text-[var(--meta-text)]">
        Нет данных о погоде
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 gap-10 px-4 py-4">
      <div className="flex h-full w-1/2 flex-col items-center justify-center gap-2 text-[var(--meta-text)]">
        <div className="text-center text-3xl">
          Погода в {locationTitle || 'Lorem ipsum'}
        </div>
        <div className="flex h-full flex-row items-center">
          <img
            src={currentWeather.iconUrl}
            alt={currentWeather.description}
            className="h-20 w-20"
          />
          <div className="font-semibold text-4xl text-[var(--card-text)]">
            {Math.round(currentWeather.temperature)}°C
          </div>
        </div>

        <div className="flex h-full flex-col justify-center gap-2 text-xl">
          <div>Ощущается как {Math.round(currentWeather.feelsLike)}°C</div>
          <div>Влажность: {currentWeather.humidity}%</div>
          {/* <div>Давление: {currentWeather.pressure} мм рт. ст.</div> */}
        </div>
      </div>

      <div className="flex h-full flex-col justify-center text-[var(--card-text)] text-xl">
        {dailyForecast
          .slice(0, 6)
          .map(({ time, temperature, iconUrl, description }) => (
            <div key={time} className="flex h-full gap-6">
              <span className="w-16">{time}</span>
              <img src={iconUrl} alt={description} className="h-8 w-8" />
              <span>{Math.round(temperature)}°C</span>
            </div>
          ))}
      </div>
    </div>
  );
}
