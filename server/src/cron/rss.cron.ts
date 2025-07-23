import cron from 'node-cron';
import Logger from '../utils/logger.js';
import { rssParser, rssService } from '../container.js';

export const startRssCronJob = () => {
  const cronSchedule = process.env.CRON_SCHEDULE;

  if (!cronSchedule) {
    Logger.log('CRON_SCHEDULE is not set. Scheduled task will not run.');
    return;
  }

  cron.schedule(cronSchedule, () => {
    Logger.log(
      `Running scheduled task to fetch rss feeds with cron schedule: ${cronSchedule}...`,
    );

    const rssFeeds = rssService.getActive();

    if (rssFeeds.length === 0) {
      Logger.log('No active rss feeds found.');
      return;
    }

    const feedItems = rssFeeds.flatMap((feed) => {
      return rssParser.parse(feed.url);
    });

    Logger.log(`Fetched ${feedItems.length} feed items.`);
  });
};
