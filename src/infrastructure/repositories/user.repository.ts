import { Equal, Repository } from 'typeorm';
import { User } from '../../domain/models/user';
import { UserRepositoryInterface } from '../../domain/repositories/userRepository.interface';
import { UserEntity } from '../entities/user.entity';
import { myDataSource } from '../config/typeorm.config';

export class UserRepository implements UserRepositoryInterface {
  private repository: Repository<UserEntity>;

  constructor() {
    this.repository = myDataSource.getRepository(UserEntity);
  }

  createUser = async (user: User) => {
    return await this.repository.save(user);
  };

  getUserByUsername = async (username: string) => {
    const result = await this.repository.findOneBy({
      username: Equal(username),
    });
    return result;
  };
}
