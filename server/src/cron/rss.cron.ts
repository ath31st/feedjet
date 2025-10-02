import cron from 'node-cron';
import Logger from '../utils/logger.js';
import {
  eventBus,
  rssParser,
  rssService,
  feedConfigService,
} from '../container.js';

export const startRssCronJob = () => {
  const cronSchedule = process.env.CRON_SCHEDULE;

  if (!cronSchedule) {
    Logger.log('CRON_SCHEDULE is not set. Scheduled task will not run.');
    return;
  }

  cron.schedule(cronSchedule, async () => {
    Logger.log('Running scheduled task to fetch rss feeds.');

    const rssFeeds = rssService.getActive();

    if (rssFeeds.length === 0) {
      Logger.log('No active rss feeds found.');
      return;
    }

    const limit = feedConfigService.findMaxCarouselSize();
    if (!limit) {
      Logger.warn('Feed config (carouselSize) not found, skipping RSS fetch.');
      return;
    }

    const latestItems = await rssParser.parseLatestFeedIitems(rssFeeds, limit);

    if (latestItems.length === 0) {
      Logger.log('No feed items fetched.');
      return;
    }

    Logger.log(`Sending ${latestItems.length} latest items via eventBus.`);
    eventBus.emit('feed', latestItems);
  });
};
