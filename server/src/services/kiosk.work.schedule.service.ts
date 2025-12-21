import type {
  DayOfWeek,
  KioskWorkSchedule,
  UpdateKioskWorkSchedule,
} from '@shared/types/kiosk.work.schedule.js';
import type { DbType } from '../container.js';
import { kioskWorkScheduleTable } from '../db/schema.js';
import { eq, and, or } from 'drizzle-orm';
import { KioskWorkScheduleError } from '../errors/kiosk.work.schedule.error.js';
import { createServiceLogger } from '../utils/pino.logger.js';

export class KioskWorkScheduleService {
  private readonly db: DbType;
  private readonly logger = createServiceLogger('kioskWorkScheduleService');

  constructor(db: DbType) {
    this.db = db;
  }

  upsertDay(kioskId: number, data: UpdateKioskWorkSchedule): KioskWorkSchedule {
    this.logger.debug({
      kioskId,
      data,
      fn: 'upsertDay',
    });

    this.validateTimeRange(data.startTime, data.endTime);

    try {
      const result = this.db
        .insert(kioskWorkScheduleTable)
        .values({
          kioskId,
          dayOfWeek: data.dayOfWeek,
          isEnabled: data.isEnabled,
          startTime: data.startTime,
          endTime: data.endTime,
        })
        .onConflictDoUpdate({
          target: [
            kioskWorkScheduleTable.kioskId,
            kioskWorkScheduleTable.dayOfWeek,
          ],
          set: {
            isEnabled: data.isEnabled,
            startTime: data.startTime,
            endTime: data.endTime,
          },
        })
        .returning()
        .get();

      this.logger.info({ kioskId, fn: 'upsertDay' }, 'Work schedule upserted');

      return result;
    } catch (error) {
      this.logger.error(
        { error, kioskId, data, fn: 'upsertDay' },
        'Failed to upsert work schedule',
      );
      throw new KioskWorkScheduleError(500, 'Failed to upsert work schedule');
    }
  }

  getByKioskId(kioskId: number): KioskWorkSchedule[] {
    return this.db
      .select()
      .from(kioskWorkScheduleTable)
      .where(eq(kioskWorkScheduleTable.kioskId, kioskId))
      .all();
  }

  getDay(kioskId: number, dayOfWeek: DayOfWeek): KioskWorkSchedule {
    const schedule = this.findDay(kioskId, dayOfWeek);

    if (!schedule) {
      throw new KioskWorkScheduleError(404, 'Schedule not found');
    }

    return schedule;
  }

  findDay(
    kioskId: number,
    dayOfWeek: DayOfWeek,
  ): KioskWorkSchedule | undefined {
    const schedule = this.db
      .select()
      .from(kioskWorkScheduleTable)
      .where(
        and(
          eq(kioskWorkScheduleTable.kioskId, kioskId),
          eq(kioskWorkScheduleTable.dayOfWeek, dayOfWeek),
        ),
      )
      .get();

    return schedule;
  }

  getActiveSchedulesByDayAndTime(
    dayOfWeek: DayOfWeek,
    time: string,
  ): KioskWorkSchedule[] {
    return this.db
      .select()
      .from(kioskWorkScheduleTable)
      .where(
        and(
          eq(kioskWorkScheduleTable.dayOfWeek, dayOfWeek),
          kioskWorkScheduleTable.isEnabled,
          or(
            eq(kioskWorkScheduleTable.startTime, time),
            eq(kioskWorkScheduleTable.endTime, time),
          ),
        ),
      )
      .all();
  }

  scheduleStatuses(kioskId: number, now = new Date()) {
    const day = ((now.getDay() + 6) % 7) as DayOfWeek;
    const currentTime = now.toTimeString().slice(0, 5);

    const schedule = this.findDay(kioskId, day);

    return {
      scheduleNotActive: !schedule || !schedule.isEnabled,
      isStartTime: schedule?.isEnabled && currentTime === schedule.startTime,
      isEndTime: schedule?.isEnabled && currentTime === schedule.endTime,
    };
  }

  private validateTimeRange(startTime?: string, endTime?: string): void {
    if (!startTime || !endTime) {
      return;
    }

    if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) {
      throw new KioskWorkScheduleError(400, 'Invalid time format');
    }

    if (startTime >= endTime) {
      throw new KioskWorkScheduleError(
        400,
        'Start time must be earlier than end time',
      );
    }
  }
}
