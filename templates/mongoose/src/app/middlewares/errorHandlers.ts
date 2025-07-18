import chalk from 'chalk';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ErrorWithStatus } from '../classes/ErrorWithStatus';
import configs from '../configs';
import { STATUS_CODES } from '../constants';
import processErrors from '../errors/processErrors';

/** * Middleware to Handle "Route Not Found" Errors.*/
export const handleRouteNotFound: RequestHandler = (req, _res, next) => {
	const error = new ErrorWithStatus(
		'Not Found Error',
		`Requested End-Point “${req.method}: ${req.path}” Not Found!`,
		STATUS_CODES.NOT_FOUND,
		req.path,
	);

	return next(error);
};

/** * Middleware to Handle Global Errors. */
export const catchAllErrors: ErrorRequestHandler = (err, _req, res, next) => {
	const { statusCode, name, errorSource, stack } = processErrors(err);

	// * Log error msg in the server console
	console.error(chalk.redBright.bold('🛑 Error(s) Occurred:'));
	errorSource.forEach((err) => {
		console.error(chalk.redBright(`	➡ ${err.message}`));
	});

	console.error(chalk.redBright(`🛑 ${err}`));

	// * Delegate to the default Express error handler
	// ? if the headers have already been sent to the client
	if (res.headersSent) {
		return next(err);
	}

	// * Send error response with status code
	res.status(statusCode).json({
		success: false,
		message: errorSource.map((err) => err.message).join(' | '),
		status: statusCode,
		errors: errorSource.map((source) => ({ name, ...source })),

		...(configs.NODE_ENV === 'development' && {
			stack: stack ? stack : 'Stack Trace Not Available!',
		}),
	});
};
