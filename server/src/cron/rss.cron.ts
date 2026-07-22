import cron, { type ScheduledTask } from 'node-cron';
import { eventBus, rssFeedCacheService } from '../container.js';
import {
  registerSseLifecycleCallbacks,
  sseConnectionRegistry,
} from '../sse/sse.connection.registry.js';
import { createServiceLogger } from '../utils/pino.logger.js';

const logger = createServiceLogger('rssCron');

const cronSchedule = process.env.RSS_CRON_SCHEDULE ?? '*/10 * * * *';
const RSS_SSE_PUSH_INTERVAL_MS = Number(
  process.env.RSS_SSE_PUSH_INTERVAL_MS ?? 30_000,
);

let fetchTask: ScheduledTask | null = null;
let pushTimer: ReturnType<typeof setInterval> | null = null;

export async function refreshFeedCache(): Promise<void> {
  const items = await rssFeedCacheService.refresh();

  if (items.length === 0) {
    return;
  }

  eventBus.emit('feed', items);
  logger.debug(
    { feedItemsCount: items.length, fn: 'refreshFeedCache' },
    'Refreshed feed sent to event bus',
  );
}

export function pushCachedFeeds(): void {
  const items = rssFeedCacheService.getCached();

  if (!items || items.length === 0) {
    logger.debug({ fn: 'pushCachedFeeds' }, 'Feed cache empty, skip push');
    return;
  }

  eventBus.emit('feed', items);
  logger.debug(
    { feedItemsCount: items.length, fn: 'pushCachedFeeds' },
    'Pushed cached feed items to event bus',
  );
}

export function refetchIfClientsOnline(): void {
  rssFeedCacheService.invalidate();

  if (sseConnectionRegistry.getCount() === 0) {
    logger.debug(
      { fn: 'refetchIfClientsOnline' },
      'Cache invalidated, no SSE clients online',
    );
    return;
  }

  logger.info(
    { fn: 'refetchIfClientsOnline' },
    'Cache invalidated, refetching for online clients',
  );
  void refreshFeedCache();
}

function runFetchIfNeeded(): void {
  if (sseConnectionRegistry.getCount() === 0) {
    return;
  }

  if (rssFeedCacheService.hasCache()) {
    logger.debug({ fn: 'runFetchIfNeeded' }, 'Feed cache hit, skip fetch');
    return;
  }

  void refreshFeedCache();
}

export function startRssJobs(): void {
  if (!fetchTask) {
    fetchTask = cron.schedule(cronSchedule, () => {
      logger.debug({ fn: 'startRssJobs' }, 'Running scheduled RSS fetch');
      runFetchIfNeeded();
    });
    logger.info(
      { cronSchedule: cronSchedule, fn: 'startRssJobs' },
      'RSS fetch cron started',
    );
  } else {
    fetchTask.start();
    logger.info({ fn: 'startRssJobs' }, 'RSS fetch cron resumed');
  }

  if (!pushTimer) {
    pushTimer = setInterval(() => {
      if (sseConnectionRegistry.getCount() === 0) {
        return;
      }
      pushCachedFeeds();
    }, RSS_SSE_PUSH_INTERVAL_MS);
    logger.info(
      { pushIntervalMs: RSS_SSE_PUSH_INTERVAL_MS, fn: 'startRssJobs' },
      'RSS SSE push interval started',
    );
  }
}

export function bindRssJobsToSseConnections(): void {
  registerSseLifecycleCallbacks({
    onFirstConnect: () => {
      startRssJobs();

      if (!rssFeedCacheService.hasCache()) {
        void refreshFeedCache();
      }
    },
    onLastDisconnect: stopRssJobs,
  });
}

export function stopRssJobs(): void {
  if (fetchTask) {
    fetchTask.stop();
    logger.info({ fn: 'stopRssJobs' }, 'RSS fetch cron stopped');
  }

  if (pushTimer) {
    clearInterval(pushTimer);
    pushTimer = null;
    logger.info({ fn: 'stopRssJobs' }, 'RSS SSE push interval stopped');
  }
}
