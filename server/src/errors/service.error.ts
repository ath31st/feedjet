export type ServiceErrorCode = 409 | 400 | 500;

export class ServiceError extends Error {
  constructor(
    public readonly code: ServiceErrorCode,
    message: string,
  ) {
    super(message);
  }
}
