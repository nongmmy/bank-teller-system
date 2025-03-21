import Decimal from 'decimal.js';

import { AccountRepositoryInterface } from '../../domain/repositories/accountRepository.interface';
import { AccountNotFoundError } from '../../domain/errors/accountNotFoundError';
import { InsufficientBalanceError } from '../../domain/errors/insufficientBalanceError';

export class WithdrawUsecase {
  constructor(private accountRepository: AccountRepositoryInterface) { }

  execute = async (accountId: string, amount: number) => {
    const account = await this.accountRepository.findOne(accountId);

    if (!account) {
      throw new AccountNotFoundError(`Account with ID ${accountId} does not exist.`);
    }

    if (account.balance < amount) {
      throw new InsufficientBalanceError(`Cannot withdraw ${amount}, Balance is ${account.balance}.`);
    }

    const balance = new Decimal(account.balance);
    account.balance = balance.sub(amount).toNumber();

    await this.accountRepository.updateAccount(account);

    return account;
  };
}
