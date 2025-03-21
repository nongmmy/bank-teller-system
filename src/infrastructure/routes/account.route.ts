import express from 'express';

import { validateRequest } from '../middlewares/validate.middleware';
import { AccountController } from '../controller/account.controller';
import { CreateAccountUsecase } from '../../usecases/account/createAccount.usecase';
import { AccountRepository } from '../repositories/account.repository';
import { CraeteAccountDto } from '../controller/dto/createAccount.dto';


const router = express.Router();

const accountRepository = new AccountRepository();

const createAccountUsecase = new CreateAccountUsecase(accountRepository);

const accountController = new AccountController(createAccountUsecase);

router.post('/', validateRequest(CraeteAccountDto), accountController.create);


export default router;