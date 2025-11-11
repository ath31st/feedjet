import cron from 'node-cron';
import {
  eventBus,
  rssParser,
  rssService,
  feedConfigService,
} from '../container.js';
import logger from '../utils/pino.logger.js';

export const startRssCronJob = () => {
  const cronSchedule = process.env.CRON_SCHEDULE;

  if (!cronSchedule) {
    logger.info('CRON_SCHEDULE is not set. Scheduled task will not run.');
    return;
  }

  cron.schedule(cronSchedule, async () => {
    logger.info('Running scheduled task to fetch rss feeds.');

    const rssFeeds = rssService.getActive();

    if (rssFeeds.length === 0) {
      logger.info(
        { rssFeedsCount: rssFeeds.length },
        'No active RSS feeds found',
      );
      return;
    }

    const limit = feedConfigService.findMaxCarouselSize();
    if (!limit) {
      logger.warn('Feed config (carouselSize) not found, skipping RSS fetch.');
      return;
    }

    const latestItems = await rssParser.parseLatestFeedIitems(rssFeeds, limit);

    if (latestItems.length === 0) {
      logger.info('No feed items fetched.');
      return;
    }

    logger.info(`Sending ${latestItems.length} latest items via eventBus.`);
    eventBus.emit('feed', latestItems);
  });
};
