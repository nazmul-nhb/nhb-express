import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';
import { userServices } from './user.services';

const getAllUsers = catchAsync(async (_req, res) => {
	const users = await userServices.getAllUsersFromDB();

	sendResponse(res, 'User', 'GET', users);
});

export const userControllers = { getAllUsers };
