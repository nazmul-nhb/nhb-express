import catchAsync from '@/utilities/catchAsync';
import type { ZodObject, ZodOptional, ZodPipe } from 'zod';

/**
 * * Middleware to validate the request body using a Zod schema.
 *
 * @param schema A Zod validation schema/pipe (effects previously) to validate the request body.
 * @returns An asynchronous Express middleware function.
 */
const validateRequest = (schema: ZodObject | ZodOptional | ZodPipe) => {
	return catchAsync(async (req, _res, next) => {
		await schema.parseAsync(req.body);
		next();
	});
};

export default validateRequest;
