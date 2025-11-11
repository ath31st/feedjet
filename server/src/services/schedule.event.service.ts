import { scheduleEventsTable } from '../db/schema.js';
import { eq, gte, lte, and } from 'drizzle-orm';
import type { DbType } from '../container.js';
import type {
  ScheduleEvent,
  NewScheduleEvent,
  UpdateScheduleEvent,
} from '@shared/types/schedule.event.js';
import { ScheduleEventError } from '../errors/schedule.event.error.js';
import logger from '../utils/pino.logger.js';

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
        logger.warn({ id }, 'Event not found');
        throw new ScheduleEventError(404, 'Event not found');
      }

      return event;
    } catch (err) {
      logger.error({ err, id }, 'Failed to fetch event by id');
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
      logger.error(
        { err, startDate, endDate },
        'Failed to fetch events by date range',
      );
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
      logger.error({ err, date }, 'Failed to fetch events by date');
      throw new ScheduleEventError(500, 'Failed to fetch events by date');
    }
  }

  create(data: NewScheduleEvent): ScheduleEvent {
    logger.debug({ data }, 'Creating schedule event');

    try {
      const event = this.db
        .insert(scheduleEventsTable)
        .values(data)
        .returning()
        .get();

      logger.info({ id: event.id, date: event.date }, 'Created schedule event');
      return event;
    } catch (err: unknown) {
      logger.error({ err, data }, 'Failed to create schedule event');
      throw new ScheduleEventError(500, 'Failed to create schedule event');
    }
  }

  update(id: number, data: Partial<UpdateScheduleEvent>): ScheduleEvent {
    logger.debug({ id, data }, 'Updating schedule event');

    try {
      const updatedEvent = this.db
        .update(scheduleEventsTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(scheduleEventsTable.id, id))
        .returning()
        .get();

      if (!updatedEvent) {
        logger.warn({ id, data }, 'Event not found for update');
        throw new ScheduleEventError(404, 'Event not found');
      }

      logger.info(
        { id, date: updatedEvent.date },
        'Event updated successfully',
      );
      return updatedEvent;
    } catch (err) {
      logger.error({ err, data }, 'Failed to update schedule event');
      throw new ScheduleEventError(500, 'Failed to update schedule event');
    }
  }

  delete(id: number): number {
    try {
      const changes = this.db
        .delete(scheduleEventsTable)
        .where(eq(scheduleEventsTable.id, id))
        .run().changes;

      if (changes > 0) {
        logger.info({ id }, 'Deleted schedule event');
      } else {
        logger.warn({ id }, 'Attempted to delete non-existing schedule event');
      }

      return changes;
    } catch (err) {
      logger.error({ err, id }, 'Failed to delete schedule event');
      throw new ScheduleEventError(500, 'Failed to delete schedule event');
    }
  }
}
