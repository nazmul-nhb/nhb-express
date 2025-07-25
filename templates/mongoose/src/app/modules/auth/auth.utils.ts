import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import configs from '../../configs';
import { STATUS_CODES } from '../../constants';
import { comparePassword, generateToken } from '../../utilities/authUtilities';
import type { IPlainUser, IUserDoc } from '../user/user.types';

/**
 * Process user login.
 * @param password Password to compare with the stored password.
 * @param user User document from the database.
 * @returns Access and refresh tokens along with user information.
 */
export const processLogin = async <T extends IUserDoc>(password: string, user: T) => {
	// * Check if password matches with the saved password in DB.
	const passwordMatched = await comparePassword(password, user?.password);

	if (!passwordMatched) {
		throw new ErrorWithStatus(
			'Authorization Error',
			`Invalid credentials!`,
			STATUS_CODES.UNAUTHORIZED,
			'auth',
		);
	}

	// * Create tokens and send to the client.
	const jwtPayload = {
		email: user.email,
		role: user.role,
	};

	const accessToken = generateToken(
		jwtPayload,
		configs.accessSecret,
		configs.accessExpireTime,
	);

	const refreshToken = generateToken(
		jwtPayload,
		configs.refreshSecret,
		configs.refreshExpireTime,
	);

	const { password: _, __v, ...userInfo } = user.toObject<IPlainUser>();

	return {
		access_token: accessToken,
		refresh_token: refreshToken,
		user: userInfo,
	};
};
