import { v4 as uuidv4 } from 'uuid';

import { Account } from "../../domain/models/account";
import { AccountRepositoryInterface } from "../../domain/repositories/accountRepository.interface";

export class CreateAccountUsecase {
  constructor(private accountRepository: AccountRepositoryInterface) { }

  execute = async (firstName: string, lastName: string, telephone: string) => {

    const newAccount = {
      accountId: uuidv4(),
      balance: 0,
      customer: {
        firstName,
        lastName,
        telephone,
      }
    } as Account;

    const createdAccount = await this.accountRepository.updateAccount(newAccount);

    return createdAccount;
  };
}