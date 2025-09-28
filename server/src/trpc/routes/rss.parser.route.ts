import {
  feedConfigService,
  publicProcedure,
  rssParser,
  rssService,
  t,
} from '../../container.js';

export const rssParserRouter = t.router({
  parseLatestFeedIitems: publicProcedure.query(() => {
    const rssFeeds = rssService.getActive();
    const limit = feedConfigService.findMaxCarouselSize();
    return rssParser.parseLatestFeedIitems(rssFeeds, limit);
  }),
});
