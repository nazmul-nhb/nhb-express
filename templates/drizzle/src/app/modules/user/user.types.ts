import type { users } from '#/drizzle/schema/users';
import type { Prettify } from 'nhb-toolbox/utils/types';

export type InsertUser = Omit<typeof users.$inferInsert, 'id' | 'created_at' | 'updated_at'>;

export type UpdateUser = Partial<Pick<InsertUser, 'first_name' | 'last_name' | 'user_name'>>;

export type TUser = typeof users.$inferSelect;

export type TLoginCredentials = Pick<InsertUser, 'email' | 'password'>;

export type TPlainUser = Prettify<Omit<TUser, 'password'>>;

export interface ITokens {
	access_token: string;
	refresh_token: string;
	user: TPlainUser;
}
