import { publicProcedure, t, weatherForecastService } from '../../container.js';
import { weatherForecastParamsSchema } from '../../validations/schemas/weather.forecast.schemas.js';

export const weatherForecastRouter = t.router({
  getCurrent: publicProcedure
    .input(weatherForecastParamsSchema)
    .query(({ input }) => {
      return weatherForecastService.getCurrent(input.lon, input.lat);
    }),

  getDailyForecast: publicProcedure
    .input(weatherForecastParamsSchema)
    .query(({ input }) => {
      return weatherForecastService.getDailyForecast(input.lon, input.lat);
    }),
});
