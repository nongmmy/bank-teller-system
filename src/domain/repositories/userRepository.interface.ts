import { User } from '../models/user';

export interface UserRepositoryInterface {
  createUser(user: User): Promise<User>;
  getUserByUsername(username: string): Promise<User>;
}
