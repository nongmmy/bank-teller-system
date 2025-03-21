export class InvalidCredentialError extends Error {
  public readonly statusCode: number;

  constructor(message?: string) {
    super(message || 'Invalid credentials');

    this.statusCode = 401;
    Object.setPrototypeOf(this, InvalidCredentialError.prototype);
  }
}
