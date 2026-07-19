import type { OpenWeatherAPI } from 'openweather-api-node';
import { weatherForecastMapper } from '../mappers/weather.forecast.mapper.js';
import type { WeatherForecast } from '@shared/types/weather.forecast.js';
import { LRUCache } from 'lru-cache';
import { createServiceLogger } from '../utils/pino.logger.js';
import { isErrorWithMessage } from '../utils/is.error.with.message.js';

export class WeatherForecastClient {
  private readonly client: OpenWeatherAPI;
  private readonly logger = createServiceLogger('weatherForecastClient');
  private readonly limit = 8;
  private readonly currentCacheTtl = 5 * 60 * 1000;
  private readonly dailyCacheTtl = 30 * 60 * 1000;
  private readonly cacheLimit = 10;
  private readonly requestTimeoutMs = 3000;

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

  private getCacheKey(lat: number, lon: number): string {
    return `${lat}:${lon}`;
  }

  private async withTimeout<T>(promise: Promise<T>): Promise<T> {
    let timeoutId: NodeJS.Timeout | undefined;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('TIMEOUT'));
      }, this.requestTimeoutMs);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  async getCurrent(lat: number, lon: number): Promise<WeatherForecast | null> {
    const key = this.getCacheKey(lat, lon);

    if (this.currentCache.has(key)) {
      return this.currentCache.get(key) ?? null;
    }

    try {
      const apiCall = this.client.getCurrent({ coordinates: { lat, lon } });
      const data = await this.withTimeout(apiCall);

      const mapped = weatherForecastMapper.toWeatherForecast(data);
      this.currentCache.set(key, mapped);

      this.logger.debug(
        { lat, lon, fn: 'getCurrent' },
        'Fetched current weather',
      );
      return mapped;
    } catch (err: unknown) {
      const isTimeout = isErrorWithMessage(err) && err.message === 'TIMEOUT';

      this.logger.error(
        { err, lat, lon, fn: 'getCurrent', isTimeout },
        isTimeout
          ? `Weather request timed out (${this.requestTimeoutMs / 1000}s)`
          : 'Failed fetch current weather',
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
      const apiCall = this.client.getForecast(this.limit, {
        coordinates: { lat, lon },
      });
      const data = await this.withTimeout(apiCall);

      const mappedData = data.map((item) =>
        weatherForecastMapper.toWeatherForecast(item),
      );

      this.dailyCache.set(key, mappedData);

      this.logger.debug(
        { lat, lon, count: mappedData.length, fn: 'getDailyForecast' },
        'Fetched forecast',
      );
      return mappedData;
    } catch (err: unknown) {
      const isTimeout = isErrorWithMessage(err) && err.message === 'TIMEOUT';

      this.logger.error(
        { err, lat, lon, fn: 'getDailyForecast', isTimeout },
        isTimeout ? 'Forecast request timed out (5s)' : 'Failed fetch forecast',
      );
      return [];
    }
  }
}
