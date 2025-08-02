import { scheduleEventsTable } from '../db/schema.js';
import { eq, gte, lte, and } from 'drizzle-orm';
import type { DbType } from '../container.js';
import type {
  ScheduleEvent,
  NewScheduleEvent,
  UpdateScheduleEvent,
} from '@shared/types/schedule.event.js';
import { ScheduleEventError } from '../errors/schedule.event.error.js';
import Logger from '../utils/logger.js';

export class ScheduleEventService {
  private readonly db: DbType;

  constructor(db: DbType) {
    this.db = db;
  }

  findById(id: number): ScheduleEvent | undefined {
    try {
      return this.db
        .select()
        .from(scheduleEventsTable)
        .where(eq(scheduleEventsTable.id, id))
        .get();
    } catch (err) {
      Logger.error(err);
      throw new ScheduleEventError('Failed to fetch event by id');
    }
  }

  findByDateRange(startDate: string, endDate: string): ScheduleEvent[] {
    try {
      return this.db
        .select()
        .from(scheduleEventsTable)
        .where(
          and(
            gte(scheduleEventsTable.date, startDate),
            lte(scheduleEventsTable.date, endDate),
          ),
        )
        .all();
    } catch (err) {
      Logger.error(err);
      throw new ScheduleEventError('Failed to fetch events by date range');
    }
  }

  create(data: NewScheduleEvent): ScheduleEvent {
    try {
      return this.db.insert(scheduleEventsTable).values(data).returning().get();
    } catch (err: unknown) {
      Logger.error(err);
      throw new ScheduleEventError('Failed to create schedule event');
    }
  }

  update(
    id: number,
    data: Partial<UpdateScheduleEvent>,
  ): ScheduleEvent | undefined {
    try {
      return this.db
        .update(scheduleEventsTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(scheduleEventsTable.id, id))
        .returning()
        .get();
    } catch (err) {
      Logger.error(err);
      throw new ScheduleEventError('Failed to update schedule event');
    }
  }

  delete(id: number): number {
    try {
      return this.db
        .delete(scheduleEventsTable)
        .where(eq(scheduleEventsTable.id, id))
        .run().changes;
    } catch (err) {
      Logger.error(err);
      throw new ScheduleEventError('Failed to delete schedule event');
    }
  }
}
