import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

import { UserRepositoryInterface } from '../../domain/repositories/userRepository.interface';
import { InvalidDataError } from '../../domain/errors/invalidDataError';

export class RegisterUsecase {
  constructor(private userRepository: UserRepositoryInterface) {}

  execute = async (
    username: string,
    password: string,
    role: 'ADMIN' | 'USER'
  ) => {
    const user = await this.userRepository.getUserByUsername(username);
    if (user) {
      throw new InvalidDataError('Username is duplicate');
    }

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: userId,
      username,
      password: hashedPassword,
      role,
    };

    const createdUser = await this.userRepository.createUser(newUser);
    return createdUser;
  };
}
