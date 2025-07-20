import type { NextFunction, Request, Response } from 'express';
import type { ZodObject, ZodPipe } from 'zod';

/**
 * * Middleware to validate the request body using a Zod schema.
 *
 * @param schema A Zod validation schema/pipe (effects previously) to validate the request body.
 * @returns An asynchronous Express middleware function.
 */
const validateRequest = (schema: ZodObject | ZodPipe<ZodObject>) => {
	return async (req: Request, _res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync(req.body);
			next();
		} catch (error) {
			next(error);
		}
	};
};

export default validateRequest;
