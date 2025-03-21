import Decimal from 'decimal.js';

import { AccountRepositoryInterface } from '../../domain/repositories/accountRepository.interface';
import { AccountNotFoundError } from '../../domain/errors/accountNotFoundError';

export class DepositUsecase {
  constructor(private accountRepository: AccountRepositoryInterface) { }

  execute = async (accountId: string, amount: number) => {
    const account = await this.accountRepository.findOne(accountId);

    if (!account) {
      throw new AccountNotFoundError(`Account with ID ${accountId} does not exist.`);
    }

    const balance = new Decimal(account.balance);
    account.balance = balance.add(amount).toNumber();

    const updatedAccount = await this.accountRepository.updateAccount(account);

    return updatedAccount;
  };
}
