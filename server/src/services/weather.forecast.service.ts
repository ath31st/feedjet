import type { OpenWeatherAPI } from 'openweather-api-node';
import { weatherForecastMapper } from '../mappers/weather.forecast.mapper.js';
import type { WeatherForecast } from '@shared/types/weather.forecast.js';
import { LRUCache } from 'lru-cache';
import { createServiceLogger } from '../utils/pino.logger.js';

export class WeatherForecastService {
  private readonly client: OpenWeatherAPI;
  private readonly logger = createServiceLogger('weatherForecastService');
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

      this.logger.info(
        { mapped, lat, lon, fn: 'getCurrent' },
        'Fetched current weather',
      );
      return mapped;
    } catch (e) {
      this.logger.error(
        { e, lat, lon, fn: 'getCurrent' },
        'Failed fetch current weather',
      );
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

      this.logger.info(
        { mappedData, lat, lon, fn: 'getDailyForecast' },
        'Fetched forecast',
      );
      return mappedData;
    } catch (e) {
      this.logger.error(
        { e, lat, lon, fn: 'getDailyForecast' },
        'Failed fetch forecast',
      );
      return [];
    }
  }
}
