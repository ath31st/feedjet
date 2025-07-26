import cron from 'node-cron';
import Logger from '../utils/logger.js';
import { eventBus, rssParser, rssService } from '../container.js';
import type { FeedItem } from '@shared/types/feed.js';

export const startRssCronJob = () => {
  const cronSchedule = process.env.CRON_SCHEDULE;
  const maxItems = Number(process.env.MAX_ITEMS) || 10;

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
      try {
        const items = await rssParser.parse(rssFeed.url);
        feedItems.push(...items);
      } catch (error) {
        Logger.error(`Failed to parse RSS feed: ${rssFeed.url}`, error);
      }
    }

    if (feedItems.length === 0) {
      Logger.log('No feed items fetched.');
      return;
    }

    const sortedItems = feedItems.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
    );

    const latestItems = sortedItems.slice(0, maxItems);

    Logger.log(
      `Fetched ${feedItems.length} items. Sending ${latestItems.length} latest items via eventBus.`,
    );
    eventBus.emit('feed', latestItems);
  });
};
