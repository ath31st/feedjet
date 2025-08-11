import type { OpenWeatherAPI } from 'openweather-api-node';
import Logger from '../utils/logger.js';
import { weatherForecastMapper } from '../mappers/weather.forecast.mapper.js';
import type { WeatherForecast } from '@shared/types/weather.forecast.js';
import { LRUCache } from 'lru-cache';

export class WeatherForecastService {
  private readonly client: OpenWeatherAPI;
  private readonly limit = 8;
  private readonly currentCacheTtl = 5 * 60 * 1000;
  private readonly dailyCacheTtl = 30 * 60 * 1000;
  private readonly cacheLimit = 10;

  private currentCache = new LRUCache<string, WeatherForecast>({
    max: this.cacheLimit,
    ttl: this.currentCacheTtl,
  });

  private dailyCache = new LRUCache<string, WeatherForecast[]>({
    max: this.cacheLimit,
    ttl: this.dailyCacheTtl,
  });

  constructor(openWeatherClient: OpenWeatherAPI) {
    this.client = openWeatherClient;
    this.client.setLanguage('ru');
    this.client.setUnits('metric');
  }

  private getCacheKey(lat: number, lon: number) {
    return `${lat}:${lon}`;
  }

  async getCurrent(lat: number, lon: number): Promise<WeatherForecast | null> {
    const key = this.getCacheKey(lat, lon);
    if (this.currentCache.has(key)) {
      return this.currentCache.get(key) ?? null;
    }

    try {
      const data = await this.client.getCurrent({ coordinates: { lat, lon } });

      const mapped = weatherForecastMapper.toWeatherForecast(data);

      this.currentCache.set(key, mapped);

      return mapped;
    } catch (e) {
      Logger.error('Failed fetch current weather', e);
      return null;
    }
  }

  async getDailyForecast(lat: number, lon: number): Promise<WeatherForecast[]> {
    const key = this.getCacheKey(lat, lon);
    if (this.dailyCache.has(key)) {
      return this.dailyCache.get(key) ?? [];
    }

    try {
      const data = await this.client.getForecast(this.limit, {
        coordinates: { lat, lon },
      });

      const mappedData = data.map((item) =>
        weatherForecastMapper.toWeatherForecast(item),
      );

      this.dailyCache.set(key, mappedData);

      return mappedData;
    } catch (e) {
      Logger.error('Failed fetch forecast', e);
      return [];
    }
  }
}
