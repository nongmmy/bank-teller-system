import Decimal from 'decimal.js';

import { AccountRepositoryInterface } from '../../domain/repositories/accountRepository.interface';
import { AccountNotFoundError } from '../../domain/errors/accountNotFoundError';
import { InsufficientBalanceError } from '../../domain/errors/insufficientBalanceError';

export class TransferUsecase {
  constructor(private accountRepository: AccountRepositoryInterface) { }

  execute = async (
    fromAccountId: string,
    toAccountId: string,
    amount: number
  ) => {
    const fromAccount = await this.accountRepository.findOne(fromAccountId);
    if (!fromAccount) {
      throw new AccountNotFoundError(`From account with ID ${fromAccountId} does not exist.`);
    }

    const toAccount = await this.accountRepository.findOne(toAccountId);
    if (!toAccount) {
      throw new AccountNotFoundError(`To account with ID ${fromAccountId} does not exist.`);
    }

    if (fromAccount.balance < amount) {
      throw new InsufficientBalanceError(`Cannot transfer ${amount}, Balance is ${fromAccount.balance}.`);
    }

    const fromBalance = new Decimal(fromAccount.balance);
    const toBalance = new Decimal(toAccount.balance);

    fromAccount.balance = fromBalance.sub(amount).toNumber();
    toAccount.balance = toBalance.add(amount).toNumber();

    const updatedFromAccount = await this.accountRepository.updateAccount(
      fromAccount
    );
    const updatedToAccount = await this.accountRepository.updateAccount(
      toAccount
    );

    return {
      fromAccount: updatedFromAccount,
      toAccount: updatedToAccount,
    };
  };
}
