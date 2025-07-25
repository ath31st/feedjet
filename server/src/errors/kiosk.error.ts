export class KioskConfigServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KioskConfigServiceError';
  }
}
