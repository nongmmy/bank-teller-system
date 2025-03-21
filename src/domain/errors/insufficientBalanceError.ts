export class InsufficientBalanceError extends Error {
  public readonly statusCode: number;

  constructor(message?: string) {
    super(message || 'Insufficient balance');

    this.statusCode = 403;
    Object.setPrototypeOf(this, InsufficientBalanceError.prototype);
  }
}
