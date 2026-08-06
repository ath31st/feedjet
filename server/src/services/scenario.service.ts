import type { DbType } from '../container.js';
import {
  scenariosTable,
  scenarioItemsTable,
  imagesTable,
  videosTable,
  pdfsTable,
} from '../db/schema.js';
import { eq, asc, inArray, sql } from 'drizzle-orm';
import type {
  Scenario,
  ScenarioItem,
  UpsertScenarioItemInput,
  ReplaceScenarioItemInput,
} from '@shared/types/scenario.js';
import { createServiceLogger } from '../utils/pino.logger.js';

function toDbItemFields(item: ReplaceScenarioItemInput) {
  if (item.type === 'widget') {
    return {
      type: item.type,
      widgetType: item.widgetType,
      imageId: null,
      videoId: null,
      pdfId: null,
    };
  }

  if (item.type === 'image') {
    return {
      type: item.type,
      widgetType: null,
      imageId: item.imageId,
      videoId: null,
      pdfId: null,
    };
  }

  if (item.type === 'video') {
    return {
      type: item.type,
      widgetType: null,
      imageId: null,
      videoId: item.videoId,
      pdfId: null,
    };
  }

  return {
    type: item.type,
    widgetType: null,
    imageId: null,
    videoId: null,
    pdfId: item.pdfId,
  };
}

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

    this.logger.info(
      { scenarioId: created.id, kioskId, fn: 'ensureForKiosk' },
      'Created scenario for kiosk',
    );

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
        pdfId: scenarioItemsTable.pdfId,
        order: scenarioItemsTable.order,
        isActive: scenarioItemsTable.isActive,
        durationSeconds: scenarioItemsTable.durationSeconds,
        activeFrom: scenarioItemsTable.activeFrom,
        activeTo: scenarioItemsTable.activeTo,
        imageName: imagesTable.name,
        imageFileName: imagesTable.fileName,
        imageThumbnail: imagesTable.thumbnail,
        imageWidth: imagesTable.width,
        imageHeight: imagesTable.height,
        videoName: videosTable.name,
        videoFileName: videosTable.fileName,
        videoThumbnail: videosTable.thumbnail,
        videoDuration: videosTable.duration,
        pdfName: pdfsTable.name,
        pdfFileName: pdfsTable.fileName,
        pdfThumbnail: pdfsTable.thumbnail,
        pdfPageCount: pdfsTable.pageCount,
      })
      .from(scenarioItemsTable)
      .leftJoin(imagesTable, eq(scenarioItemsTable.imageId, imagesTable.id))
      .leftJoin(videosTable, eq(scenarioItemsTable.videoId, videosTable.id))
      .leftJoin(pdfsTable, eq(scenarioItemsTable.pdfId, pdfsTable.id))
      .where(eq(scenarioItemsTable.scenarioId, scenarioId))
      .orderBy(asc(scenarioItemsTable.order))
      .all() as ScenarioItem[];
  }

  addItem(scenarioId: number, input: UpsertScenarioItemInput): ScenarioItem {
    this.logger.debug(
      { scenarioId, type: input.type, fn: 'addItem' },
      'Adding scenario item',
    );

    try {
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
          pdfId: input.pdfId ?? null,
          order: maxOrder + 1,
          isActive: input.isActive,
          durationSeconds: input.durationSeconds ?? 10,
          activeFrom: input.activeFrom ?? null,
          activeTo: input.activeTo ?? null,
        })
        .returning()
        .get();

      this.touchScenario(scenarioId);

      this.logger.info(
        { scenarioId, itemId: item.id, type: input.type, fn: 'addItem' },
        'Added scenario item',
      );
      return item as ScenarioItem;
    } catch (err) {
      this.logger.error(
        { err, scenarioId, fn: 'addItem' },
        'Failed to add scenario item',
      );
      throw err;
    }
  }

  addItems(
    scenarioId: number,
    input: UpsertScenarioItemInput[],
  ): ScenarioItem[] {
    this.logger.debug(
      { scenarioId, count: input.length, fn: 'addItems' },
      'Adding scenario items',
    );

    try {
      const maxOrder =
        this.db
          .select({
            max: sql<number>`COALESCE(MAX(${scenarioItemsTable.order}), -1)`,
          })
          .from(scenarioItemsTable)
          .where(eq(scenarioItemsTable.scenarioId, scenarioId))
          .get()?.max ?? -1;

      const values = input.map((item, index) => ({
        scenarioId,
        type: item.type,
        widgetType: item.widgetType ?? null,
        imageId: item.imageId ?? null,
        videoId: item.videoId ?? null,
        pdfId: item.pdfId ?? null,
        order: maxOrder + index + 1,
        isActive: item.isActive,
        durationSeconds: item.durationSeconds ?? 10,
        activeFrom: item.activeFrom ?? null,
        activeTo: item.activeTo ?? null,
      }));

      const items = this.db
        .insert(scenarioItemsTable)
        .values(values)
        .returning()
        .all();

      this.touchScenario(scenarioId);

      this.logger.info(
        { scenarioId, count: items.length, fn: 'addItems' },
        'Added scenario items',
      );
      return items as ScenarioItem[];
    } catch (err) {
      this.logger.error(
        { err, scenarioId, count: input.length, fn: 'addItems' },
        'Failed to add scenario items',
      );
      throw err;
    }
  }

  updateItem(
    itemId: number,
    patch: Partial<
      Pick<
        ScenarioItem,
        'isActive' | 'durationSeconds' | 'order' | 'activeFrom' | 'activeTo'
      >
    >,
  ): void {
    this.logger.debug(
      { itemId, fields: Object.keys(patch), fn: 'updateItem' },
      'Updating scenario item',
    );

    try {
      this.db
        .update(scenarioItemsTable)
        .set(patch)
        .where(eq(scenarioItemsTable.id, itemId))
        .run();

      this.logger.info({ itemId, fn: 'updateItem' }, 'Updated scenario item');
    } catch (err) {
      this.logger.error(
        { err, itemId, fn: 'updateItem' },
        'Failed to update scenario item',
      );
      throw err;
    }
  }

  reorderItems(scenarioId: number, orderedIds: number[]): void {
    this.logger.debug(
      { scenarioId, count: orderedIds.length, fn: 'reorderItems' },
      'Reordering scenario items',
    );

    try {
      this.db.transaction((tx) => {
        orderedIds.forEach((id, index) => {
          tx.update(scenarioItemsTable)
            .set({ order: index })
            .where(eq(scenarioItemsTable.id, id))
            .run();
        });
      });
      this.touchScenario(scenarioId);

      this.logger.info(
        { scenarioId, count: orderedIds.length, fn: 'reorderItems' },
        'Reordered scenario items',
      );
    } catch (err) {
      this.logger.error(
        { err, scenarioId, fn: 'reorderItems' },
        'Failed to reorder scenario items',
      );
      throw err;
    }
  }

  deleteItem(itemId: number): void {
    this.logger.debug({ itemId, fn: 'deleteItem' }, 'Deleting scenario item');

    try {
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

      this.logger.info(
        { itemId, scenarioId: item?.scenarioId, fn: 'deleteItem' },
        'Deleted scenario item',
      );
    } catch (err) {
      this.logger.error(
        { err, itemId, fn: 'deleteItem' },
        'Failed to delete scenario item',
      );
      throw err;
    }
  }

  replaceItems(
    scenarioId: number,
    items: ReplaceScenarioItemInput[],
  ): ScenarioItem[] {
    this.logger.debug(
      { scenarioId, count: items.length, fn: 'replaceItems' },
      'Replacing scenario items',
    );

    try {
      this.db.transaction((tx) => {
        const existing = tx
          .select({ id: scenarioItemsTable.id })
          .from(scenarioItemsTable)
          .where(eq(scenarioItemsTable.scenarioId, scenarioId))
          .all();
        const existingIds = new Set(existing.map((row) => row.id));

        const updates: {
          id: number;
          item: ReplaceScenarioItemInput;
          order: number;
        }[] = [];
        const inserts: { item: ReplaceScenarioItemInput; order: number }[] =
          [];

        items.forEach((item, order) => {
          if (item.id != null && existingIds.has(item.id)) {
            updates.push({ id: item.id, item, order });
          } else {
            inserts.push({ item, order });
          }
        });

        const keepIds = new Set(updates.map(({ id }) => id));
        const toDelete = existing
          .map((row) => row.id)
          .filter((id) => !keepIds.has(id));

        if (toDelete.length > 0) {
          tx.delete(scenarioItemsTable)
            .where(inArray(scenarioItemsTable.id, toDelete))
            .run();
        }

        for (const { id, item, order } of updates) {
          tx.update(scenarioItemsTable)
            .set({
              ...toDbItemFields(item),
              order,
              isActive: item.isActive,
              durationSeconds: item.durationSeconds ?? 10,
              activeFrom: item.activeFrom ?? null,
              activeTo: item.activeTo ?? null,
            })
            .where(eq(scenarioItemsTable.id, id))
            .run();
        }

        for (const { item, order } of inserts) {
          tx.insert(scenarioItemsTable)
            .values({
              scenarioId,
              ...toDbItemFields(item),
              order,
              isActive: item.isActive,
              durationSeconds: item.durationSeconds ?? 10,
              activeFrom: item.activeFrom ?? null,
              activeTo: item.activeTo ?? null,
            })
            .run();
        }
      });

      this.touchScenario(scenarioId);

      this.logger.info(
        { scenarioId, count: items.length, fn: 'replaceItems' },
        'Replaced scenario items',
      );

      return this.getItems(scenarioId);
    } catch (err) {
      this.logger.error(
        { err, scenarioId, fn: 'replaceItems' },
        'Failed to replace scenario items',
      );
      throw err;
    }
  }

  private touchScenario(scenarioId: number): void {
    this.db
      .update(scenariosTable)
      .set({ updatedAt: sql`(unixepoch())` })
      .where(eq(scenariosTable.id, scenarioId))
      .run();
  }
}
