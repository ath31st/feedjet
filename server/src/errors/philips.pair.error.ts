export class PhilipsPairError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PhilipsPairError';
  }
}
