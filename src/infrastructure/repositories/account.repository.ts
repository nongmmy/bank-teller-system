import { Equal, Repository } from 'typeorm';
import { AccountRepositoryInterface } from '../../domain/repositories/accountRepository.interface';
import { myDataSource } from '../config/typeorm.config';
import { AccountEntity } from '../entities/account.entity';
import { Account } from '../../domain/models/account';

export class AccountRepository implements AccountRepositoryInterface {
  private repository: Repository<AccountEntity>;

  constructor() {
    this.repository = myDataSource.getRepository(AccountEntity);
  }

  findOne = async (accountId: string) => {
    const result = await this.repository.findOneBy({
      accountId: Equal(accountId),
    });
    return result;
  };

  updateAccount = async (account: Account) => {
    return await this.repository.save(account);
  };
}
