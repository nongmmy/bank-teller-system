import { NextFunction, Request, Response } from 'express';
import { DepositUsecase } from '../../usecases/deposit.usecase';
import { WithdrawUsecase } from '../../usecases/withdraw.usecase';
import { TransferUsecase } from '../../usecases/transfer.usecase';

export class TransactionController {
  constructor(
    private depositUsecase: DepositUsecase,
    private withDrawUsecase: WithdrawUsecase,
    private transferUsecase: TransferUsecase
  ) {}

  deposit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const result = await this.depositUsecase.execute(
        body.accountId,
        body.amount
      );

      res.json({ message: 'Deposited successfully', account: result });
    } catch (error) {
      next(error);
    }
  };

  withdraw = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const result = await this.withDrawUsecase.execute(
        body.accountId,
        body.amount
      );

      res.json({ message: 'Withdrawn successfully', account: result });
    } catch (error) {
      next(error);
    }
  };

  transfer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const { fromAccount, toAccount } = await this.transferUsecase.execute(
        body.fromAccountId,
        body.toAccountId,
        body.amount
      );

      res.json({ message: 'Tranferred successfully', fromAccount, toAccount });
    } catch (error) {
      next(error);
    }
  };
}
