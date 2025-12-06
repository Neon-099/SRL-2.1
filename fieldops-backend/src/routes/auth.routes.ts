import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js'


const authRouter = Router();

//PATH: /api/v1/auth/sign-up
authRouter.post('/sign-up', authController.signUpController);
authRouter.post('/sign-in', authController.signInController);
authRouter.post('/sign-out', authController.signOutController);

export default authRouter;
