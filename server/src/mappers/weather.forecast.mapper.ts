import type { WeatherForecast } from '@shared/types/weather.forecast.js';
import type { CurrentWeather, ForecastWeather } from 'openweather-api-node';

export const weatherForecastMapper = {
  toWeatherForecast: (
    forecast: ForecastWeather | CurrentWeather,
  ): WeatherForecast => {
    return {
      time: forecast.dt,
      icon: forecast.weather.icon.raw,
      iconUrl: forecast.weather.icon.url,
      temperature: forecast.weather.temp.cur,
      feelsLike: forecast.weather.feelsLike.cur,
      description: forecast.weather.description,
      humidity: forecast.weather.humidity,
      pressure: forecast.weather.pressure,
    };
  },
};
