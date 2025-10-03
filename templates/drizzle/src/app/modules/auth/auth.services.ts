import { db } from '#/drizzle';
import { users } from '#/drizzle/schema/users';
import configs from '@/configs';
import { ErrorWithStatus } from '@/errors/ErrorWithStatus';
import { processLogin } from '@/modules/auth/auth.utils';
import type { InsertUser, TLoginCredentials } from '@/modules/user/user.types';
import { findUserByEmail, userCols } from '@/modules/user/user.utils';
import type { DecodedUser } from '@/types/interfaces';
import { generateToken, hashPassword, verifyToken } from '@/utilities/authUtilities';
import { pickFields } from 'nhb-toolbox';
import { STATUS_CODES } from 'nhb-toolbox/constants';

class AuthServices {
	async registerUserInDB(payload: InsertUser) {
		const hashedPass = await hashPassword(payload.password);

		const [user] = await db
			.insert(users)
			.values({ ...payload, password: hashedPass })
			.returning(userCols);

		if (!user) {
			throw new ErrorWithStatus(
				'Creation Error',
				'Cannot create user right now! Please try again later!',
				STATUS_CODES.INTERNAL_SERVER_ERROR,
				'CREATE /auth/register'
			);
		}

		return user;
	}

	/**
	 * * Login user.
	 * @param payload Login credentials (`email` and `password`).
	 * @returns Token as object.
	 */
	async loginUser(payload: TLoginCredentials) {
		// * Validate and extract user from DB.
		const user = await findUserByEmail(payload.email, true);

		const result = await processLogin(payload?.password, user);

		return result;
	}

	/**
	 * * Refresh access token (Get new one).
	 * @param token Refresh token from client.
	 * @returns New access token.
	 */
	async refreshToken(token: string): Promise<{ token: string }> {
		// * Verify and decode token
		const { email } = verifyToken(configs.refreshSecret, token);

		// * Validate and extract user from DB.
		const user = await findUserByEmail(email);
		// const [user] = await db.select({email: users.email, role: users.role }).from(users).where(eq(users.email, email));

		// * Create token and send to the client.
		const accessToken = generateToken(
			pickFields(user, ['email', 'role']),
			configs.accessSecret,
			configs.accessExpireTime
		);

		return { token: accessToken };
	}

	/**
	 * * Get the current logged-in user's info from DB.
	 * @param email User details from decoded JWT token.
	 * @returns The user details without the password field.
	 */
	async getCurrentUserFromDB(client: DecodedUser | undefined) {
		const user = await findUserByEmail(client?.email);

		return user;
	}
}

export const authServices = new AuthServices();
