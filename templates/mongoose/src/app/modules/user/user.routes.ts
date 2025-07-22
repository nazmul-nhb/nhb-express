import { Router } from 'express';
import { ADMIN_ROLES, USER_ROLES } from '../../constants';
import authorizeUser from '../../middlewares/authorizeUser';
import { userControllers } from './user.controllers';

const router = Router();

router.get('/', authorizeUser(...ADMIN_ROLES), userControllers.getAllUsers);

router.get('/profile', authorizeUser(...USER_ROLES), userControllers.getCurrentUser);

export const userRoutes = router;
