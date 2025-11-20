import type { Prisma, User } from '@/configs/prisma';
import type { TEmail } from '@/types';
import type { Prettify } from 'nhb-toolbox/utils/types';

type Email = { email: TEmail };

export type InsertUser = Prettify<
	Pick<Prisma.UserCreateInput, 'first_name' | 'last_name' | 'password'> & Email
>;

export type UpdateUser = Partial<
	Pick<Prisma.UserCreateInput, 'first_name' | 'last_name' | 'user_name'>
>;

export type TUser = Prettify<Omit<User, 'email'> & Email>;

export type TLoginCredentials = Pick<InsertUser, 'email' | 'password'>;

export type TPlainUser = Prettify<Omit<TUser, 'password'>>;

export interface ITokens {
	access_token: string;
	refresh_token: string;
	user: TPlainUser;
}
