export class RssParserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RssParserError';
  }
}
