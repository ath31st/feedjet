export type ServiceErrorCode = 400 | 401 | 403 | 404 | 409 | 500;

export class ServiceError extends Error {
  constructor(
    public readonly code: ServiceErrorCode,
    message: string,
  ) {
    super(message);
  }
}
