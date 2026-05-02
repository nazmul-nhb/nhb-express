import { ADMIN_ROLES } from '@/constants';
import authorizeUser from '@/middlewares/authorizeUser';
import validateRequest from '@/middlewares/validateRequest';
import { userControllers } from '@/modules/user/user.controllers';
import { userValidations } from '@/modules/user/user.validation';
import { Router } from 'express';

const router = Router();

router.get('/', userControllers.getAllUsers);

router.get('/:id', userControllers.getUserById);

router.delete('/:id', authorizeUser(...ADMIN_ROLES), userControllers.deleteUserById);

router.patch(
	'/:id',
	authorizeUser(...ADMIN_ROLES),
	validateRequest(userValidations.updateSchema),
	userControllers.updateUserById
);

export const userRoutes = router;
