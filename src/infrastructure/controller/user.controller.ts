import { NextFunction, Request, Response } from 'express';
import { LoginUsecase } from '../../usecases/auth/login.usecase';
import { RegisterUsecase } from '../../usecases/auth/register.usecase';

export class UserController {
  constructor(
    private registerUsecase: RegisterUsecase,
    private loginUsecase: LoginUsecase
  ) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password, role } = req.body;
      const result = await this.registerUsecase.execute(
        username,
        password,
        role
      );

      res.json({ message: 'register successfully', user: result });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const result = await this.loginUsecase.execute(username, password);

      res.json({ message: 'logged in successfully', token: result });
    } catch (error) {
      next(error);
    }
  };
}
