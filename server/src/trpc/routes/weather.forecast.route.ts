import { t, weatherForecastClient } from '../../container.js';
import { publicProcedure } from '../../middleware/auth.js';
import { weatherForecastParamsSchema } from '../../validations/schemas/weather.forecast.schemas.js';

export const weatherForecastRouter = t.router({
  getCurrent: publicProcedure
    .input(weatherForecastParamsSchema)
    .query(({ input }) => {
      return weatherForecastClient.getCurrent(input.lat, input.lon);
    }),

  getDailyForecast: publicProcedure
    .input(weatherForecastParamsSchema)
    .query(({ input }) => {
      return weatherForecastClient.getDailyForecast(input.lat, input.lon);
    }),
});
