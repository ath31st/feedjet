import cron from 'node-cron';
import {
  eventBus,
  rssParser,
  rssService,
  feedConfigService,
} from '../container.js';
import { createServiceLogger } from '../utils/pino.logger.js';

const logger = createServiceLogger('rssCron');

export const startRssCronJob = () => {
  const cronSchedule = process.env.CRON_SCHEDULE;

  if (!cronSchedule) {
    logger.info(
      { fn: 'startRssCronJob' },
      'CRON_SCHEDULE is not set. Scheduled task will not run.',
    );
    return;
  }

  cron.schedule(cronSchedule, async () => {
    logger.info(
      { fn: 'startRssCronJob' },
      'Running scheduled task to fetch rss feeds.',
    );

    const rssFeeds = rssService.getActive();

    if (rssFeeds.length === 0) {
      logger.info(
        { rssFeedsCount: rssFeeds.length, fn: 'startRssCronJob' },
        'No active RSS feeds found',
      );
      return;
    }

    const limit = feedConfigService.findMaxCarouselSize();
    if (!limit) {
      logger.warn(
        { fn: 'startRssCronJob' },
        'Feed config (carouselSize) not found, skipping RSS fetch.',
      );
      return;
    }

    const latestItems = await rssParser.parseLatestFeedIitems(rssFeeds, limit);

    if (latestItems.length === 0) {
      logger.info({ fn: 'startRssCronJob' }, 'No feed items fetched.');
      return;
    }

    logger.info(
      {
        rssFeedsCount: rssFeeds.length,
        feedItemsCount: latestItems.length,
        fn: 'startRssCronJob',
      },
      'Sended feed items to event bus',
    );
    eventBus.emit('feed', latestItems);
  });
};
