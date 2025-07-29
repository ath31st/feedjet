export class FeedConfigServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'feedConfigServiceError';
  }
}
