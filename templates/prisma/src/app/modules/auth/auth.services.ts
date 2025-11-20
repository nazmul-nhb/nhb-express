import configs from '@/configs';
import { prisma } from '@/configs/prisma';
import { processLogin } from '@/modules/auth/auth.utils';
import type { InsertUser, TLoginCredentials } from '@/modules/user/user.types';
import { findUserByEmail } from '@/modules/user/user.utils';
import type { DecodedUser } from '@/types/interfaces';
import { generateToken, hashPassword, verifyToken } from '@/utilities/authUtilities';
import { pickFields } from 'nhb-toolbox';

class AuthServices {
	/**
	 * * Register a user in the database.
	 * @param payload Required data to register a user.
	 * @returns The registered user info or throws error if error occurs.
	 */
	async registerUserInDB(payload: InsertUser) {
		const { first_name, password } = payload;

		const normalized = first_name.toLowerCase().replace(/\s+/g, '_');

		let username = normalized;
		let suffix = 0;

		while (true) {
			const exists = await prisma.user.findUnique({
				where: { user_name: username },
				select: { id: true },
			});

			if (!exists) break;

			suffix += 1;
			username = `${normalized}_${suffix}`;
		}

		payload.user_name = username;
		payload.password = await hashPassword(password);

		return await prisma.user.create({ data: payload, omit: { password: true } });
	}

	/**
	 * * Login user.
	 * @param payload Login credentials (`email` and `password`).
	 * @returns Token as object.
	 */
	async loginUser(payload: TLoginCredentials) {
		// * Validate and extract user from DB.
		const user = await findUserByEmail(payload.email, true);

		return await processLogin(payload?.password, user);
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
		return await findUserByEmail(client?.email);
	}
}

export const authServices = new AuthServices();
