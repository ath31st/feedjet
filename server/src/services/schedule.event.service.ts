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

  findById(id: number): ScheduleEvent {
    try {
      const event = this.db
        .select()
        .from(scheduleEventsTable)
        .where(eq(scheduleEventsTable.id, id))
        .get();

      if (!event) {
        throw new ScheduleEventError(404, 'Event not found');
      }

      return event;
    } catch (err) {
      Logger.error(err);
      throw new ScheduleEventError(500, 'Failed to fetch event by id');
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
      throw new ScheduleEventError(500, 'Failed to fetch events by date range');
    }
  }

  findByDate(date: string): ScheduleEvent[] {
    try {
      return this.db
        .select()
        .from(scheduleEventsTable)
        .where(eq(scheduleEventsTable.date, date))
        .all();
    } catch (err) {
      Logger.error(err);
      throw new ScheduleEventError(500, 'Failed to fetch events by date');
    }
  }

  create(data: NewScheduleEvent): ScheduleEvent {
    try {
      return this.db.insert(scheduleEventsTable).values(data).returning().get();
    } catch (err: unknown) {
      Logger.error(err);
      throw new ScheduleEventError(500, 'Failed to create schedule event');
    }
  }

  update(id: number, data: Partial<UpdateScheduleEvent>): ScheduleEvent {
    try {
      const updatedEvent = this.db
        .update(scheduleEventsTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(scheduleEventsTable.id, id))
        .returning()
        .get();

      if (!updatedEvent) {
        throw new ScheduleEventError(404, 'Event not found');
      }

      return updatedEvent;
    } catch (err) {
      Logger.error(err);
      throw new ScheduleEventError(500, 'Failed to update schedule event');
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
      throw new ScheduleEventError(500, 'Failed to delete schedule event');
    }
  }
}
