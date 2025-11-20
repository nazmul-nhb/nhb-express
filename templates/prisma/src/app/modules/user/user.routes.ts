import { USER_ROLES } from '@/constants';
import authorizeUser from '@/middlewares/authorizeUser';
import validateRequest from '@/middlewares/validateRequest';
import { userControllers } from '@/modules/user/user.controllers';
import { userValidations } from '@/modules/user/user.validation';
import { Router } from 'express';

const router = Router();

router.get(
	'/',
	// authorizeUser(...ADMIN_ROLES),
	userControllers.getAllUsers
);

router.get('/:id', userControllers.getUserById);

router.delete('/:id', userControllers.deleteUserById);

router.patch(
	'/:id',
	validateRequest(userValidations.updateSchema),
	userControllers.updateUserById
);

router.get('/profile', authorizeUser(...USER_ROLES), userControllers.getCurrentUser);

export const userRoutes = router;
