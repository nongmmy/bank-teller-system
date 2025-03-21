import express from 'express';

import { TransactionController } from '../controller/transaction.controller';
import { DepositUsecase } from '../../usecases/transaction/deposit.usecase';
import { WithdrawUsecase } from '../../usecases/transaction/withdraw.usecase';
import { TransferUsecase } from '../../usecases/transaction/transfer.usecase';
import { AccountRepository } from '../repositories/account.repository';
import { validateRequest } from '../middlewares/validate.middleware';
import { DepositDto } from '../controller/dto/deposit.dto';
import { WithdrawDto } from '../controller/dto/withdraw.dto';
import { TransferDto } from '../controller/dto/transfer.dto';
import { authenticate } from '../middlewares/authen.middleware';
import { authorize } from '../middlewares/authorize.middleware';

const router = express.Router();

const accountRepository = new AccountRepository();

const depositUsecase = new DepositUsecase(accountRepository);
const withdrawUsecase = new WithdrawUsecase(accountRepository);
const transferUsecase = new TransferUsecase(accountRepository);

const transactionController = new TransactionController(depositUsecase, withdrawUsecase, transferUsecase);

router.post("/deposit", authenticate, authorize(['ADMIN']), validateRequest(DepositDto), transactionController.deposit);
router.post("/withdraw", authenticate, authorize(['ADMIN']), validateRequest(WithdrawDto), transactionController.withdraw);
router.post("/transfer", authenticate, authorize(['ADMIN']), validateRequest(TransferDto), transactionController.transfer);

export default router;