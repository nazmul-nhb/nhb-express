import { db } from '#/drizzle';
import { users } from '#/drizzle/schema/users';
import { ErrorWithStatus } from '@/errors/ErrorWithStatus';
import type { TPlainUser, UpdateUser } from '@/modules/user/user.types';
import { findUserByEmail, userCols } from '@/modules/user/user.utils';
import type { TEmail, TQueries } from '@/types';
import { eq, ilike, or, type SQL } from 'drizzle-orm';
import {
	convertObjectValues,
	isNotEmptyObject,
	isValidObject,
	pickFields,
	sanitizeData,
} from 'nhb-toolbox';
import { STATUS_CODES } from 'nhb-toolbox/constants';

class UserServices {
	/**
	 * * Get all users from database.
	 * @param query Optional query parameters to pass.
	 * @returns All users that matched the query as an array.
	 */
	async getAllUsersFromDB(query?: TQueries<TPlainUser>) {
		const queries = pickFields(
			convertObjectValues(query!, { keys: ['id'], convertTo: 'number' }),
			['id', 'first_name', 'last_name', 'email', 'role', 'user_name']
		);

		const filters: SQL[] =
			isValidObject(query) ?
				Object.entries(sanitizeData(queries, { ignoreNullish: true })).map(
					([key, value]) => {
						if (typeof value === 'string') {
							return ilike(users[key as keyof TPlainUser], `%${value}%`);
						}
						return eq(users[key as 'id'], value!);
					}
				)
			:	[];

		const result = await db
			.select(userCols)
			.from(users)
			.orderBy(users.id)
			.where(or(...filters));

		return result;
	}

	/**
	 * * Get the current logged-in user's info from DB.
	 * @param email User email
	 * @returns The user details without the password field.
	 */
	async getCurrentUserFromDB(email: TEmail | undefined) {
		const user = await findUserByEmail(email);

		return user;
	}

	/**
	 * * Retrieve a user from DB.
	 * @param id ID of user in integer form.
	 * @returns The matched user against the provided id.
	 */
	async getUserByIdFromDB(id: number) {
		const user = await db.query.users.findFirst({
			where: (ut, q) => q.eq(ut.id, id),
			columns: { password: false },
		});

		if (!user) {
			throw new ErrorWithStatus(
				'Not Found Error',
				`User not found with id ${id}!`,
				STATUS_CODES.NOT_FOUND,
				'GET users/:id'
			);
		}

		return user;
	}

	/**
	 * * Delete a user from DB.
	 * @param id ID of the user to delete.
	 * @returns Deleted user's id as `{ deleted_id: number }`
	 */
	async deleteUserByIdFromDB(id: number) {
		const [res] = await db
			.delete(users)
			.where(eq(users.id, id))
			.returning({ deleted_id: users.id });

		if (!res) {
			throw new ErrorWithStatus(
				'Delete Error',
				`Cannot delete user with id ${id}!`,
				STATUS_CODES.NOT_FOUND,
				'DELETE users/:id'
			);
		}

		return res;
	}

	/**
	 * * Update a user in DB by id.
	 * @param id ID to find user from DB.
	 * @param payload Fields to update in user.
	 */
	async updateUserInDB(id: number, payload: UpdateUser) {
		if (!isNotEmptyObject(payload)) {
			throw new ErrorWithStatus(
				'Empty Payload',
				`Your payload is empty for user with id ${id}!`,
				STATUS_CODES.BAD_REQUEST,
				'PATCH users/:id'
			);
		}

		const [res] = await db
			.update(users)
			.set(payload)
			.where(eq(users.id, id))
			.returning(userCols);

		if (!res) {
			throw new ErrorWithStatus(
				'Update Error',
				`Cannot update user with id ${id}!`,
				STATUS_CODES.NOT_FOUND,
				'PATCH users/:id'
			);
		}

		return res;
	}
}

export const userServices = new UserServices();
