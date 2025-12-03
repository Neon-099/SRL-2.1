import { Router } from 'express';

import authorize from '../middlewares/auth.middleware.js';
import { getUsers, getUser} from '../controller/user.controller.js'

const userRouter = Router();


userRouter.get('/', getUsers);
userRouter.get('/:id', authorize, getUser);
userRouter.post('/', (req, res) => ( { title: 'CREATE New Users'}));
userRouter.put('/:id', (req, res) => ( { title: 'UPDATE Users'}));
userRouter.delete('/:id', (req, res) => ( { title: 'DELETE Users'}));

export default userRouter;