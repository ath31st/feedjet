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
        <div className="text-center text-5xl">
          Погода в {locationTitle || 'Lorem ipsum'}
        </div>
        <div className="flex h-full flex-row items-center">
          <img
            src={currentWeather.iconUrl}
            alt={currentWeather.description}
            className="h-40 w-40"
          />
          <div className="font-semibold text-8xl text-[var(--card-text)]">
            {Math.round(currentWeather.temperature)}°C
          </div>
        </div>

        <div className="flex h-full flex-col justify-center gap-2 text-2xl">
          <div>Ощущается как {Math.round(currentWeather.feelsLike)}°C</div>
          <div>Влажность: {currentWeather.humidity}%</div>
          <div>Давление: {currentWeather.pressure} мм рт. ст.</div>
        </div>
      </div>

      <div className="flex h-full flex-col justify-center text-4xl text-[var(--card-text)]">
        {dailyForecast
          .slice(0, 6)
          .map(({ time, temperature, iconUrl, description }) => (
            <div key={time} className="flex h-full gap-9">
              <span className="w-26">{time}</span>
              <img src={iconUrl} alt={description} className="h-10 w-10" />
              <span>{Math.round(temperature)}°C</span>
            </div>
          ))}
      </div>
    </div>
  );
}
