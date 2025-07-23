import cron from 'node-cron';
import Logger from '../utils/logger.js';
import { rssParser, rssService } from '../container.js';
import type { FeedItem } from '@shared/types/feed.js';

export const startRssCronJob = () => {
  const cronSchedule = process.env.CRON_SCHEDULE;

  if (!cronSchedule) {
    Logger.log('CRON_SCHEDULE is not set. Scheduled task will not run.');
    return;
  }

  cron.schedule(cronSchedule, async () => {
    Logger.log(
      `Running scheduled task to fetch rss feeds with cron schedule: ${cronSchedule}...`,
    );

    const rssFeeds = rssService.getActive();

    if (rssFeeds.length === 0) {
      Logger.log('No active rss feeds found.');
      return;
    }

    const feedItems: FeedItem[] = [];

    for (const rssFeed of rssFeeds) {
      const items = await rssParser.parse(rssFeed.url);
      feedItems.push(...items);
    }

    Logger.log(`Fetched ${feedItems.length} feed items.`);
  });
};
