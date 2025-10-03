import { db } from '#/drizzle';
import { users } from '#/drizzle/schema/users';
import { ErrorWithStatus } from '@/errors/ErrorWithStatus';
import type { TPlainUser, TUser } from '@/modules/user/user.types';
import type { TEmail } from '@/types';
import { eq, getTableColumns } from 'drizzle-orm';
import { isEmail } from 'nhb-toolbox';
import { STATUS_CODES } from 'nhb-toolbox/constants';

export const { password, ...userCols } = getTableColumns(users);

/**
 * * Find a specific user using user email.
 * @param email User email
 * @param withPassword Whether to retrieve user with or without password.Defaults to `false`.
 * @returns USer object from database.
 */
export async function findUserByEmail<Pass extends boolean = false>(
	email: TEmail | undefined,
	withPassword?: Pass
): Promise<Pass extends true ? TUser : TPlainUser> {
	if (!isEmail(email)) {
		throw new ErrorWithStatus(
			'Bad Request',
			`${email} is not a valid email`,
			STATUS_CODES.BAD_REQUEST,
			'email'
		);
	}

	const [user] = await db
		.select({ ...userCols, ...(withPassword && { password }) })
		.from(users)
		.where(eq(users.email, email));

	if (!user) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`User with email ${email} not found!`,
			STATUS_CODES.NOT_FOUND,
			'user'
		);
	}

	return user as Pass extends true ? TUser : TPlainUser;
}
