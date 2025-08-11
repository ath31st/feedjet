import type { OpenWeatherAPI } from 'openweather-api-node';
import Logger from '../utils/logger.js';
import { weatherForecastMapper } from '../mappers/weather.forecast.mapper.js';
import type { WeatherForecast } from '@shared/types/weather.forecast.js';

export class WeatherForecastService {
  private readonly client: OpenWeatherAPI;

  constructor(openWeatherClient: OpenWeatherAPI) {
    this.client = openWeatherClient;
    this.client.setLanguage('ru');
    this.client.setUnits('metric');
  }

  async getCurrent(lat: number, lon: number): Promise<WeatherForecast | null> {
    this.client.setLocationByCoordinates(lat, lon);
    try {
      const data = await this.client.getCurrent();
      return weatherForecastMapper.toWeatherForecast(data);
    } catch (e) {
      Logger.error('Failed fetch current weather', e);
      return null;
    }
  }

  async getDailyForecast(lat: number, lon: number): Promise<WeatherForecast[]> {
    this.client.setLocationByCoordinates(lat, lon);
    try {
      const data = await this.client.getForecast();
      const dailyData = data.slice(0, 8);

      return dailyData.map((item) =>
        weatherForecastMapper.toWeatherForecast(item),
      );
    } catch (e) {
      Logger.error('Failed fetch forecast', e);
      return [];
    }
  }
}
