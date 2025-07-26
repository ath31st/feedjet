import { publicProcedure, rssParser, rssService, t } from '../../container.js';

export const rssParserRouter = t.router({
  parseLatestFeedIitems: publicProcedure.query(() => {
    const rssFeeds = rssService.getActive();
    return rssParser.parseLatestFeedIitems(rssFeeds);
  }),
});
