import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { UserRepositoryInterface } from '../../domain/repositories/userRepository.interface';
import { InvalidCredentialError } from '../../domain/errors/invalidCredentialError';

export class LoginUsecase {
  constructor(private userRepository: UserRepositoryInterface) {}

  execute = async (username: string, password: string) => {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) {
      throw new InvalidCredentialError('Username is invalid');
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new InvalidCredentialError('Password is invalid');
    }

    // Create JWT payload
    const payload = {
      username: user.username,
      role: user.role,
    };

    // Sign token
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign(payload, JWT_SECRET);

    return token;
  };
}
