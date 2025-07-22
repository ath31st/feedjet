export type RawFeedItem = {
  title: string;
  link: string;
  guid?: string;
  pubDate?: string;
  isoDate?: string;
  creator?: string;
  content?: string;
  contentSnippet?: string;
  enclosure?: {
    url?: string;
    type?: string;
    length?: string;
  };
  categories?: string[];
  'dc:creator'?: string;
  [key: string]: unknown;
};
