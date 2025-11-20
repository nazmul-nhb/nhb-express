import { errorGuard } from '@/errors/ErrorGuard';
import type { ErrorWithStatus } from '@/errors/ErrorWithStatus';
import { handlePrismaError } from '@/errors/prismaErrors';
import type { IErrorResponse, IParserError } from '@/types/interfaces';
import { HTTP_STATUS } from 'nhb-toolbox/constants';

/** * Process custom `ErrorWithStatus` */
export const handleErrorWithStatus = (
	error: ErrorWithStatus,
	stack?: string
): IErrorResponse => {
	return {
		statusCode: error.status,
		name: error.name,
		errorSource: [
			{
				path: error.path || 'unknown',
				message: error.message,
			},
		],
		stack,
	};
};

/** * Processes general Error objects. */
export const handleGenericError = (error: Error, stack?: string): IErrorResponse => {
	// ! Temporary fix for Prisma errors
	if (errorGuard.isPrismaError(error)) {
		return handlePrismaError(error);
	}

	return {
		statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
		name: error.name || 'Unexpected Error!',
		errorSource: [
			{
				path: 'unknown',
				message: error.message,
			},
		],
		stack,
	};
};

/** * Processes Express Body Parser Errors. */
export const handleParserError = (_error: IParserError, stack?: string): IErrorResponse => {
	return {
		statusCode: HTTP_STATUS.BAD_REQUEST,
		name: 'Invalid JSON Payload',
		errorSource: [
			{
				path: 'req.body',
				message: 'The provided JSON payload is invalid!',
			},
		],
		stack,
	};
};

export const genericErrors = {
	handleErrorWithStatus,
	handleGenericError,
	handleParserError,
};
