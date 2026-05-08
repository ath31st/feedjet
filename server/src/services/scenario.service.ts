import type { DbType } from '../container.js';
import {
  scenariosTable,
  scenarioItemsTable,
  imagesTable,
  videosTable,
} from '../db/schema.js';
import { eq, asc, sql } from 'drizzle-orm';
import type {
  Scenario,
  ScenarioItem,
  UpsertScenarioItemInput,
} from '@shared/types/scenario.js';
import { createServiceLogger } from '../utils/pino.logger.js';

export class ScenarioService {
  private readonly db: DbType;
  private readonly logger = createServiceLogger('scenarioService');

  constructor(db: DbType) {
    this.db = db;
  }

  getByKiosk(kioskId: number): Scenario | null {
    const scenario = this.db
      .select()
      .from(scenariosTable)
      .where(eq(scenariosTable.kioskId, kioskId))
      .get();

    if (!scenario) return null;

    const items = this.getItems(scenario.id);
    return { ...scenario, items };
  }

  ensureForKiosk(kioskId: number, name = 'Основной сценарий'): Scenario {
    const existing = this.getByKiosk(kioskId);
    if (existing) return existing;

    const created = this.db
      .insert(scenariosTable)
      .values({ kioskId, name })
      .returning()
      .get();

    const items = this.getItems(created.id);
    return { ...created, items };
  }

  getItems(scenarioId: number): ScenarioItem[] {
    return this.db
      .select({
        id: scenarioItemsTable.id,
        scenarioId: scenarioItemsTable.scenarioId,
        type: scenarioItemsTable.type,
        widgetType: scenarioItemsTable.widgetType,
        imageId: scenarioItemsTable.imageId,
        videoId: scenarioItemsTable.videoId,
        order: scenarioItemsTable.order,
        isActive: scenarioItemsTable.isActive,
        durationSeconds: scenarioItemsTable.durationSeconds,
        imageName: imagesTable.name,
        imageFileName: imagesTable.fileName,
        imageThumbnail: imagesTable.thumbnail,
        imageWidth: imagesTable.width,
        imageHeight: imagesTable.height,
        videoName: videosTable.name,
        videoFileName: videosTable.fileName,
        videoDuration: videosTable.duration,
      })
      .from(scenarioItemsTable)
      .leftJoin(imagesTable, eq(scenarioItemsTable.imageId, imagesTable.id))
      .leftJoin(videosTable, eq(scenarioItemsTable.videoId, videosTable.id))
      .where(eq(scenarioItemsTable.scenarioId, scenarioId))
      .orderBy(asc(scenarioItemsTable.order))
      .all() as ScenarioItem[];
  }

  addItem(scenarioId: number, input: UpsertScenarioItemInput): ScenarioItem {
    this.logger.debug(
      { scenarioId, input, fn: 'addItem' },
      'Adding scenario item',
    );

    const maxOrder =
      this.db
        .select({
          max: sql<number>`COALESCE(MAX(${scenarioItemsTable.order}), -1)`,
        })
        .from(scenarioItemsTable)
        .where(eq(scenarioItemsTable.scenarioId, scenarioId))
        .get()?.max ?? -1;

    const item = this.db
      .insert(scenarioItemsTable)
      .values({
        scenarioId,
        type: input.type,
        widgetType: input.widgetType ?? null,
        imageId: input.imageId ?? null,
        videoId: input.videoId ?? null,
        order: maxOrder + 1,
        isActive: input.isActive,
        durationSeconds: input.durationSeconds ?? 10,
      })
      .returning()
      .get();

    this.touchScenario(scenarioId);
    return item as ScenarioItem;
  }

  updateItem(
    itemId: number,
    patch: Partial<
      Pick<ScenarioItem, 'isActive' | 'durationSeconds' | 'order'>
    >,
  ): void {
    this.logger.debug(
      { itemId, patch, fn: 'updateItem' },
      'Updating scenario item',
    );

    this.db
      .update(scenarioItemsTable)
      .set(patch)
      .where(eq(scenarioItemsTable.id, itemId))
      .run();
  }

  reorderItems(scenarioId: number, orderedIds: number[]): void {
    this.logger.debug(
      { scenarioId, orderedIds, fn: 'reorderItems' },
      'Reordering scenario items',
    );

    this.db.transaction((tx) => {
      orderedIds.forEach((id, index) => {
        tx.update(scenarioItemsTable)
          .set({ order: index })
          .where(eq(scenarioItemsTable.id, id))
          .run();
      });
    });
    this.touchScenario(scenarioId);
  }

  deleteItem(itemId: number): void {
    this.logger.debug({ itemId, fn: 'deleteItem' }, 'Deleting scenario item');

    const item = this.db
      .select({ scenarioId: scenarioItemsTable.scenarioId })
      .from(scenarioItemsTable)
      .where(eq(scenarioItemsTable.id, itemId))
      .get();

    this.db
      .delete(scenarioItemsTable)
      .where(eq(scenarioItemsTable.id, itemId))
      .run();

    if (item) this.touchScenario(item.scenarioId);
  }

  private touchScenario(scenarioId: number): void {
    this.db
      .update(scenariosTable)
      .set({ updatedAt: sql`(unixepoch())` })
      .where(eq(scenariosTable.id, scenarioId))
      .run();
  }
}
