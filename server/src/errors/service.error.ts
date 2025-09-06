export type ServiceErrorCode = 400 | 401 | 403 | 404 | 409 | 500;

export class ServiceError extends Error {
  public readonly code: ServiceErrorCode;

  constructor(code: ServiceErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}
