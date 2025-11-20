import { type Prisma, prisma } from '@/configs/prisma';
import { ErrorWithStatus } from '@/errors/ErrorWithStatus';
import type { TPlainUser, UpdateUser } from '@/modules/user/user.types';
import { findUserByEmail } from '@/modules/user/user.utils';
import type { TEmail, TQueries } from '@/types';
import {
	convertObjectValues,
	isNotEmptyObject,
	isString,
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
		const converted = convertObjectValues(query!, { keys: ['id'], convertTo: 'number' });
		const queries = pickFields(converted, [
			'id',
			'first_name',
			'last_name',
			'email',
			'role',
			'user_name',
		]);

		const filters = {} as Prisma.UserWhereInput;

		if (isValidObject(queries)) {
			for (const [key, value] of Object.entries(
				sanitizeData(queries, { ignoreNullish: true })
			)) {
				if (isString(value)) {
					filters[key as keyof typeof queries] = {
						contains: value,
						mode: 'insensitive',
					};
				} else {
					filters[key as keyof typeof queries] = value;
				}
			}
		}

		const users = await prisma.user.findMany({
			where: filters,
			orderBy: { id: 'asc' },
			omit: { password: true },
		});

		// ! Alternatives Below:

		// const p = await prisma.user.findMany({
		// 	where: {
		// 		email: {
		// 			contains: 'hello',
		// 		},
		// 	},
		// });

		// console.log(p);

		// const raw = await prisma.$queryRaw<User[]>(
		// 	Prisma.sql`select * from "User" where email like '%hello%'`
		// );

		// console.log(raw);

		// const {
		// 	_sum: { id: sum },
		// } = await prisma.user.aggregate({
		// 	_sum: {
		// 		id: true,
		// 	},
		// });

		// console.log(sum);

		return users;
	}

	/**
	 * * Get the current logged-in user's info from DB.
	 * @param email User email
	 * @returns The user details without the password field.
	 */
	async getCurrentUserFromDB(email: TEmail | undefined) {
		return await findUserByEmail(email);
	}

	/**
	 * * Retrieve a user from DB.
	 * @param id ID of user in integer form.
	 * @returns The matched user against the provided id.
	 */
	async getUserByIdFromDB(id: number) {
		const user = await prisma.user.findUnique({ where: { id }, omit: { password: true } });

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
		const deletedUser = await prisma.user.delete({ where: { id }, select: { id: true } });

		if (!deletedUser) {
			throw new ErrorWithStatus(
				'Delete Error',
				`Cannot delete user with id ${id}!`,
				STATUS_CODES.NOT_FOUND,
				'DELETE users/:id'
			);
		}

		return { deleted_id: deletedUser.id };
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

		const updatedUser = await prisma.user.update({
			where: { id },
			data: payload,
			omit: { password: true },
		});

		if (!updatedUser) {
			throw new ErrorWithStatus(
				'Update Error',
				`Cannot update user with id ${id}!`,
				STATUS_CODES.NOT_FOUND,
				'PATCH users/:id'
			);
		}

		return updatedUser;
	}
}

export const userServices = new UserServices();
