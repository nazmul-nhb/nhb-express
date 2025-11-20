import configs from '@/configs';
import { ErrorWithStatus } from '@/errors/ErrorWithStatus';
import type { ITokens, TUser } from '@/modules/user/user.types';
import { comparePassword, generateToken } from '@/utilities/authUtilities';
import { omitFields } from 'nhb-toolbox';
import { STATUS_CODES } from 'nhb-toolbox/constants';

/**
 * Process user login.
 * @param password Password to compare with the stored password.
 * @param user User document from the database.
 * @returns Access and refresh tokens along with user information.
 */
export async function processLogin(password: string, user: TUser) {
	// * Check if password matches with the saved password in DB.
	const passwordMatched = await comparePassword(password, user?.password);

	if (!passwordMatched) {
		throw new ErrorWithStatus(
			'Authorization Error',
			`Invalid credentials!`,
			STATUS_CODES.UNAUTHORIZED,
			'auth'
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
		configs.accessExpireTime
	);

	const refreshToken = generateToken(
		jwtPayload,
		configs.refreshSecret,
		configs.refreshExpireTime
	);

	return {
		access_token: accessToken,
		refresh_token: refreshToken,
		user: omitFields(user, ['password']),
	} as ITokens;
}

// export function processRegistration() {}
