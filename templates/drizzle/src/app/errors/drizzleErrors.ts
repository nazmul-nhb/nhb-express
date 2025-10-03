import { errorGuard } from '@/errors/ErrorGuard';
import type { IErrorResponse } from '@/types/interfaces';
import type { DrizzleQueryError } from 'drizzle-orm';
import { STATUS_CODES } from 'nhb-toolbox/constants';

export function handleDrizzleQueryError(
	error: DrizzleQueryError,
	stack?: string
): IErrorResponse {
	let message = 'Database Error! Please, try again later!',
		path = 'database',
		name = 'Database Error';

	if (errorGuard.isDrizzleErrorCause(error.cause)) {
		message = error.cause.detail;
		path = error.cause.table_name;
		name = `Database Error - ${error.cause.code}`;
	}

	return {
		name,
		statusCode: STATUS_CODES.BAD_REQUEST,
		errorSource: [{ message, path }],
		stack,
	};
}
