import type { NextFunction, Request, RequestHandler, Response } from 'express';

type Params = Record<string, string>;

/**
 * @function `catchAsync` A higher-order function that wraps an asynchronous Express request handler
 * to catch any errors and pass them to the global error handler middleware.
 * @param asyncFn - The asynchronous request handler function to be wrapped.
 * @returns A new request handler function that catches errors from the original handler.
 *
 * @example
 * // Example usage:
 * app.get('/route', catchAsync(async (req, res, next) => {
 *   const data = await someAsyncFunction();
 *   res.json(data);
 * }));
 */
const catchAsync = (asyncFn: RequestHandler<Params>) => {
	return async (req: Request<Params>, res: Response, next: NextFunction) => {
		try {
			await asyncFn(req, res, next);
		} catch (error) {
			next(error);
		}
	};
};

export default catchAsync;
