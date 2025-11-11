import { scheduleEventsTable } from '../db/schema.js';
import { eq, gte, lte, and } from 'drizzle-orm';
import type { DbType } from '../container.js';
import type {
  ScheduleEvent,
  NewScheduleEvent,
  UpdateScheduleEvent,
} from '@shared/types/schedule.event.js';
import { ScheduleEventError } from '../errors/schedule.event.error.js';
import { createServiceLogger } from '../utils/pino.logger.js';

export class ScheduleEventService {
  private readonly db: DbType;
  private readonly logger = createServiceLogger('scheduleEventService');

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
        this.logger.warn({ id, fn: 'findById' }, 'Event not found');
        throw new ScheduleEventError(404, 'Event not found');
      }

      return event;
    } catch (err) {
      this.logger.error(
        { err, id, fn: 'findById' },
        'Failed to fetch event by id',
      );
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
      this.logger.error(
        { err, startDate, endDate, fn: 'findByDateRange' },
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
      this.logger.error(
        { err, date, fn: 'findByDate' },
        'Failed to fetch events by date',
      );
      throw new ScheduleEventError(500, 'Failed to fetch events by date');
    }
  }

  create(data: NewScheduleEvent): ScheduleEvent {
    this.logger.debug({ data, fn: 'create' }, 'Creating schedule event');

    try {
      const event = this.db
        .insert(scheduleEventsTable)
        .values(data)
        .returning()
        .get();

      this.logger.info(
        { id: event.id, date: event.date, fn: 'create' },
        'Created schedule event',
      );
      return event;
    } catch (err: unknown) {
      this.logger.error(
        { err, data, fn: 'create' },
        'Failed to create schedule event',
      );
      throw new ScheduleEventError(500, 'Failed to create schedule event');
    }
  }

  update(id: number, data: Partial<UpdateScheduleEvent>): ScheduleEvent {
    this.logger.debug({ id, data, fn: 'update' }, 'Updating schedule event');

    try {
      const updatedEvent = this.db
        .update(scheduleEventsTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(scheduleEventsTable.id, id))
        .returning()
        .get();

      if (!updatedEvent) {
        this.logger.warn(
          { id, data, fn: 'update' },
          'Event not found for update',
        );
        throw new ScheduleEventError(404, 'Event not found');
      }

      this.logger.info(
        { id, date: updatedEvent.date, fn: 'update' },
        'Event updated successfully',
      );
      return updatedEvent;
    } catch (err) {
      this.logger.error(
        { err, data, fn: 'update' },
        'Failed to update schedule event',
      );
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
        this.logger.info({ id, fn: 'delete' }, 'Deleted schedule event');
      } else {
        this.logger.warn(
          { id, fn: 'delete' },
          'Attempted to delete non-existing schedule event',
        );
      }

      return changes;
    } catch (err) {
      this.logger.error(
        { err, id, fn: 'delete' },
        'Failed to delete schedule event',
      );
      throw new ScheduleEventError(500, 'Failed to delete schedule event');
    }
  }
}
