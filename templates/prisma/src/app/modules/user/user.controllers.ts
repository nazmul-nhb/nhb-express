import { userServices } from '@/modules/user/user.services';
import catchAsync from '@/utilities/catchAsync';
import sendResponse from '@/utilities/sendResponse';

class UserControllers {
	getAllUsers = catchAsync(async (req, res) => {
		const users = await userServices.getAllUsersFromDB(req.query);

		sendResponse(res, 'User', 'GET', users);
	});

	/** * Get current logged in user. */
	getCurrentUser = catchAsync(async (req, res) => {
		const user = await userServices.getCurrentUserFromDB(req?.user?.email);

		sendResponse(res, 'User', 'GET', user, 'Successfully retrieved user profile!');
	});

	/** * Get a user by user id. */
	getUserById = catchAsync(async (req, res) => {
		const user = await userServices.getUserByIdFromDB(Number(req.params.id));

		sendResponse(res, 'User', 'GET', user);
	});

	/** * Delete a user by id. */
	deleteUserById = catchAsync(async (req, res) => {
		const result = await userServices.deleteUserByIdFromDB(Number(req.params.id));

		sendResponse(res, 'User', 'DELETE', result);
	});

	/** * Update a user by id. */
	updateUserById = catchAsync(async (req, res) => {
		const result = await userServices.updateUserInDB(Number(req.params.id), req.body);

		sendResponse(res, 'User', 'PATCH', result);
	});
}

export const userControllers = new UserControllers();
