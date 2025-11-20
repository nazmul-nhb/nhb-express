import configs from '@/configs';
import { authServices } from '@/modules/auth/auth.services';
import catchAsync from '@/utilities/catchAsync';
import sendResponse from '@/utilities/sendResponse';

class AuthControllers {
	/** * Register a new user */
	registerUser = catchAsync(async (req, res) => {
		const user = await authServices.registerUserInDB(req.body);

		sendResponse(res, 'User', 'POST', user, 'User registered successfully!');
	});

	/** * Login a user */
	loginUser = catchAsync(async (req, res) => {
		const { refresh_token, access_token, user } = await authServices.loginUser(req.body);

		res.cookie('refresh_token', refresh_token, {
			secure: configs.NODE_ENV === 'production',
			httpOnly: true,
		});

		sendResponse(res, 'User', 'OK', { user, token: access_token }, 'Login successful!');
	});

	/** * Generate new access token. */
	refreshToken = catchAsync(async (req, res) => {
		const { refresh_token } = req.cookies as { refresh_token: string };

		const token = await authServices.refreshToken(refresh_token);

		sendResponse(res, 'N/A', 'OK', token, 'Successfully retrieved new access token!');
	});

	/** * Get current logged in user. */
	getCurrentUser = catchAsync(async (req, res) => {
		const user = await authServices.getCurrentUserFromDB(req.user);

		sendResponse(res, 'User', 'GET', user, 'Successfully retrieved user profile!');
	});
}

export const authControllers = new AuthControllers();
