import { NextFunction, Request, Response } from "express";
import { CreateAccountUsecase } from "../../usecases/account/createAccount.usecase";

export class AccountController {
  constructor(private createAccountUsecase: CreateAccountUsecase) { }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, telephone } = req.body;
      const result = await this.createAccountUsecase.execute(
        firstName,
        lastName,
        telephone
      );

      res.json({ message: 'account created successfully', newAccount: result });
    } catch (error) {
      next(error);
    }
  };
}