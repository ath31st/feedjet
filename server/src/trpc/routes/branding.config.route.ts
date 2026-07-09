import { t, eventBus, brandingConfigService } from '../../container.js';
import { protectedProcedure, publicProcedure } from '../../middleware/auth.js';
import {
  brandingConfigGetInputSchema,
  brandingConfigUpdateInputSchema,
} from '../../validations/schemas/branding.config.schemas.js';
import { handleServiceCall } from '../error.handler.js';

export const brandingConfigRouter = t.router({
  getCurrentConfig: publicProcedure.query(() =>
    handleServiceCall(() => {
      return brandingConfigService.findCurrentConfig();
    }),
  ),

  createDefaultConfig: publicProcedure.mutation(() =>
    handleServiceCall(() => {
      return brandingConfigService.createDefaultConfig();
    }),
  ),

  getConfig: publicProcedure
    .input(brandingConfigGetInputSchema)
    .query(({ input }) =>
      handleServiceCall(() => {
        return brandingConfigService.getConfig(input.brandingConfigId);
      }),
    ),

  update: protectedProcedure
    .input(brandingConfigUpdateInputSchema)
    .mutation(({ input }) =>
      handleServiceCall(() => {
        const updated = brandingConfigService.update(
          input.brandingConfigId,
          input.data,
        );
        // TODO когда появятся организации надо будет здесь сделать рассылку по организации
        //eventBus.emit(`branding-config:${updated.organizationId}`, updated);
        return updated;
      }),
    ),
});
