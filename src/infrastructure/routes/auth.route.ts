import express from 'express';

import { validateRequest } from '../middlewares/validate.middleware';
import { UserController } from '../controller/user.controller';
import { RegisterUsecase } from '../../usecases/auth/register.usecase';
import { LoginUsecase } from '../../usecases/auth/login.usecase';
import { UserRepository } from '../repositories/user.repository';
import { RegisterDto } from '../controller/dto/register.dto';
import { LoginDto } from '../controller/dto/login.dto';

const router = express.Router();

const userRepository = new UserRepository();

const registerUsecase = new RegisterUsecase(userRepository);
const loginUsecase = new LoginUsecase(userRepository);

const userController = new UserController(registerUsecase, loginUsecase);

router.post('/register', validateRequest(RegisterDto), userController.register);
router.post('/login', validateRequest(LoginDto), userController.login);

export default router;
