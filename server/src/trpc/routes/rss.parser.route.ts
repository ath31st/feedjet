import {
  feedConfigService,
  rssParser,
  rssService,
  t,
} from '../../container.js';
import { publicProcedure } from '../../middleware/auth.js';

export const rssParserRouter = t.router({
  parseLatestFeedIitems: publicProcedure.query(() => {
    const rssFeeds = rssService.getActive();
    const limit = feedConfigService.findMaxCarouselSize();
    return rssParser.parseLatestFeedIitems(rssFeeds, limit);
  }),
});
