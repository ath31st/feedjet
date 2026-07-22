import { t } from '../../container.js';
import { offlineMode } from '../../config/config.js';
import { publicProcedure } from '../../middleware/auth.js';

export const appFeaturesRouter = t.router({
  getFeatures: publicProcedure.query(() => ({
    offlineMode,
  })),
});
