import { Account } from '../models/account';

export interface AccountRepositoryInterface {
  findOne(accountId: string): Promise<Account>;
  updateAccount(account: Account): Promise<Account>;
}
