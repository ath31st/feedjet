export class RssServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RssServiceError';
  }
}
