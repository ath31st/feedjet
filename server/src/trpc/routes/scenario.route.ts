import { t, scenarioService, eventBus } from '../../container.js';
import { protectedProcedure, publicProcedure } from '../../middleware/auth.js';
import {
  addScenarioItemSchema,
  addScenarioItemsSchema,
  deleteScenarioItemSchema,
  getScenarioByKioskSchema,
  reorderScenarioItemsSchema,
  updateScenarioItemSchema,
} from '../../validations/schemas/scenario.schemas.js';

function emitScenario(kioskId: number) {
  const scenario = scenarioService.ensureForKiosk(kioskId);
  eventBus.emit(`scenario:${kioskId}`, scenario);
}

export const scenarioRouter = t.router({
  getByKiosk: publicProcedure
    .input(getScenarioByKioskSchema)
    .query(({ input }) => {
      return scenarioService.ensureForKiosk(input.kioskId);
    }),

  addItem: protectedProcedure
    .input(addScenarioItemSchema)
    .mutation(({ input }) => {
      const scenario = scenarioService.ensureForKiosk(input.kioskId);

      const item = scenarioService.addItem(scenario.id, input.item);

      emitScenario(input.kioskId);

      return item;
    }),

  addItems: protectedProcedure
    .input(addScenarioItemsSchema)
    .mutation(({ input }) => {
      const scenario = scenarioService.ensureForKiosk(input.kioskId);

      const items = scenarioService.addItems(scenario.id, input.items);

      emitScenario(input.kioskId);

      return items;
    }),

  updateItem: protectedProcedure
    .input(updateScenarioItemSchema)
    .mutation(({ input }) => {
      scenarioService.updateItem(input.itemId, input.patch);

      emitScenario(input.kioskId);

      return { success: true };
    }),

  reorderItems: protectedProcedure
    .input(reorderScenarioItemsSchema)
    .mutation(({ input }) => {
      const scenario = scenarioService.ensureForKiosk(input.kioskId);

      scenarioService.reorderItems(scenario.id, input.orderedIds);

      emitScenario(input.kioskId);

      return { success: true };
    }),

  deleteItem: protectedProcedure
    .input(deleteScenarioItemSchema)
    .mutation(({ input }) => {
      scenarioService.deleteItem(input.itemId);

      emitScenario(input.kioskId);

      return { success: true };
    }),
});
