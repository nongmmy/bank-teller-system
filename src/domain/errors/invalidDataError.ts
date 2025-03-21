export class InvalidDataError extends Error {
  public readonly statusCode: number;

  constructor(message?: string) {
    super(message || 'Invalid data');

    this.statusCode = 403;
    Object.setPrototypeOf(this, InvalidDataError.prototype);
  }
}
