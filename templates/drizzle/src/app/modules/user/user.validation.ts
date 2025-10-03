import { users } from '#/drizzle/schema/users';
import { authValidations } from '@/modules/auth/auth.validation';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

/** Validation Schema for Creating new User */
const creationSchema = authValidations.loginSchema
	.extend({
		first_name: z.string({ error: 'First name is required!' }).trim(),
		last_name: z.string({ error: 'Last name is required!' }).trim(),
		user_name: z.string().optional(),
		confirm_password: z
			.string({ error: 'Password confirmation is required!' })
			.trim()
			.min(6, {
				message: 'Password must be at least 6 characters long!',
			})
			.max(64, {
				message: 'Password cannot be more than 64 characters!',
			}),
	})
	.refine((schema) => schema.password === schema.confirm_password, {
		path: ['confirm_password'],
		message: 'Passwords did not match!',
	})
	.strict()
	.transform(({ confirm_password: _, ...rest }) => rest);

/** Convert drizzle table schema to Zod schema */
const drizzleSchema = createInsertSchema(users);

/** User update Schema */
const updateSchema = z
	.object({
		first_name: z.string().trim(),
		last_name: z.string().trim(),
		user_name: z.string().trim(),
	})
	.partial()
	.strict();

/** User Validation Schema */
export const userValidations = { creationSchema, drizzleSchema, updateSchema };
