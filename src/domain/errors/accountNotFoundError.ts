export class AccountNotFoundError extends Error {
  public readonly statusCode: number;

  constructor(message?: string) {
    super(message || 'Account not found');

    this.statusCode = 404;
    Object.setPrototypeOf(this, AccountNotFoundError.prototype);
  }
}
