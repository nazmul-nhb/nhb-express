import { Router } from 'express';
import { USER_ROLES } from '../../constants';
import authorizeUser from '../../middlewares/authorizeUser';
import { userControllers } from './user.controllers';

const router = Router();

router.get('/', authorizeUser(...Object.values(USER_ROLES)), userControllers.getAllUsers);

export const userRoutes = router;
