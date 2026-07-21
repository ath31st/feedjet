import cron from 'node-cron';
import { deviceControlService, integrationService } from '../container.js';
import { createServiceLogger } from '../utils/pino.logger.js';

const logger = createServiceLogger('screenStateCron');

const cronSchedule = process.env.CRON_SCREEN_STATE ?? '0 * * * * *';

let cronRunning = false;

async function refreshAllScreenStates(): Promise<void> {
  if (cronRunning) {
    logger.debug(
      { fn: 'startScreenStateCron' },
      'Skip: previous screen state poll still running',
    );
    return;
  }

  cronRunning = true;

  try {
    const ips = [
      ...new Set(
        integrationService.getAll().map((integration) => integration.ip),
      ),
    ];

    if (ips.length === 0) {
      return;
    }

    logger.debug(
      { count: ips.length, fn: 'startScreenStateCron' },
      'Refreshing screen states',
    );

    await Promise.all(
      ips.map((ip) => deviceControlService.refreshScreenState(ip)),
    );
  } catch (err) {
    logger.error(
      { err, fn: 'startScreenStateCron' },
      'Critical error in screen state cron',
    );
  } finally {
    cronRunning = false;
  }
}

export function startScreenStateCron(): void {
  void refreshAllScreenStates();

  cron.schedule(cronSchedule, () => {
    void refreshAllScreenStates();
  });
}
